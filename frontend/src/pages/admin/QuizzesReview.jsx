import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import QuizReviewPanel from '../../features/admin/QuizReviewPanel';
import Badge from '../../components/common/Badge';

export default function QuizzesReview() {
  const [activeQuiz, setActiveQuiz] = useState(1);

  const pendingQuizzes = [
    { id: 1, title: 'Cognitive Load Theory - Advanced', module: 'Psychology', date: 'Today, 10:30' },
    { id: 2, title: 'Synaptic Plasticity Basics', module: 'Neuroscience', date: 'Today, 09:15' },
    { id: 3, title: 'Python Data Structures', module: 'Computer Science', date: 'Yesterday' },
  ];

  const mockQuestions = [
    {
      text: "What is the primary mechanism through which spaced repetition improves retention?",
      options: [
        "By reducing the overall cognitive effort required to memorize",
        "By interrupting the forgetting process just before it occurs",
        "By visualizing complex concepts using flowcharts",
        "By associating new information with long-term childhood memories"
      ],
      correctIndex: 1
    },
    {
      text: "In cognitive load theory, what does 'intrinsic load' represent?",
      options: [
        "How the information is visually presented on the screen",
        "The background noise and distractions in the learning environment",
        "The inherent difficulty of the material being learned",
        "The effort put into creating logical connections (schemas)"
      ],
      correctIndex: 2
    }
  ];

  return (
    <PageWrapper role="ADMIN" userName="Admin Manager" activePath="/admin/quizzes">
      <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Quizzes Validation</h1>
          <p className="text-gray-500 text-sm mt-1">Approve, edit, or reject the automatically generated questions from materials.</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          
          {/* Left Column: List of Pending Quizzes */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <Badge text="PENDING REVIEW" variant="warning" />
            </div>
            <div className="divide-y divide-gray-50">
              {pendingQuizzes.map(quiz => (
                <div 
                  key={quiz.id} 
                  onClick={() => setActiveQuiz(quiz.id)}
                  className={`p-4 cursor-pointer transition-colors ${activeQuiz === quiz.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                >
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{quiz.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{quiz.module}</span>
                    <span className="text-xs font-medium text-gray-400">{quiz.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Review Panel */}
          <div className="lg:col-span-8 overflow-y-auto pb-6">
             <QuizReviewPanel 
                quizTitle={pendingQuizzes.find(q => q.id === activeQuiz)?.title || 'Select a quiz'}
                questions={mockQuestions}
             />
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}