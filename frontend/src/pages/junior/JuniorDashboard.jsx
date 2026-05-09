import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';

export default function JuniorDashboard() {
  return (
    <PageWrapper role="JUNIOR" userName="Alex" activePath="/dashboard">
      <div className="max-w-md mx-auto pb-24">
        
        {/* 1. Header: Greeting + Rank & Points with Progress Animation */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hi, Alex</h1>
            <p className="text-gray-500 text-sm mt-1">Level 12 Learner</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-blue-600 mb-1">1,240 / 2,000 EXP</p>
            <ProgressBar progress={62} colorClass="bg-blue-500" className="w-24 h-2" />
          </div>
        </div>

        {/* 2. Quick Mentoring Button */}
        <div className="bg-gray-900 rounded-3xl p-5 mb-8 text-white flex justify-between items-center shadow-md hover:shadow-lg transition-shadow">
          <div>
            <h3 className="font-bold text-lg">Stuck on a concept?</h3>
            <p className="text-sm text-gray-300">Connect with an expert in minutes.</p>
          </div>
          <Button variant="primary" className="bg-white text-gray-900 hover:bg-gray-100 px-6">
            Ask Mentor
          </Button>
        </div>

        {/* 3. Today's Quizzes (Spaced Repetition Due) */}
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Today's Quizzes</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-3xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl">⚡</span>
              <span className="bg-white text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">DUE</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Cognitive Load</h3>
            <p className="text-xs text-gray-500 mb-3">Memory decay warning</p>
            <Button variant="accent" className="w-full bg-orange-200 text-orange-900 py-2 text-xs">Take Quiz</Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl">
            <div className="flex justify-between items-start mb-2">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Neural Pathways</h3>
            <p className="text-xs text-gray-500 mb-3">Optimal review time</p>
            <Button variant="accent" className="w-full bg-blue-200 text-blue-900 py-2 text-xs">Take Quiz</Button>
          </div>
        </div>

        {/* 4. Assigned Materials with Retention Strength (Memory Health Bar) */}
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Assigned Materials</h2>
        <div className="space-y-4">
          
          {/* Material 1 */}
          <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-3xl">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Spaced Repetition Algorithms</h3>
            <p className="text-xs text-gray-500 mb-4">Read 2 days ago</p>
            
            {/* Retention Strength Indicator */}
            <div className="mb-4 bg-gray-50 p-3 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-600">Retention Strength</span>
                <span className="text-orange-600">45% (Critical)</span>
              </div>
              <ProgressBar progress={45} colorClass="bg-orange-400" />
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" className="flex-1 py-2 text-xs">Reread</Button>
              <Button variant="primary" className="flex-1 py-2 text-xs">Test Memory</Button>
            </div>
          </div>

          {/* Material 2 */}
          <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-3xl">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Synaptic Pruning</h3>
            <p className="text-xs text-gray-500 mb-4">Read 2 hours ago</p>
            
            {/* Retention Strength Indicator */}
            <div className="mb-4 bg-gray-50 p-3 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-600">Retention Strength</span>
                <span className="text-green-600">92% (Strong)</span>
              </div>
              <ProgressBar progress={92} colorClass="bg-green-500" />
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" className="flex-1 py-2 text-xs">Reread</Button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}