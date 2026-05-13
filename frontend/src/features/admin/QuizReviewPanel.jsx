import React from 'react';
import Button from '../../components/common/Button';

export default function QuizReviewPanel({ quiz, onApprove, onReject, isLoading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-orange-500 text-xs font-bold">✨ AI GENERATED DRAFT</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {quiz.materialTitle || `Quiz #${quiz.id}`}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Difficulty: {quiz.difficulty}</p>
        </div>
        {(onApprove || onReject) && (
          <div className="flex space-x-3">
            {onReject && (
              <Button variant="danger" onClick={onReject} disabled={isLoading}>
                {isLoading ? '...' : 'Reject'}
              </Button>
            )}
            {onApprove && (
              <Button
                variant="primary"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Approve Quiz'}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-gray-50 p-5 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900">
                <span className="text-gray-400 mr-2">Q{idx + 1}.</span> {q.questionText}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className={`p-3 rounded-lg border text-sm flex items-center ${
                    q.correctIndex === optIdx
                      ? 'bg-green-50 border-green-200 text-green-900 font-medium'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs font-bold ${
                    q.correctIndex === optIdx ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {['A', 'B', 'C', 'D'][optIdx]}
                  </span>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
