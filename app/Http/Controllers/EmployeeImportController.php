<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EmployeeImportController extends Controller
{
    /**
     * Download a sample CSV template for employee bulk import.
     */
    public function sampleCsv(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="employee_import_template.csv"',
        ];

        $columns = [
            'name',
            'employee_id',
            'phone',
            'email',
            'department',
            'designation',
            'meal_preference',
            'lunch_enabled',
            'dinner_enabled',
        ];

        $sampleData = [
            [
                'Abdullah Al Mamun',
                'EMP-101',
                '+880 1712-112233',
                'mamun@office.com',
                'Software Engineering',
                'Senior Developer',
                'Standard',
                '1',
                '0',
            ],
            [
                'Farzana Rahman',
                'EMP-102',
                '+880 1812-445566',
                'farzana@office.com',
                'Quality Assurance',
                'QA Lead',
                'Vegetarian',
                '1',
                '1',
            ],
            [
                'Tariqul Islam',
                'EMP-103',
                '+880 1912-778899',
                'tariq@office.com',
                'Product Design',
                'UI/UX Designer',
                'Non-Veg',
                '1',
                '0',
            ],
        ];

        $callback = function () use ($columns, $sampleData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($sampleData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Process bulk employee CSV import.
     */
    public function import(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Enforce client isolation
        $targetClientId = $user->isClientAdmin()
            ? $user->client_id
            : $request->input('client_id');

        if (empty($targetClientId)) {
            return back()->with('error', 'Please select a client organization for import.');
        }

        $client = Client::findOrFail($targetClientId);

        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('csv_file');
        $filePath = $file->getRealPath();

        $rows = [];
        if (($handle = fopen($filePath, 'r')) !== false) {
            $header = null;
            while (($row = fgetcsv($handle, 2000, ',')) !== false) {
                // Skip empty rows
                if (count(array_filter($row)) === 0) {
                    continue;
                }

                if (! $header) {
                    // Normalize header keys (lowercase, trim)
                    $header = array_map(fn ($k) => strtolower(trim(str_replace(['"', "'", "\xEF\xBB\xBF"], '', $k))), $row);
                } else {
                    if (count($row) === count($header)) {
                        $rows[] = array_combine($header, array_map('trim', $row));
                    }
                }
            }
            fclose($handle);
        }

        if (empty($rows)) {
            return back()->with('error', 'The uploaded CSV file is empty or format is invalid.');
        }

        $validPreferences = array_map('strtolower', Employee::MEAL_PREFERENCES);
        $existingEmployeeIds = Employee::where('client_id', $client->id)
            ->pluck('employee_id')
            ->map(fn ($id) => strtolower($id))
            ->toArray();

        $seenInFile = [];
        $successful = 0;
        $duplicates = 0;
        $failed = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2; // +1 for 0-index, +1 for header
                $rowErrors = [];

                $name = $row['name'] ?? null;
                $employeeId = $row['employee_id'] ?? null;
                $phone = $row['phone'] ?? null;
                $email = $row['email'] ?? null;
                $department = $row['department'] ?? null;
                $designation = $row['designation'] ?? null;
                $mealPreference = $row['meal_preference'] ?? 'Standard';
                $lunchEnabled = in_array(strtolower($row['lunch_enabled'] ?? '1'), ['1', 'true', 'yes'], true);
                $dinnerEnabled = in_array(strtolower($row['dinner_enabled'] ?? '0'), ['1', 'true', 'yes'], true);

                $isDuplicate = false;

                // Validation 1: Missing employee name
                if (empty($name)) {
                    $rowErrors[] = 'Missing employee name';
                }

                // Validation 2: Missing or Duplicate employee ID
                if (empty($employeeId)) {
                    $rowErrors[] = 'Missing employee ID';
                } else {
                    $normalizedEmpId = strtolower($employeeId);
                    if (in_array($normalizedEmpId, $existingEmployeeIds, true) || in_array($normalizedEmpId, $seenInFile, true)) {
                        $duplicates++;
                        $isDuplicate = true;
                        $errors[] = "Row {$rowNumber} (" . ($name ?: 'Unnamed') . "): Duplicate employee ID '{$employeeId}' for this organization";
                    } else {
                        $seenInFile[] = $normalizedEmpId;
                    }
                }

                if ($isDuplicate) {
                    continue;
                }

                // Validation 3: Invalid Phone (if provided)
                if (! empty($phone) && strlen($phone) > 30) {
                    $rowErrors[] = 'Phone number exceeds 30 characters';
                }

                // Validation 4: Invalid Meal Preference
                if (! empty($mealPreference) && ! in_array(strtolower($mealPreference), $validPreferences, true)) {
                    $rowErrors[] = "Invalid meal preference '{$mealPreference}'. Supported: " . implode(', ', Employee::MEAL_PREFERENCES);
                }

                if (! empty($rowErrors)) {
                    $failed++;
                    $errors[] = "Row {$rowNumber} (" . ($name ?: 'Unnamed') . '): ' . implode('; ', $rowErrors);
                    continue;
                }

                // Map matched preference casing
                $normalizedPref = 'Standard';
                foreach (Employee::MEAL_PREFERENCES as $pref) {
                    if (strtolower($pref) === strtolower($mealPreference)) {
                        $normalizedPref = $pref;
                        break;
                    }
                }

                Employee::create([
                    'client_id' => $client->id,
                    'name' => $name,
                    'employee_id' => $employeeId,
                    'phone' => $phone ?: null,
                    'email' => $email ?: null,
                    'department' => $department ?: null,
                    'designation' => $designation ?: null,
                    'meal_preference' => $normalizedPref,
                    'lunch_enabled' => $lunchEnabled,
                    'dinner_enabled' => $dinnerEnabled,
                    'status' => 'active',
                ]);

                $existingEmployeeIds[] = strtolower($employeeId);
                $successful++;
            }

            $client->syncEmployeeCount();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Import failed due to a database error: ' . $e->getMessage());
        }

        $summaryMessage = "Import completed for {$client->name}: {$successful} created, {$duplicates} duplicates skipped, {$failed} errors.";

        return back()
            ->with('success', $summaryMessage)
            ->with('importReport', [
                'successful' => $successful,
                'duplicates' => $duplicates,
                'failed' => $failed,
                'errors' => array_slice($errors, 0, 10), // return top errors
            ]);
    }
}
