import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MentorCard from '../../features/mentoring/MentorCard';
import Button from '../../components/common/Button';

export default function MentorsList() {
  return (
    <PageWrapper role="JUNIOR" userName="Alex" activePath="/mentors">
      <div className="max-w-md mx-auto pb-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Find a Mentor</h1>

        <div className="relative mb-6">
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search subjects or names..." 
            className="w-full bg-gray-50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Matchmaker Card */}
        <div className="bg-gray-900 rounded-3xl p-6 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2">Let us find your perfect match</h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Can't find a mentor? Our AI will pair you with the best available mentor based on your specific goals.
            </p>
            <Button variant="primary" className="w-full bg-white text-gray-900 hover:bg-gray-100 py-3">
              Pair Me Now
            </Button>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Mentors</h2>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-900">Sort ↕</button>
        </div>
        
        <MentorCard 
          name="Dr. Aris Thorne"
          initials="AT"
          subjects="Neuroscience • Biology"
          status="ACTIVE"
          description="Passionate about bridging the gap between complex science and student understanding."
          languages="English, Greek"
          availability="Available in 10m"
        />
        
        <MentorCard 
          name="Sarah Jenkins"
          initials="SJ"
          subjects="Calculus • Physics"
          status="ACTIVE"
          description="Solving the unsolvable. I help students find logic in the most complex equations."
          languages="English, Spanish"
          availability="Available now"
        />
      </div>
    </PageWrapper>
  );
}