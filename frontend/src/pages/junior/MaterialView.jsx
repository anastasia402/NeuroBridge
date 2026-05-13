import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

export default function MaterialView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial]   = useState(null);
  const [quiz, setQuiz]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [mat, quizzes] = await Promise.all([
          apiGet(`/materials/${id}`),
          apiGet(`/quizzes?status=ACTIVE&materialId=${id}`),
        ]);
        setMaterial(mat);
        setQuiz(quizzes?.[0] ?? null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const readingTime = material
    ? Math.max(1, Math.ceil(material.contentText.split(' ').length / 200))
    : 0;

  return (
    <>
      <PageWrapper role="JUNIOR" userName="Alex" activePath="/study">
        <div className="max-w-md mx-auto pb-8">

          {/* Back */}
          <button
            onClick={() => navigate('/study')}
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-900 text-sm font-bold mb-6 transition-colors"
          >
            <span>←</span><span>Study Library</span>
          </button>

          {loading && (
            <div className="text-center py-16 text-gray-400">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Se încarcă...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-2xl text-red-600 text-sm">{error}</div>
          )}

          {material && (
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                  {material.title}
                </h1>
                <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
                  <span>⏱ {readingTime} min citit</span>
                  <span>📅 {new Date(material.createdAt).toLocaleDateString('ro-RO')}</span>
                  {quiz && <span className="text-green-600 font-bold">✅ Quiz disponibil</span>}
                </div>
              </div>

              {/* Content */}
              <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm mb-6">
                <div className="prose prose-sm max-w-none">
                  {material.contentText.split('\n\n').map((para, i) => (
                    para.trim() ? (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4 text-sm last:mb-0">
                        {para.trim()}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>

              {/* Summary dacă există */}
              {material.summary && (
                <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-5 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>✨</span>
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Rezumat AI</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{material.summary}</p>
                </div>
              )}

              {/* CTA Quiz */}
              {quiz ? (
                <button
                  onClick={() => setIsQuizRunning(true)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-colors"
                >
                  ⚡ Începe Quiz — {quiz.questions.length} întrebări · {quiz.difficulty}
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center text-gray-400 text-sm">
                  <p className="font-medium">Niciun quiz disponibil pentru acest material</p>
                  <p className="text-xs mt-1">Adminul poate genera unul din panoul de administrare</p>
                </div>
              )}
            </>
          )}
        </div>
      </PageWrapper>

      {isQuizRunning && quiz && (
        <QuizEngine quizId={quiz.id} onClose={() => setIsQuizRunning(false)} />
      )}
    </>
  );
}
