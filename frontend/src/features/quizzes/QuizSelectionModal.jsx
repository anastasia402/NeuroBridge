import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

export default function QuizSelectionModal({ isOpen, onClose, onStart }) {
  const [selectedType, setSelectedType] = useState('existing');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-100 rounded-full"></div>

      <div className="flex flex-col items-center text-center mb-8 mt-4">
        <div className="bg-gray-900 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
          ⚡
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">NeuroBridge</h2>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Choose a quiz</h3>
        <p className="text-xs text-gray-500 leading-relaxed px-4">
          Pick a pre-made challenge or let AI bridge your current gaps.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        
        {/* Option 1: Existing Quiz */}
        <div 
          onClick={() => setSelectedType('existing')}
          className={`cursor-pointer rounded-[2rem] p-6 border-2 transition-all duration-200 relative ${
            selectedType === 'existing' 
            ? 'border-blue-300 bg-blue-50/30' 
            : 'border-gray-100 bg-white hover:border-blue-100'
          }`}
        >
          {selectedType === 'existing' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center text-[10px] text-white">
              ✓
            </div>
          )}
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              📋
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Existing Quiz</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                Review established concepts from your recent study modules.
              </p>
              <div className="inline-flex items-center bg-gray-50 px-2 py-1 rounded-lg text-[9px] font-bold text-gray-500">
                ⏱ 15 Questions • 10 mins
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: Generate AI Quiz */}
        <div 
          onClick={() => setSelectedType('ai')}
          className={`cursor-pointer rounded-[2rem] p-6 border-2 transition-all duration-200 relative ${
            selectedType === 'ai' 
            ? 'border-orange-300 bg-orange-50/30' 
            : 'border-gray-100 bg-white hover:border-orange-100'
          }`}
        >
          {selectedType === 'ai' && (
            <div className="absolute top-4 right-4 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-[10px] text-white">
              ✓
            </div>
          )}
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 shadow-sm">
              ✨
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Generate AI Quiz</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Custom challenges focused on your unique learning patterns.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="space-y-4 text-center">
        <Button 
          onClick={() => onStart(selectedType)}
          className="w-full bg-[#87CEFA] hover:bg-[#70BBE8] text-white py-4 rounded-[1.5rem] font-bold text-sm shadow-md transition-all active:scale-95"
        >
          Start Quiz
        </Button>
        <button 
          onClick={onClose}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}