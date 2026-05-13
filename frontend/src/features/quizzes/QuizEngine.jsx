import React, { useState, useEffect } from 'react';
import { apiGet } from '../../services/authService';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizEngine({ onClose, quizId = null }) {
  const [phase, setPhase] = useState('loading'); // loading | quiz | result | error
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadQuiz(); }, []);

  async function loadQuiz() {
    try {
      let picked;
      if (quizId) {
        picked = await apiGet(`/quizzes/${quizId}`);
      } else {
        const quizzes = await apiGet('/quizzes?status=ACTIVE');
        if (!quizzes || quizzes.length === 0) {
          setError('Nu există quiz-uri active momentan. Roagă adminul să aprobe un quiz.');
          setPhase('error');
          return;
        }
        picked = quizzes[Math.floor(Math.random() * quizzes.length)];
      }
      if (!picked.questions || picked.questions.length === 0) {
        setError('Quiz-ul selectat nu are întrebări.');
        setPhase('error');
        return;
      }
      setQuiz(picked);
      setPhase('quiz');
    } catch (e) {
      setError(e.message);
      setPhase('error');
    }
  }

  function handleSelect(idx) {
    if (revealed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    setRevealed(true);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    if (current + 1 >= quiz.questions.length) {
      setAnswers(newAnswers);
      setPhase('result');
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  const progress = quiz
    ? Math.round(((current + (revealed ? 1 : 0)) / quiz.questions.length) * 100)
    : 0;
  const score = quiz
    ? answers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 font-bold text-lg transition-colors">✕</button>
        <div className="flex-1 mx-6">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {quiz && <span className="text-xs font-bold text-gray-400">{current + 1}/{quiz.questions.length}</span>}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {phase === 'loading' && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 font-medium">Se încarcă quiz-ul...</p>
            </div>
          )}

          {phase === 'error' && (
            <div className="text-center space-y-4">
              <div className="text-5xl">😕</div>
              <h2 className="text-xl font-bold text-gray-900">Oops</h2>
              <p className="text-gray-500 text-sm">{error}</p>
              <button onClick={onClose} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm">Înapoi</button>
            </div>
          )}

          {phase === 'quiz' && quiz && (() => {
            const q = quiz.questions[current];
            return (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {quiz.materialTitle || 'Quiz'} · {quiz.difficulty}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">{q.questionText}</h2>
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, idx) => {
                    let style = 'bg-gray-50 border-gray-100 text-gray-700';
                    if (revealed) {
                      if (idx === q.correctIndex)      style = 'bg-green-50 border-green-300 text-green-900';
                      else if (idx === selected)       style = 'bg-red-50 border-red-300 text-red-900';
                      else                             style = 'bg-gray-50 border-gray-100 text-gray-400';
                    } else if (idx === selected)       style = 'bg-blue-50 border-blue-300 text-blue-900';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full flex items-center space-x-4 p-4 rounded-2xl border-2 text-left transition-all ${style} ${!revealed ? 'hover:border-blue-200' : ''}`}
                      >
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          revealed && idx === q.correctIndex ? 'bg-green-200 text-green-800' :
                          revealed && idx === selected       ? 'bg-red-200 text-red-800' :
                          idx === selected                   ? 'bg-blue-200 text-blue-800' :
                                                               'bg-white text-gray-500'
                        }`}>
                          {LETTERS[idx]}
                        </span>
                        <span className="text-sm font-medium flex-1">{opt}</span>
                        {revealed && idx === q.correctIndex && <span className="text-green-600 font-bold">✓</span>}
                        {revealed && idx === selected && idx !== q.correctIndex && <span className="text-red-500 font-bold">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {revealed && (
                  <div className={`p-4 rounded-2xl text-sm font-medium ${selected === q.correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {selected === q.correctIndex
                      ? '🎉 Corect!'
                      : `❌ Răspuns corect: ${LETTERS[q.correctIndex]}. ${q.options[q.correctIndex]}`}
                  </div>
                )}
              </div>
            );
          })()}

          {phase === 'result' && quiz && (
            <div className="text-center space-y-6">
              <div className="text-6xl">
                {score === quiz.questions.length ? '🏆' : score >= quiz.questions.length / 2 ? '🎉' : '💪'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{score}/{quiz.questions.length}</h2>
                <p className="text-gray-500 mt-1">{Math.round((score / quiz.questions.length) * 100)}% corect</p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${score / quiz.questions.length >= 0.8 ? 'bg-green-500' : score / quiz.questions.length >= 0.5 ? 'bg-blue-500' : 'bg-orange-400'}`}
                  style={{ width: `${Math.round((score / quiz.questions.length) * 100)}%` }}
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2">
                {quiz.questions.map((q, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm">
                    <span className={`shrink-0 font-bold ${answers[i] === q.correctIndex ? 'text-green-500' : 'text-red-400'}`}>
                      {answers[i] === q.correctIndex ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-600 text-xs leading-relaxed">{q.questionText}</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-colors">
                Înapoi la Dashboard
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      {phase === 'quiz' && (
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          {!revealed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-30 hover:bg-gray-700 transition-colors"
            >
              Confirmă răspunsul
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-colors"
            >
              {current + 1 < quiz.questions.length ? 'Următoarea →' : 'Vezi rezultatele'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
