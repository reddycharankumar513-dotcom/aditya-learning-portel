import assert from 'assert';
import { AIService } from '../services/ai/AIService.js';
import { AIProviderFactory } from '../services/ai/AIProviderFactory.js';
import { AIResponseValidator } from '../services/ai/AIResponseValidator.js';
import { ResumeParserService } from '../services/resumeParserService.js';
import { Assessment } from '../models/Assessment.js';

async function runAIIntegrationTests() {
  console.log('\n=== RUNNING LEARNOVA AI SKILL & RESUME INTEGRATION TESTS ===\n');

  // TEST 1: AI Question Generation & Multi-Role Synthesis
  console.log('[TEST 1] Testing dynamic AI question synthesis for supported engineering roles...');
  const rolesToTest = [
    { role: 'Python Developer', skill: 'Python' },
    { role: 'Frontend Developer', skill: 'React' },
    { role: 'Backend Developer', skill: 'Node.js' },
    { role: 'Cloud & DevOps Engineer', skill: 'Cloud Architecture & Docker' },
  ];

  for (const { role, skill } of rolesToTest) {
    const res = await AIService.generateAssessmentQuestions({
      role,
      skill,
      difficulty: 'Intermediate',
      count: 4,
    });

    assert(res.questions.length >= 3, `Expected at least 3 questions for ${role}, got ${res.questions.length}`);
    for (const q of res.questions) {
      assert(q.id > 0, 'Question must have a positive sequential ID');
      assert(typeof q.question === 'string' && q.question.length > 10, 'Question must have descriptive text');
      assert(Array.isArray(q.options) && q.options.length >= 2, 'Question must contain valid options');
      assert(typeof q.correctAnswer === 'number', 'Question must have numeric answer index');
      assert(typeof q.explanation === 'string' && q.explanation.length > 10, 'Question must have explanation');
    }
    console.log(`  ✓ ${role} (${skill}): generated ${res.questions.length} questions across topics (via ${res.provider})`);
  }

  // TEST 2: Anti-Tamper Security (Client View Sanitization)
  console.log('\n[TEST 2] Testing Anti-Tamper Security: Answer key separation before submission...');
  const mockAssessment = new Assessment({
    user: '507f1f77bcf86cd799439011',
    title: 'Security Verification Assessment',
    role: 'Cybersecurity Engineer',
    skill: 'Application Security',
    difficulty: 'Advanced',
    status: 'in_progress',
    questions: [
      {
        id: 1,
        question: 'What is the primary countermeasure against SQL Injection?',
        options: ['Parameterized queries', 'Base64 encoding', 'Client-side regex', 'Disabling cookies'],
        correctAnswer: 0,
        explanation: 'Parameterized queries ensure user input is treated as literal parameters rather than executable SQL commands.',
        evaluationCriteria: 'OWASP injection defenses',
        maxMarks: 2,
      },
    ],
  });

  const safeView = mockAssessment.toSafeStudentView();
  assert(safeView.questions[0].correctAnswer === undefined, 'CRITICAL SECURITY FAIL: correctAnswer leaked to client!');
  assert(safeView.questions[0].explanation === undefined, 'CRITICAL SECURITY FAIL: explanation leaked to client!');
  assert(safeView.questions[0].evaluationCriteria === undefined, 'CRITICAL SECURITY FAIL: evaluationCriteria leaked to client!');
  assert(safeView.questions[0].question.length > 0, 'Question text must remain accessible');
  console.log('  ✓ Verified: correctAnswer, explanation, and criteria are strictly stripped on active student views.');

  // TEST 3: Subjective / Coding Answer Evaluation
  console.log('\n[TEST 3] Testing AI Subjective & Code Answer Evaluation...');
  const evalResult = await AIService.evaluateAnswer({
    question: 'How do compound indexes in MongoDB optimize query performance and what is the ESR rule?',
    expectedConcepts: 'Equality, Sort, Range order in compound indexes',
    studentAnswer: 'In MongoDB, compound indexes optimize queries following the ESR rule: Equality filters first, Sort fields second, and Range filters last. This minimizes index scanning and avoids in-memory sorts.',
    maxScore: 10,
  });

  assert(evalResult.score >= 6, `Expected passing score for accurate answer, got ${evalResult.score}`);
  assert(evalResult.isPassing === true, 'Expected isPassing to be true');
  assert(Array.isArray(evalResult.strengths), 'Expected strengths array');
  assert(typeof evalResult.feedback === 'string', 'Expected feedback string');
  console.log(`  ✓ Evaluated answer: Awarded ${evalResult.score}/10 (${evalResult.percentage}%) with concept feedback.`);

  // TEST 4: Resume Parsing & Information Extraction
  console.log('\n[TEST 4] Testing Resume Parsing Engine (Skills, Contacts, Sections)...');
  const sampleResumeText = `
ADITYA CHARAN KUMAR
Full Stack & AI Engineer
Email: aditya.charan@example.com | Phone: 9876543210
GitHub: github.com/adityacharan | LinkedIn: linkedin.com/in/adityacharan

SUMMARY
High-impact software engineer specializing in scalable React microfrontends, Node.js REST services, and MongoDB database optimization.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
Frameworks: React 19, Node.js, Express, Next.js, Tailwind CSS
Tools & Cloud: Docker, Git, AWS (S3, EC2), Redis, Microservices

PROJECTS
Enterprise Career Intelligence Platform
- Architected responsive web application in React 19 serving 10,000+ daily active learners.
- Engineered high-throughput Express REST APIs with compound MongoDB indexing, reducing P95 query times by 42%.
- Integrated Redis caching layer, decreasing database load by 35%.

EDUCATION
B.Tech in Computer Science and Engineering — Class of 2026
Aditya University
`;

  const parsed = ResumeParserService.parseText(sampleResumeText);
  assert(parsed.personalInfo.email === 'aditya.charan@example.com', 'Failed to extract email');
  assert(parsed.personalInfo.github?.includes('github.com/adityacharan'), 'Failed to extract GitHub link');
  assert(parsed.skills.includes('TypeScript'), 'Failed to extract TypeScript skill');
  assert(parsed.skills.includes('React'), 'Failed to extract React skill');
  assert(parsed.skills.includes('MongoDB'), 'Failed to extract MongoDB skill');
  assert(parsed.projects.length >= 1, 'Failed to extract projects');
  console.log(`  ✓ Extracted ${parsed.skills.length} skills, contact info, and ${parsed.projects.length} project(s).`);

  // TEST 5: 7-Factor Resume Scoring & XYZ Bullet Enhancements
  console.log('\n[TEST 5] Testing 7-Factor Resume Analysis & Google XYZ Recommendations...');
  const resumeAnalysis = await AIService.analyzeResume({
    resumeText: sampleResumeText,
    targetRole: 'Full Stack Developer',
  });

  assert(resumeAnalysis.overallScore >= 60 && resumeAnalysis.overallScore <= 100, `Score out of bounds: ${resumeAnalysis.overallScore}`);
  assert(resumeAnalysis.sectionScores.skillsRelevance <= 25, 'Skills score exceeds 25');
  assert(resumeAnalysis.sectionScores.projectsExperience <= 20, 'Projects score exceeds 20');
  assert(resumeAnalysis.sectionScores.experienceInternships <= 15, 'Experience score exceeds 15');
  assert(resumeAnalysis.bulletPointSuggestions.length >= 1, 'Expected at least 1 XYZ bullet improvement');
  
  const sugg = resumeAnalysis.bulletPointSuggestions[0];
  assert(sugg.original && sugg.improved && sugg.reason, 'Bullet suggestion must have original, improved, and reason');
  console.log(`  ✓ Overall Score: ${resumeAnalysis.overallScore}/100 across 7 pillars.`);
  console.log(`  ✓ XYZ Suggestion: "${sugg.improved.slice(0, 75)}..."`);

  // TEST 6: Job Description Semantic Matching
  console.log('\n[TEST 6] Testing Job Description Semantic Matcher...');
  const jdText = `
We are looking for a Senior Full Stack Engineer.
Required: React, TypeScript, Node.js, REST APIs, Microservices, MongoDB.
Preferred: Kubernetes, Redis Caching, Kafka, AWS ECS.
`;

  const matchRes = await AIService.matchJobDescription({
    resumeText: sampleResumeText,
    jobDescription: jdText,
  });

  assert(matchRes.matchPercentage >= 50, 'Expected match percentage >= 50');
  assert(matchRes.matchingSkills.includes('React'), 'Expected matching skills to include React');
  assert(Array.isArray(matchRes.missingSkills), 'Expected missing skills array');
  console.log(`  ✓ Job Match Ratio: ${matchRes.matchPercentage}% (Matching: ${matchRes.matchingSkills.length}, Missing: ${matchRes.missingSkills.length})`);

  // TEST 7: Multi-Provider Failover & Offline Resilience
  console.log('\n[TEST 7] Testing Multi-Provider Failover & Offline Resilience...');
  const primary = AIProviderFactory.getPrimaryProvider();
  assert(primary !== null, 'Primary AI provider must not be null');
  assert(typeof primary.name === 'string', 'Provider must have name');
  assert(primary.isConfigured() === true, 'Primary provider must be configured');

  const fallbacks = AIProviderFactory.getFallbackProviders(primary.name);
  assert(fallbacks.some(p => p.name === 'rule-engine'), 'Rule-engine must always be present as ultimate safety fallback');
  console.log(`  ✓ Primary Provider: ${primary.name} (${primary.defaultModel})`);
  console.log(`  ✓ Fallback Chain: [${fallbacks.map(f => f.name).join(' -> ')}]`);

  console.log('\n===============================================================');
  console.log(' ALL 7 AI SKILL & RESUME INTEGRATION TESTS PASSED CLEANLY! ');
  console.log('===============================================================\n');
}

runAIIntegrationTests().catch((err) => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});
