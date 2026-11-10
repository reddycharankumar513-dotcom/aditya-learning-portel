import assert from 'assert';
import { generateQuestionsForRole, evaluateInterviewSubmission, ROLE_QUESTION_BANKS } from '../services/interviewAIService.js';
import { analyzeResumeContent } from '../services/resumeAIService.js';

console.log('=== RUNNING LEARNOVA AUTOMATED TEST SUITE ===');

// -------------------------------------------------------------
// TEST 1: Question Generation across roles
// -------------------------------------------------------------
console.log('\n[TEST 1] Verifying question generation for supported roles...');
const testRoles = [
  'Full Stack Developer',
  'Python Developer',
  'AI Engineer',
  'DevOps Engineer', // Fallback to Full Stack
];

testRoles.forEach((role) => {
  const questions = generateQuestionsForRole(role, 'Technical', 'Fresher / Entry');
  assert.ok(Array.isArray(questions), `Questions for ${role} should be an array`);
  assert.ok(questions.length >= 3, `Expected at least 3 questions for ${role}, got ${questions.length}`);
  
  questions.forEach((q) => {
    assert.ok(q.id > 0, 'Question must have positive numeric id');
    assert.ok(q.question.length > 20, 'Question must have descriptive prompt');
    assert.ok(q.category, 'Question must have category assigned');
    assert.ok(Array.isArray(q.keyConcepts), 'Question must have keyConcepts array');
  });
  console.log(`  ✓ ${role}: generated ${questions.length} structured questions with categories & concepts`);
});

// -------------------------------------------------------------
// TEST 2: 6-Rubric Evaluation Weighted Logic
// -------------------------------------------------------------
console.log('\n[TEST 2] Verifying 6-Factor rubric weighted evaluation algorithm...');
const sampleQuestions = generateQuestionsForRole('Full Stack Developer', 'Technical', 'Fresher / Entry');

// Populate realistic high-quality answer for Question 1
sampleQuestions[0].studentAnswer = `
For 50k concurrent users, I would implement horizontal scaling with an API gateway.
Hot product data is cached in a Redis cluster with cache-aside patterns.
We employ database indexing in PostgreSQL using composite indexes on (tenant_id, created_at)
and manage connection pooling. For transactions, we utilize idempotency keys.
`;
sampleQuestions[0].timeSpentSeconds = 90;

// Populate brief answer for Question 2
sampleQuestions[1].studentAnswer = 'React uses Virtual DOM and fiber reconciliation.';
sampleQuestions[1].timeSpentSeconds = 30;

// Populate medium answer for Question 3
sampleQuestions[2].studentAnswer = 'Identified slow query using EXPLAIN ANALYZE and resolved full table scan with composite indexing.';
sampleQuestions[2].timeSpentSeconds = 60;

const evaluation = evaluateInterviewSubmission(sampleQuestions, 20);

assert.ok(evaluation.overallScore >= 0 && evaluation.overallScore <= 100, 'Score must be between 0 and 100');
assert.ok(evaluation.categoryScores.technicalKnowledge >= 0, 'Technical knowledge score must exist');
assert.ok(evaluation.categoryScores.answerRelevance >= 0, 'Answer relevance score must exist');
assert.ok(evaluation.categoryScores.problemSolving >= 0, 'Problem solving score must exist');
assert.ok(evaluation.categoryScores.communicationClarity >= 0, 'Communication clarity score must exist');
assert.ok(evaluation.categoryScores.answerStructure >= 0, 'Answer structure score must exist');
assert.ok(evaluation.categoryScores.timeManagement >= 0, 'Time management score must exist');

// Verify mathematical weighting formula
const expectedComposite = Math.round(
  evaluation.categoryScores.technicalKnowledge * 0.3 +
  evaluation.categoryScores.answerRelevance * 0.2 +
  evaluation.categoryScores.problemSolving * 0.2 +
  evaluation.categoryScores.communicationClarity * 0.15 +
  evaluation.categoryScores.answerStructure * 0.1 +
  evaluation.categoryScores.timeManagement * 0.05
);
assert.strictEqual(evaluation.overallScore, expectedComposite, 'Overall score must strictly adhere to 6-factor mathematical weights');

assert.ok(Array.isArray(evaluation.strengths) && evaluation.strengths.length > 0, 'Evaluation must yield strengths');
assert.ok(Array.isArray(evaluation.weaknesses) && evaluation.weaknesses.length > 0, 'Evaluation must yield weaknesses');
assert.ok(Array.isArray(evaluation.missingConcepts), 'Evaluation must report missing concepts');

console.log(`  ✓ Overall Score: ${evaluation.overallScore}/100`);
console.log(`  ✓ Technical Knowledge (30%): ${evaluation.categoryScores.technicalKnowledge}%`);
console.log(`  ✓ Answer Relevance (20%): ${evaluation.categoryScores.answerRelevance}%`);
console.log(`  ✓ Problem Solving (20%): ${evaluation.categoryScores.problemSolving}%`);
console.log(`  ✓ Communication Clarity (15%): ${evaluation.categoryScores.communicationClarity}%`);
console.log(`  ✓ Answer Structure (10%): ${evaluation.categoryScores.answerStructure}%`);
console.log(`  ✓ Time Management (5%): ${evaluation.categoryScores.timeManagement}%`);
console.log(`  ✓ Strengths: ${evaluation.strengths.length}`);
console.log(`  ✓ Missing Concepts Identified: ${evaluation.missingConcepts.join(', ') || 'None'}`);

// -------------------------------------------------------------
// TEST 3: Resume ATS Analysis & XYZ Formula Rewriter
// -------------------------------------------------------------
console.log('\n[TEST 3] Verifying Resume ATS extraction and XYZ suggestions...');
const sampleResume = `
Full Stack Developer
Skills: React, Node.js, TypeScript, MongoDB, Express, Git
Experience:
- Worked on web application with React and Node.js.
- Deployed microservices and scaled to 10,000 users with 35% latency reduction.
`;

const targetJD = 'Seeking Full Stack Developer proficient in React, Node.js, TypeScript, Docker, Redis, Kubernetes';

const resumeResult = analyzeResumeContent(sampleResume, 'Full Stack Developer', targetJD);

assert.ok(resumeResult.atsScore >= 50 && resumeResult.atsScore <= 100, 'ATS score must be valid percentage');
assert.ok(resumeResult.matchPercentage >= 40 && resumeResult.matchPercentage <= 100, 'JD match percentage must be valid');
assert.ok(resumeResult.extractedSkills.includes('React'), 'Must extract React');
assert.ok(resumeResult.extractedSkills.includes('TypeScript'), 'Must extract TypeScript');
assert.ok(resumeResult.missingKeywords.includes('Docker') || resumeResult.missingKeywords.includes('Redis'), 'Must identify missing keywords from JD');
assert.ok(resumeResult.bulletPointSuggestions.length > 0, 'Must provide XYZ bullet suggestions');

console.log(`  ✓ ATS Score: ${resumeResult.atsScore}/100`);
console.log(`  ✓ Match Percentage: ${resumeResult.matchPercentage}%`);
console.log(`  ✓ Extracted Skills: ${resumeResult.extractedSkills.join(', ')}`);
console.log(`  ✓ Missing Keywords: ${resumeResult.missingKeywords.join(', ')}`);
console.log(`  ✓ XYZ Suggestions: ${resumeResult.bulletPointSuggestions.length}`);

console.log('\n=============================================');
console.log(' ALL 3 AUTOMATED TEST SUITES PASSED CLEANLY! ');
console.log('=============================================\n');
