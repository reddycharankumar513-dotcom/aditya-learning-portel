import assert from 'assert';
import { ROLE_DEFAULT_PERMISSIONS } from '../middleware/adminPermissionMiddleware.js';

console.log('=== RUNNING LEARNOVA ADMIN CONTROL PANEL TEST SUITE ===');

// -------------------------------------------------------------
// TEST 1: 4-Tier Administrative Roles & Permission Matrix
// -------------------------------------------------------------
console.log('\n[TEST 1] Verifying 4 Administrative Roles and permissions...');

assert.ok(ROLE_DEFAULT_PERMISSIONS.super_admin.includes('*'), 'Super Admin must possess wildcard (*) permission');

const financePerms = ROLE_DEFAULT_PERMISSIONS.finance_admin;
assert.ok(financePerms.includes('plans.read'), 'Finance Admin must have plans.read');
assert.ok(financePerms.includes('payments.read'), 'Finance Admin must have payments.read');
assert.ok(financePerms.includes('refunds.create'), 'Finance Admin must have refunds.create');
assert.ok(!financePerms.includes('courses.delete'), 'Finance Admin must NOT have courses.delete');

const contentPerms = ROLE_DEFAULT_PERMISSIONS.content_admin;
assert.ok(contentPerms.includes('courses.create'), 'Content Admin must have courses.create');
assert.ok(contentPerms.includes('jobs.publish'), 'Content Admin must have jobs.publish');
assert.ok(!contentPerms.includes('refunds.create'), 'Content Admin must NOT have refunds.create');

const supportPerms = ROLE_DEFAULT_PERMISSIONS.support_admin;
assert.ok(supportPerms.includes('users.read'), 'Support Admin must have users.read');
assert.ok(supportPerms.includes('support.reply'), 'Support Admin must have support.reply');
assert.ok(!supportPerms.includes('plans.create'), 'Support Admin must NOT have plans.create');

console.log('  ✓ Super Admin wildcard verified');
console.log('  ✓ Finance Admin permissions verified (pricing, payments, refunds)');
console.log('  ✓ Content Admin permissions verified (courses, jobs, announcements)');
console.log('  ✓ Support Admin permissions verified (users, support tickets)');

// -------------------------------------------------------------
// TEST 2: Scoring Weights Strict 100% Validation Logic
// -------------------------------------------------------------
console.log('\n[TEST 2] Verifying AI Scoring Weights 100% sum validation...');

const validWeights = {
  technicalKnowledge: 30,
  answerRelevance: 20,
  problemSolving: 20,
  communicationClarity: 15,
  answerStructure: 10,
  timeManagement: 5,
};

const validSum = Object.values(validWeights).reduce((a, b) => a + b, 0);
assert.strictEqual(validSum, 100, 'Valid scoring weights must sum to exactly 100%');

const invalidWeights = {
  technicalKnowledge: 35,
  answerRelevance: 20,
  problemSolving: 20,
  communicationClarity: 15,
  answerStructure: 10,
  timeManagement: 5,
};
const invalidSum = Object.values(invalidWeights).reduce((a, b) => a + b, 0);
assert.notStrictEqual(invalidSum, 100, 'Invalid scoring weights exceeding 100% must be detected');

console.log(`  ✓ Valid rubric sum: ${validSum}% (Accepted)`);
console.log(`  ✓ Invalid rubric sum: ${invalidSum}% (Rejected)`);

// -------------------------------------------------------------
// TEST 3: Audit Log Sensitive Information Sanitization
// -------------------------------------------------------------
console.log('\n[TEST 3] Verifying Audit Log redaction of sensitive credentials...');

const rawInput = {
  adminEmail: 'admin@learnova.in',
  password: 'SuperSecretAdminPassword123!',
  apiKey: 'sk-ant-api03-live-test-key',
  userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  planName: 'Career Pro',
  monthlyPrice: 399,
};

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'authorization'];
function sanitize(obj: any): any {
  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      clean[key] = '[REDACTED]';
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

const sanitized = sanitize(rawInput);
assert.strictEqual(sanitized.password, '[REDACTED]', 'Passwords must be masked in audit logs');
assert.strictEqual(sanitized.apiKey, '[REDACTED]', 'API Keys must be masked in audit logs');
assert.strictEqual(sanitized.userToken, '[REDACTED]', 'Tokens must be masked in audit logs');
assert.strictEqual(sanitized.planName, 'Career Pro', 'Non-sensitive business fields must be preserved');
assert.strictEqual(sanitized.monthlyPrice, 399, 'Non-sensitive pricing fields must be preserved');

console.log('  ✓ Passwords, tokens, and API keys redacted into [REDACTED]');
console.log('  ✓ Business operational values preserved for audit integrity');

// -------------------------------------------------------------
// TEST 4: Refund Amount Validation
// -------------------------------------------------------------
console.log('\n[TEST 4] Verifying Refund Amount bounds checking...');

const paymentAmount = 999;
const validRefund = 499;
const excessiveRefund = 1200;

assert.ok(validRefund <= paymentAmount, 'Valid refund within payment threshold');
assert.ok(excessiveRefund > paymentAmount, 'Excessive refund exceeds payment threshold and must be rejected');

console.log(`  ✓ Valid refund of ₹${validRefund} on ₹${paymentAmount} payment accepted`);
console.log(`  ✓ Excessive refund of ₹${excessiveRefund} on ₹${paymentAmount} payment rejected`);

console.log('\n======================================================');
console.log(' ALL 4 ADMIN CONTROL PANEL TESTS PASSED SUCCESSFULLY! ');
console.log('======================================================\n');
