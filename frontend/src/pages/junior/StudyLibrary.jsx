import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MaterialCard from '../../features/materials/MaterialCard';

export default function StudyLibrary() {
  const filters = ['All', 'Neuroscience', 'Psychology', 'To Revise'];

  return (
    <PageWrapper role="JUNIOR" userName="Alex" activePath="/study">
      <div className="max-w-md mx-auto pb-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Study Library</h1>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search topics or materials..." 
              className="w-full bg-gray-50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter, idx) => (
              <button 
                key={idx} 
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  idx === 0 ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">Suggestions</h2>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-900">View All</button>
        </div>
        
        <MaterialCard 
          title="Cognitive Load Theory"
          isAiGenerated={true}
          reason="Since you struggled with Memory Buffers yesterday, this will bridge the gap."
        />
        <MaterialCard 
          title="The Hippocampus Role"
          isAiGenerated={true}
          reason="Matches your interest in Neuroscience, frequently appears in upcoming mock tests."
        />

        {/* Standard Materials */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 mt-8">Study Materials</h2>
        <MaterialCard 
          title="Neuroplasticity Basics"
          isAiGenerated={false}
          time="12 min"
          description="A foundational look at how neural pathways form and adapt to new stimulus."
        />
        <MaterialCard 
          title="Active Recall Methods"
          isAiGenerated={false}
          time="8 min"
          description="The science behind why testing yourself is better than rereading your notes."
        />
      </div>
    </PageWrapper>
  );
}