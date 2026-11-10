import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { Interview, InterviewQuestion } from '../types';
import { 
  Sparkles, Clock, Mic, MicOff, Volume2, 
  Send, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';

export const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadInterview(id);
  }, [id]);

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  const loadInterview = async (interviewId: string) => {
    try {
      setLoading(true);
      const res = await interviewService.getInterview(interviewId);
      if (res.interview) {
        setInterview(res.interview);
        const idx = res.interview.currentQuestionIndex || 0;
        setCurrentIdx(idx);
        setCurrentAnswer(res.interview.questions[idx]?.studentAnswer || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer or use Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSpeakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = async () => {
    if (!id || !interview) return;
    const currentQuestion = interview.questions[currentIdx];
    if (!currentQuestion) return;

    try {
      setSubmitting(true);
      await interviewService.submitAnswer(
        id,
        currentQuestion.id,
        currentAnswer,
        secondsSpent
      );

      const nextIdx = currentIdx + 1;
      if (nextIdx < interview.questions.length) {
        setCurrentIdx(nextIdx);
        setCurrentAnswer(interview.questions[nextIdx]?.studentAnswer || '');
        setSecondsSpent(0);
      } else {
        // Final question answered: Complete & evaluate
        const completeRes = await interviewService.completeInterview(id);
        navigate(`/student/interviews/${id}/report`);
      }
    } catch (err: any) {
      setError(err?.message || 'Error recording answer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Initializing interview simulator...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <p className="text-sm font-medium text-[#A6B0C8]">Interview session could not be found.</p>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentIdx];
  const isLastQuestion = currentIdx === interview.questions.length - 1;
  const wordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;

  const minutes = Math.floor(secondsSpent / 60);
  const seconds = secondsSpent % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white">{interview.role}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] font-semibold">
              {interview.type}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A6B0C8]">
              {interview.mode} Mode
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#A6B0C8]">
              <Clock className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span className="font-mono text-white font-bold">{formattedTime}</span>
            </div>

            <div className="text-xs font-semibold text-[#A68BFF]">
              Question {currentIdx + 1} of {interview.questions.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-[#FF647C]">
            {error}
          </div>
        )}

        {/* Question Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-card-dark">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded bg-[#32C8F5]/10 text-[#32C8F5] font-bold border border-[#32C8F5]/20">
              {currentQuestion?.category || 'Technical'}
            </span>

            <button
              onClick={() => handleSpeakQuestion(currentQuestion?.question || '')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white transition-colors"
              title="Read Question Aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-heading font-bold text-white leading-relaxed">
            {currentQuestion?.question}
          </h2>
        </div>

        {/* Answer Workspace */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-[#A6B0C8]">
              Your Structured Technical Response
            </label>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#A6B0C8]">
                {wordCount} words
              </span>

              {/* Voice Input Toggle Button */}
              <button
                type="button"
                onClick={handleSpeechRecognition}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-[#32C8F5] border border-white/10'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening...' : 'Voice Dictation'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            placeholder="Type your response thoroughly. Reference architectural concepts, concrete trade-offs, metrics, or algorithmic steps..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full bg-[#10162A] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#8065FF] leading-relaxed resize-y font-sans"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
            <span className="text-[11px] text-[#6B7A99]">
              Scored on 6 rubrics: Technical accuracy, relevance, problem solving, clarity, structure & time.
            </span>

            <button
              onClick={handleNext}
              disabled={submitting || !currentAnswer.trim()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Evaluating...</span>
              ) : isLastQuestion ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Generate AI Report</span>
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
