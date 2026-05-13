import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

const READING_TIME = (text) => Math.max(1, Math.ceil((text || '').split(' ').length / 200));

function MaterialCard({ material, quizMap, onTakeQuiz }) {
  const navigate = useNavigate();
  const quiz = quizMap[material.id];
  const time = READING_TIME(material.contentText);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 mr-3">{material.title}</h3>
        {quiz && (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg shrink-0">
            Quiz ✓
          </span>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
        {material.contentText?.substring(0, 120)}...
      </p>

      <div className="flex items-center text-xs text-gray-400 mb-4 font-medium space-x-3">
        <span>⏱ {time} min citit</span>
        <span>📅 {new Date(material.createdAt).toLocaleDateString('ro-RO')}</span>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => navigate(`/study/${material.id}`)}
          className="flex-1 py-2.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors"
        >
          Citește
        </button>
        <button
          onClick={() => onTakeQuiz(material, quiz)}
          className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
            quiz
              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!quiz}
          title={!quiz ? 'Niciun quiz disponibil pentru acest material' : ''}
        >
          {quiz ? 'Quiz ⚡' : 'Fără quiz'}
        </button>
      </div>
    </div>
  );
}

export default function StudyLibrary() {
  const [materials, setMaterials] = useState([]);
  const [quizMap, setQuizMap]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [mats, quizzes] = await Promise.all([
          apiGet('/materials'),
          apiGet('/quizzes?status=ACTIVE'),
        ]);
        setMaterials(mats);
        // map materialId → quiz
        const map = {};
        (quizzes || []).forEach(q => { map[q.materialId] = q; });
        setQuizMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = materials.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleTakeQuiz(material, quiz) {
    if (quiz) setActiveQuiz(quiz);
  }

  return (
    <>
      <PageWrapper role="JUNIOR" userName="Alex" activePath="/study">
        <div className="max-w-md mx-auto pb-24">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Study Library</h1>

          {/* Search */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Caută materiale..."
              className="w-full bg-gray-50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {loading && (
            <div className="text-center py-16 text-gray-400">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Se încarcă materialele...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📚</div>
              <p className="font-medium">
                {search ? 'Niciun material găsit' : 'Nu există materiale încă'}
              </p>
              {!search && (
                <p className="text-xs mt-1">Adminul poate adăuga materiale din panoul de administrare</p>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Materiale</h2>
                <span className="text-xs text-gray-400 font-medium">{filtered.length} disponibile</span>
              </div>
              {filtered.map(m => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  quizMap={quizMap}
                  onTakeQuiz={handleTakeQuiz}
                />
              ))}
            </>
          )}
        </div>
      </PageWrapper>

      {activeQuiz && (
        <QuizEngine quizId={activeQuiz.id} onClose={() => setActiveQuiz(null)} />
      )}
    </>
  );
}
