import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Play, Code, 
  Cpu, Award, Briefcase, FileText, ChevronRight, Zap, Target, 
  BarChart3, Star, Users, Compass, Terminal, Check
} from 'lucide-react';
import { AIIntelligenceSphere } from '../components/3d/AIIntelligenceSphere';
import { FloatingSkillCards } from '../components/home/FloatingSkillCards';

export const Home: React.FC = () => {
  return (
    <div className="bg-[#080B18] text-[#F5F7FF] min-h-screen overflow-hidden selection:bg-[#8065FF] selection:text-white">
      
      {/* =========================================================================
          SECTION 2: 3D HERO SECTION
         ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-white/[0.06]">
        {/* Ambient background lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#8065FF]/20 via-[#32C8F5]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#32C8F5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Headline & Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#8065FF]/30 text-xs font-semibold text-[#A68BFF] shadow-glow-violet">
                <Sparkles className="w-3.5 h-3.5 text-[#32C8F5] animate-pulse" />
                <span>Next-Gen AI Career Intelligence Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D6A0]" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.12]">
                Your Future Starts With What You <span className="gradient-text">Learn Today.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#A6B0C8] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Learn smarter. Practice with AI. Build your skills. Prepare for your dream career with Learnova. The unified ecosystem that guides you from concept mastery to verified technical job offers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8065FF] via-[#6A4DFF] to-[#32C8F5] text-white font-bold text-sm shadow-glow-violet hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 group"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/student/interviews/new"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel hover:bg-white/10 text-white font-semibold text-sm border border-white/15 hover:border-[#32C8F5]/40 transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <Play className="w-4 h-4 text-[#32C8F5] fill-[#32C8F5]" />
                  <span>Explore AI Interviews</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#A6B0C8]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#30D6A0]" />
                  <span>6-Rubric AI Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#30D6A0]" />
                  <span>13+ Supported Engineering Roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#30D6A0]" />
                  <span>Zero AI Hallucination Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Interactive AI Sphere & Floating UI Cards (5 Cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[480px]">
                {/* 3D Scene */}
                <AIIntelligenceSphere />

                {/* Floating Glassmorphism Data Cards */}
                <FloatingSkillCards careerReadiness={78} interviewScore={86} skillsMastered={14} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PRODUCT BENEFITS (LEARN → BUILD → PROVE → GET HIRED)
         ========================================================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#32C8F5]">
              The Core Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              The Proven 4-Stage Career Highway
            </h2>
            <p className="text-sm sm:text-base text-[#A6B0C8]">
              Traditional learning stops at video tutorials. LEARNOVA bridges every milestone through automated intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. LEARN */}
            <div className="glass-card-interactive rounded-3xl p-6 relative group overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#8065FF]/20 border border-[#8065FF]/40 flex items-center justify-center text-[#8065FF] mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A68BFF] font-semibold">Stage 01</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1 mb-2">LEARN</h3>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Adaptive AI learning modules across Artificial Intelligence, Full Stack, Data Science, and Cloud Architecture with real-time concept explainers.
              </p>
            </div>

            {/* 2. BUILD */}
            <div className="glass-card-interactive rounded-3xl p-6 relative group overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#32C8F5]/20 border border-[#32C8F5]/40 flex items-center justify-center text-[#32C8F5] mb-5 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#32C8F5] font-semibold">Stage 02</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1 mb-2">BUILD</h3>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Develop real-world industry capstones and practice coding in Python, Java, JS, C++, and SQL inside secure, isolated sandboxes.
              </p>
            </div>

            {/* 3. PROVE */}
            <div className="glass-card-interactive rounded-3xl p-6 relative group overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#F4B860]/20 border border-[#F4B860]/40 flex items-center justify-center text-[#F4B860] mb-5 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#F4B860] font-semibold">Stage 03</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1 mb-2">PROVE</h3>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Simulate high-pressure AI mock interviews with 6-rubric scoring (Technical, Relevance, Problem Solving, Clarity, Structure, Timing).
              </p>
            </div>

            {/* 4. GET HIRED */}
            <div className="glass-card-interactive rounded-3xl p-6 relative group overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#30D6A0]/20 border border-[#30D6A0]/40 flex items-center justify-center text-[#30D6A0] mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#30D6A0] font-semibold">Stage 04</span>
              <h3 className="text-xl font-heading font-bold text-white mt-1 mb-2">GET HIRED</h3>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Connect directly with recruiters through the Career Hub with AI skill-matching, ATS resume tuning, and student-consented talent discovery.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW LEARNOVA WORKS
         ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-[#10162A]/60 border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#8065FF]">
              Workflow Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              How LEARNOVA Accelerates Your Career
            </h2>
            <p className="text-sm sm:text-base text-[#A6B0C8]">
              A continuous intelligence loop engineered to identify your gaps and convert them into competitive advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-3xl p-6 relative">
              <div className="text-4xl font-heading font-black text-white/10 mb-2">01</div>
              <h4 className="text-lg font-heading font-bold text-white mb-2">Diagnose & Benchmark</h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Take a rapid technical assessment. Our diagnostic engine maps your competencies against current hiring benchmarks to establish your baseline Career Readiness score.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 relative border-[#8065FF]/30">
              <div className="text-4xl font-heading font-black text-[#8065FF]/20 mb-2">02</div>
              <h4 className="text-lg font-heading font-bold text-white mb-2">Drill With AI Mock Interviews</h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Face realistic technical, behavioral, and system design interviews tailored to 13+ engineering roles. Receive instant rubric feedback, missing concept flags, and model answer upgrades.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 relative">
              <div className="text-4xl font-heading font-black text-white/10 mb-2">03</div>
              <h4 className="text-lg font-heading font-bold text-white mb-2">Unlock Curated Opportunities</h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Tune your resume with ATS keyword matching, track applications in one unified pipeline, and let authorized employers discover your verified performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: AI MOCK INTERVIEW SHOWCASE
         ========================================================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/10 text-[#A68BFF] text-xs font-semibold border border-[#8065FF]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#32C8F5]" />
                <span>Industry First AI Evaluator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
                Practice Like You’re In The Room. <span className="gradient-text">Score Like A Principal Engineer.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#A6B0C8] leading-relaxed">
                Generic chatbots give generic praise. Learnova evaluates your answers using verifiable engineering standards across 6 weighted categories:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="glass-panel rounded-xl p-3 border-l-2 border-l-[#8065FF]">
                  <span className="font-bold text-white block">Technical Knowledge</span>
                  <span className="text-[#A6B0C8]">30% Weight • Concept accuracy</span>
                </div>
                <div className="glass-panel rounded-xl p-3 border-l-2 border-l-[#32C8F5]">
                  <span className="font-bold text-white block">Answer Relevance</span>
                  <span className="text-[#A6B0C8]">20% Weight • Addressing core prompt</span>
                </div>
                <div className="glass-panel rounded-xl p-3 border-l-2 border-l-[#30D6A0]">
                  <span className="font-bold text-white block">Problem Solving</span>
                  <span className="text-[#A6B0C8]">20% Weight • Trade-offs & debugging</span>
                </div>
                <div className="glass-panel rounded-xl p-3 border-l-2 border-l-[#F4B860]">
                  <span className="font-bold text-white block">Communication Clarity</span>
                  <span className="text-[#A6B0C8]">15% Weight • Articulation & structure</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/student/interviews/new"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#8065FF] hover:bg-[#6A4DFF] text-white font-semibold text-xs shadow-glow-violet transition-colors"
                >
                  <span>Launch Text or Voice Mock Drill</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Live Interactive Evaluation Card Preview */}
            <div className="lg:col-span-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark relative">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Full Stack Developer Interview</div>
                      <div className="text-[10px] text-[#A6B0C8]">System Design & Scalability Drills</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-mono text-[#30D6A0] font-bold">Evaluated</span>
                    <div className="text-lg font-heading font-black text-white">88/100</div>
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#32C8F5]">Question 01</span>
                    <p className="text-xs text-white mt-1 font-medium">
                      "Explain how you design a scalable microservices architecture for an e-commerce platform handling 50k concurrent users."
                    </p>
                  </div>

                  <div className="bg-[#10162A] rounded-2xl p-4 border border-[#8065FF]/30">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#A68BFF]">AI Feedback</span>
                    <p className="text-xs text-[#A6B0C8] mt-1 leading-relaxed">
                      "Strong answer! You properly identified Redis caching and composite indexing on (tenant_id, created_at). To reach top percentile, explicitly mention the Saga pattern for distributed checkout transactions."
                    </p>
                  </div>
                </div>

                {/* Rubric Breakdown Progress Bars */}
                <div className="space-y-2 pt-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#A6B0C8]">Technical Knowledge (30%)</span>
                      <span className="text-white font-bold">92%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#8065FF] rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#A6B0C8]">Problem Solving & Trade-offs (20%)</span>
                      <span className="text-white font-bold">88%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CAREER READINESS & RADAR SHOWCASE
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#10162A]/50 border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel rounded-3xl p-6 text-center">
                  <div className="text-3xl font-heading font-black text-white">78%</div>
                  <div className="text-xs font-semibold text-[#A6B0C8] mt-1">Overall Readiness</div>
                  <div className="text-[10px] text-[#30D6A0] mt-2">+14% this month</div>
                </div>
                <div className="glass-panel rounded-3xl p-6 text-center">
                  <div className="text-3xl font-heading font-black text-[#32C8F5]">84%</div>
                  <div className="text-xs font-semibold text-[#A6B0C8] mt-1">Mock Interview Avg</div>
                  <div className="text-[10px] text-[#32C8F5] mt-2">5 sessions completed</div>
                </div>
                <div className="glass-panel rounded-3xl p-6 text-center">
                  <div className="text-3xl font-heading font-black text-[#8065FF]">80%</div>
                  <div className="text-xs font-semibold text-[#A6B0C8] mt-1">Verified Skills</div>
                  <div className="text-[10px] text-[#A68BFF] mt-2">12 competencies</div>
                </div>
                <div className="glass-panel rounded-3xl p-6 text-center">
                  <div className="text-3xl font-heading font-black text-[#F4B860]">82%</div>
                  <div className="text-xs font-semibold text-[#A6B0C8] mt-1">ATS Resume Score</div>
                  <div className="text-[10px] text-[#F4B860] mt-2">JD Match Ready</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#30D6A0]">
                Quantitative Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                An Explainable Career Readiness Score You Can Trust
              </h2>
              <p className="text-sm text-[#A6B0C8] leading-relaxed">
                No black-box percentages. Your Learnova score is calculated continuously from your verified coding submissions, mock interview transcript evaluations, project repositories, and ATS resume keyword coverage.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#30D6A0]/20 flex items-center justify-center text-[#30D6A0] mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-[#A6B0C8]">
                    <strong className="text-white">Identifies critical skill gaps:</strong> Tells you exactly what topics to study before your real interviews.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#30D6A0]/20 flex items-center justify-center text-[#30D6A0] mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-[#A6B0C8]">
                    <strong className="text-white">Transparent to employers:</strong> Employers see verified evidence of your problem solving rather than buzzwords.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: RESUME ANALYZER SHOWCASE
         ========================================================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#32C8F5]">
              AI Resume Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Optimize Every Bullet Point For Applicant Tracking Systems
            </h2>
            <p className="text-sm text-[#A6B0C8]">
              Upload your resume and match it directly against job descriptions to discover missing keywords and rewrite bullet points into high-impact XYZ achievements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-card-dark">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-[#A6B0C8]">ATS Compliance Score</div>
                <div className="text-3xl font-heading font-bold text-white mt-1">84/100</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-[#A6B0C8]">Job Description Match</div>
                <div className="text-3xl font-heading font-bold text-[#32C8F5] mt-1">82%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-[#A6B0C8]">Missing High-Priority Tech</div>
                <div className="text-sm font-semibold text-[#F4B860] mt-2">Redis • CI/CD • Docker</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white">
                Automated Bullet Point Optimization (XYZ Formula)
              </h4>
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs">
                <span className="font-bold text-[#FF647C] block mb-1">Before (Passive):</span>
                <span className="text-[#A6B0C8]">"Worked on building frontend features for our college management web app."</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#30D6A0]/10 border border-[#30D6A0]/30 text-xs">
                <span className="font-bold text-[#30D6A0] block mb-1">After (Learnova AI Enhanced):</span>
                <span className="text-white">"Architected responsive frontend components in React 19 with modular state, decreasing initial page load latency by 42% across 12,000 active students."</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/student/resume"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-semibold text-xs shadow-glow-violet hover:opacity-90 transition-all"
              >
                <span>Analyze Your Resume Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: PRICING PLANS
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#10162A]/60 border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#8065FF]">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Invest In Your Career, Not Expensive Bootcamps
            </h2>
            <p className="text-sm text-[#A6B0C8]">
              Flexible student plans with Razorpay integration. Start free with 5 AI interview drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Free Plan */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#A6B0C8] uppercase tracking-wider">Free Starter</span>
                <div className="text-3xl font-heading font-black text-white mt-2 mb-4">₹0</div>
                <p className="text-xs text-[#A6B0C8] mb-6">For students exploring their initial technical career readiness.</p>
                <ul className="space-y-3 text-xs text-[#A6B0C8]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> 5 AI Mock Interview Drills
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Baseline Career Readiness Score
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Basic ATS Resume Scan
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-center text-xs font-semibold text-white block transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Starter Plan */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#32C8F5] uppercase tracking-wider">Starter</span>
                <div className="text-3xl font-heading font-black text-white mt-2 mb-4">₹199<span className="text-xs font-normal text-[#A6B0C8]">/mo</span></div>
                <p className="text-xs text-[#A6B0C8] mb-6">For focused students preparing for campus placement rounds.</p>
                <ul className="space-y-3 text-xs text-[#A6B0C8]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> 25 AI Mock Interview Drills
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Voice Interview Mode
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Unlimited ATS Resume Scans
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-center text-xs font-semibold text-white block transition-colors"
              >
                Upgrade to Starter
              </Link>
            </div>

            {/* Pro Plan (Recommended) */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between border-2 border-[#8065FF] relative shadow-glow-violet">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8065FF] text-[10px] font-bold uppercase tracking-wider text-white">
                Recommended
              </div>
              <div>
                <span className="text-xs font-bold text-[#A68BFF] uppercase tracking-wider">Pro Career</span>
                <div className="text-3xl font-heading font-black text-white mt-2 mb-4">₹399<span className="text-xs font-normal text-[#A6B0C8]">/mo</span></div>
                <p className="text-xs text-[#A6B0C8] mb-6">Complete end-to-end interview practice, roadmaps, and recruiter reach.</p>
                <ul className="space-y-3 text-xs text-[#A6B0C8]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Unlimited Text & Voice Interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Video Interview Beta
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Verified Talent Discovery Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Personalized AI Roadmap
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-3 rounded-xl bg-[#8065FF] hover:bg-[#6A4DFF] text-center text-xs font-bold text-white block transition-all shadow-glow-violet"
              >
                Unlock Pro Access
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#F4B860] uppercase tracking-wider">Premium Career</span>
                <div className="text-3xl font-heading font-black text-white mt-2 mb-4">₹699<span className="text-xs font-normal text-[#A6B0C8]">/mo</span></div>
                <p className="text-xs text-[#A6B0C8] mb-6">VIP 1-on-1 human mentor review, custom referrals, and enterprise assessments.</p>
                <ul className="space-y-3 text-xs text-[#A6B0C8]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Everything in Pro Plan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> Direct Hiring Partner Referrals
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#30D6A0]" /> 1-on-1 Human Architecture Review
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-center text-xs font-semibold text-white block transition-colors"
              >
                Get Premium
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: STUDENT OUTCOMES / TESTIMONIALS
         ========================================================================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#30D6A0]">
              Proven Student Placements
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Real Students. Real Tech Offers.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#F4B860]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B860]" />
                ))}
              </div>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                "The 6-rubric interview feedback was identical to what my interviewers asked during my backend engineering round at an enterprise cloud startup. The missing concepts feedback made all the difference."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] text-white flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Ananya Rao</div>
                  <div className="text-[10px] text-[#A6B0C8]">Software Engineer • Bangalore</div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#F4B860]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B860]" />
                ))}
              </div>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                "The ATS resume analyzer restructured my bullet points with the XYZ formula. My interview callback rate jumped from 5% to over 35% in three weeks."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#32C8F5] to-[#30D6A0] text-white flex items-center justify-center font-bold text-xs">
                  RK
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Rahul Kulkarni</div>
                  <div className="text-[10px] text-[#A6B0C8]">Full Stack Developer • Hyderabad</div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-[#F4B860]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F4B860]" />
                ))}
              </div>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                "As a college student, finding authentic system design interview drills was impossible until Learnova. The AI actually checked my caching and indexing strategies."
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F4B860] to-[#FF647C] text-white flex items-center justify-center font-bold text-xs">
                  SN
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sneha Nair</div>
                  <div className="text-[10px] text-[#A6B0C8]">AI/ML Fellow • Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: FAQ SECTION
         ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#10162A]/60 border-t border-white/[0.06] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#32C8F5]">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white">
              Everything You Need To Know
            </h2>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-6">
              <h4 className="text-sm font-heading font-bold text-white mb-2">
                How does Learnova evaluate mock interviews?
              </h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Learnova scores every question using a transparent 6-factor rubric: Technical Knowledge (30%), Answer Relevance (20%), Problem Solving (20%), Communication Clarity (15%), Answer Structure (10%), and Time Management (5%). You get exact strengths, weaknesses, and model answers.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h4 className="text-sm font-heading font-bold text-white mb-2">
                Is my resume or interview transcript shared with employers?
              </h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                Never without your explicit consent. Your student profile, interview scores, and resume remain 100% private. You choose whether to make your verified achievements visible in Talent Discovery.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h4 className="text-sm font-heading font-bold text-white mb-2">
                What roles are currently supported for AI mock interviews?
              </h4>
              <p className="text-xs text-[#A6B0C8] leading-relaxed">
                We support 13+ roles including Python Developer, Java Developer, Full Stack Developer, Frontend Developer, Backend Developer, Data Analyst, Data Scientist, ML Engineer, AI Engineer, Cloud Engineer, DevOps Engineer, Cybersecurity Analyst, and custom job roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA BANNER
         ========================================================================= */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden border border-[#8065FF]/40 shadow-glow-violet">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                Ready To Prove Your Skills?
              </h2>
              <p className="text-sm text-[#A6B0C8]">
                Join thousands of students and engineers preparing for their dream careers today. Free instant access with 5 mock interview credits.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-sm shadow-glow-violet hover:opacity-95 transition-all"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
