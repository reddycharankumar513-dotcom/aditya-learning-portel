import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does registration work, and is there an upfront fee?',
      a: 'Creating an account on ADITYA is completely free. Upon registering with your email, you gain immediate access to free platform courses, sample coding exercises, and the AI Learning Tutor sandbox. Specific advanced specialization tracks or mentored internships may carry their own enrollment requirements as indicated on their track details page.',
    },
    {
      q: 'How does the Claude AI Tutor assist with coursework?',
      a: 'The AI Tutor acts as a 24/7 interactive pedagogical companion. It helps break down complex computer science and AI concepts, guides you through debugging runtime errors, suggests practice coding exercises, and adapts explanations to your declared skill level (beginner, intermediate, or advanced). It is designed to provide hints rather than merely giving away full assignment solutions.',
    },
    {
      q: 'Are certificates awarded upon course completion?',
      a: 'Yes, for curriculums configured with verified assessment criteria. Once you complete all module exercises and submit required capstone project deliverables, your progress is recorded on your student dashboard and a digital completion certificate is issued for that specific verified track.',
    },
    {
      q: 'How do technical internship applications work?',
      a: 'Authenticated students can browse active opportunities on the Internships page. Each listing details the required technical prerequisites, eligibility criteria, and timeline. Eligible students can apply directly through the platform by submitting their portfolio links and profile credentials.',
    },
    {
      q: 'How is learning progress tracked on the student dashboard?',
      a: 'Every time you complete a lecture, hands-on lab, or module assignment within a course, your server-side enrollment record is updated. Your dashboard displays your completion percentage, recent study activity, and personalized recommendations for subsequent topics.',
    },
    {
      q: 'Where do I get technical assistance if I encounter an issue?',
      a: 'You can submit an inquiry through our dedicated Contact page selecting the "Technical Support" category. Our administrative support team reviews inquiries in the platform database and responds promptly.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-base text-slate-600">
            Straightforward answers regarding platform access, course curriculums, AI assistance, and technical internships.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-brand-600 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className={`p-1 rounded-full bg-white border border-slate-200 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-brand-50 border-brand-200 text-brand-600' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
