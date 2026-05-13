import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import QuizSelectionModal from '../../features/quizzes/QuizSelectionModal';
import QuizEngine from '../../features/quizzes/QuizEngine';

export default function JuniorDashboard() {
  const navigate = useNavigate();
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isQuizRunning, setIsQuizRunning] = useState(false);

  const handleStartQuiz = () => {
    setIsQuizModalOpen(false);
    setIsQuizRunning(true);
  };

  return (
    <>
      <PageWrapper role="JUNIOR" userName="Alex" activePath="/dashboard">
        <div className="max-w-md mx-auto pb-8">

          <div className="flex justify-between items-center mb-8">
            <div className="bg-gray-900 p-2 rounded-xl text-white shadow-sm">
              <span className="text-xl">⚡</span>
            </div>
            <div className="flex space-x-4 text-gray-400">
              <button className="text-xl hover:text-gray-900 transition-colors">❔</button>
              <button onClick={() => navigate('/profile')} className="text-xl hover:text-gray-900 transition-colors">⚙️</button>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Good morning, Alex</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Ready to cross today's learning bridge?</p>
          </div>

          <div className="mb-10 bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Rank</p>
              <h3 className="text-lg font-bold text-gray-900">Level 12 Learner</h3>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-bold text-blue-600 mb-2">1,240 / 2,000 EXP</span>
              <ProgressBar progress={62} colorClass="bg-blue-500" className="w-24 h-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div
              onClick={() => navigate('/study')}
              className="bg-blue-50/50 p-6 rounded-[2.5rem] hover:bg-blue-100 transition-all cursor-pointer border border-transparent hover:border-blue-200"
            >
              <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-50 text-lg">📖</span>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Study Materials</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Dive into your saved lessons and library</p>
            </div>

            <div
              onClick={() => setIsQuizModalOpen(true)}
              className="bg-gray-50/50 p-6 rounded-[2.5rem] hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200"
            >
              <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-50 text-lg">⚡</span>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Quick Quiz</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Test your knowledge with AI challenges</p>
            </div>

            <div
              onClick={() => navigate('/mentors')}
              className="bg-gray-50/50 p-6 rounded-[2.5rem] hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200"
            >
              <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-50 text-lg">👥</span>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Connect Mentor</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Get personalized help from experts</p>
            </div>

            <div
              onClick={() => navigate('/stats')}
              className="bg-blue-50/50 p-6 rounded-[2.5rem] hover:bg-blue-100 transition-all cursor-pointer border border-transparent hover:border-blue-200"
            >
              <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-50 text-lg">✨</span>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Suggestions</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Personalized paths based on your stats</p>
            </div>
          </div>

          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Today's Quizzes</h2>
          <div className="bg-orange-50/50 border border-orange-100 p-7 rounded-[2.5rem] mb-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Cognitive Load Theory</h3>
              <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">DUE NOW</span>
            </div>
            <p className="text-xs text-gray-600 mb-6 italic leading-relaxed">"Reviewing this now will bridge your memory gaps from yesterday."</p>
            <Button
              onClick={() => setIsQuizModalOpen(true)}
              className="w-full bg-orange-100 text-orange-800 hover:bg-orange-200 py-4 rounded-2xl font-bold shadow-sm"
            >
              Start AI Quiz
            </Button>
          </div>

          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Insight of the Day</h2>
          <div className="bg-orange-50 border border-orange-100/50 p-8 rounded-[2.5rem] mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white text-[10px] font-bold px-3 py-1.5 rounded-xl text-gray-600 mb-5 inline-block shadow-sm">Did you know?</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">The Power of Spaced Repetition</h3>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Reviewing information right before you're about to forget it strengthens your neural pathways by 300%. NeuroBridge uses this to help you learn faster.
              </p>
              <button
                onClick={() => navigate('/study')}
                className="text-sm font-bold text-gray-900 flex items-center hover:translate-x-1 transition-transform group"
              >
                Explore memory tips <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl" />
          </div>

          <div className="text-center py-8">
            <div className="h-[1px] w-12 bg-gray-100 mx-auto mb-6" />
            <p className="text-sm text-gray-300 italic font-medium">"Small steps lead to big bridges."</p>
          </div>

        </div>
      </PageWrapper>

      <QuizSelectionModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onStart={handleStartQuiz}
      />

      {isQuizRunning && <QuizEngine onClose={() => setIsQuizRunning(false)} />}
    </>
  );
}
