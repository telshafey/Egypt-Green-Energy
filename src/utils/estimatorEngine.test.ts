import { evaluateProjectRequirements, ProjectEstimatorInput } from './estimatorEngine';

/**
 * Unit Test for Project Requirements Estimator Engine
 * Tests boundary conditions, progressive disclosure fields, and disclaimer integrity
 */
export function runEstimatorTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      results.push(`✓ PASS: ${message}`);
    } else {
      results.push(`✗ FAIL: ${message}`);
      allPassed = false;
    }
  };

  // Test 1: Standard Office with CCTV & Fire
  const input1: ProjectEstimatorInput = {
    facilityType: 'office',
    areaM2: 1500,
    selectedSystems: ['cctv', 'fire'],
    floorsCount: 3,
    projectType: 'new_construction',
    engineeringDrawingsAvailable: 'no',
  };
  const output1 = evaluateProjectRequirements(input1);

  assert(output1.referenceNumber.startsWith('EGE-'), 'Reference number format matches EGE-YEAR-XXXXX');
  assert(output1.selectedSystemsCount === 2, 'Evaluates correct number of selected systems');
  assert(output1.systemAssessments.length === 2, 'Generates assessment for all selected systems');
  assert(output1.missingDataRequiredAr.length > 0, 'Flags missing architectural drawings when drawingsAvailable is no');
  assert(output1.formalDisclaimerAr.includes('تقديراً أولياً'), 'Includes mandatory preliminary disclaimer in Arabic');

  // Test 2: Industrial Plant with Cabling & BMS
  const input2: ProjectEstimatorInput = {
    facilityType: 'industrial',
    areaM2: 8000,
    selectedSystems: ['cabling', 'bms'],
    infrastructureStatus: 'needs_full_containment',
  };
  const output2 = evaluateProjectRequirements(input2);

  assert(output2.systemAssessments.some((s) => s.code === 'bms'), 'Includes BMS considerations for industrial plant');
  assert(output2.missingDataRequiredAr.some((m) => m.includes('مسارات التمديدات')), 'Flags containment survey requirement');

  // Test 3: No False Naive Quantities
  // Check that the engine does NOT output misleading exact counts
  const outputJson = JSON.stringify(output1);
  assert(!outputJson.includes('"camerasCount":'), 'Engine does not output naive exact camera count numbers');
  assert(!outputJson.includes('"fireDetectorsCount":'), 'Engine does not output naive exact fire detector counts');

  return { passed: allPassed, results };
}
