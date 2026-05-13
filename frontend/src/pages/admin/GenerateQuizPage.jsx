import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { apiPost, apiUpload } from '../../services/authService';

const STEPS = ['Material', 'Configure', 'Generate'];

export default function GenerateQuizPage() {
  const [step, setStep] = useState(0);
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'file'
  const [contentText, setContentText] = useState('');
  const [file, setFile] = useState(null);
  const [materialId, setMaterialId] = useState(null);
  const [config, setConfig] = useState({ numberOfQuestions: 5, difficulty: 'MEDIUM', topic: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUploadOrText = async () => {
    setError('');
    setLoading(true);
    try {
      let id;
      if (inputMode === 'file' && file) {
        const fd = new FormData();
        fd.append('file', file);
        const data = await apiUpload('/api/materials/upload', fd);
        id = data.id;
      } else {
        const data = await apiPost('/api/materials/from-text', {
          title: config.topic || 'AI Generated Material',
          content: contentText,
        });
        id = data.id;
      }
      setMaterialId(id);
      setStep(1);
    } catch (err) {
      setError(err.message || 'Failed to upload material');
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/quizzes/generate', {
        materialId,
        numberOfQuestions: config.numberOfQuestions,
        difficulty: config.difficulty,
        topic: config.topic || undefined,
        contentText: inputMode === 'text' ? contentText : undefined,
      });
      setResult(data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(0);
    setContentText('');
    setFile(null);
    setMaterialId(null);
    setResult(null);
    setError('');
    setConfig({ numberOfQuestions: 5, difficulty: 'MEDIUM', topic: '' });
  };

  return (
    <PageWrapper role="ADMIN">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Quiz</h1>
          <p className="text-sm text-gray-500 mt-1">Use AI to create quizzes from study material</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                i === step ? 'bg-blue-600 text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                <span>{i < step ? '✓' : i + 1}</span>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0: Material */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  inputMode === 'text' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
                }`}
              >
                📝 Paste Text
              </button>
              <button
                onClick={() => setInputMode('file')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  inputMode === 'file' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
                }`}
              >
                📎 Upload File
              </button>
            </div>

            {inputMode === 'text' ? (
              <textarea
                rows={10}
                placeholder="Paste your study material here (article, notes, chapter text)…"
                value={contentText}
                onChange={e => setContentText(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <label className="block w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition-all">
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={e => setFile(e.target.files[0])} />
                {file ? (
                  <div>
                    <div className="text-2xl mb-2">📄</div>
                    <div className="font-semibold text-gray-900 text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">📎</div>
                    <div className="font-semibold text-gray-600 text-sm">Click to upload PDF or DOCX</div>
                    <div className="text-xs text-gray-400 mt-1">Max 10MB</div>
                  </div>
                )}
              </label>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleUploadOrText}
              disabled={loading || (inputMode === 'text' ? !contentText.trim() : !file)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-blue-700"
            >
              {loading ? 'Processing…' : 'Continue →'}
            </button>
          </div>
        )}

        {/* Step 1: Configure */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Topic / Title</label>
              <input
                type="text"
                placeholder="e.g. Neuroplasticity basics"
                value={config.topic}
                onChange={e => setConfig(c => ({ ...c, topic: e.target.value }))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Number of Questions</label>
              <div className="flex gap-2 mt-1">
                {[3, 5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setConfig(c => ({ ...c, numberOfQuestions: n }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      config.numberOfQuestions === n ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</label>
              <div className="flex gap-2 mt-1">
                {['EASY', 'MEDIUM', 'HARD'].map(d => (
                  <button
                    key={d}
                    onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      config.difficulty === d ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-blue-700"
            >
              {loading ? '🤖 Generating with AI…' : '🤖 Generate Quiz'}
            </button>
          </div>
        )}

        {/* Step 2: Result */}
        {step === 2 && result && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-bold text-green-800 text-lg">{result.title || 'Quiz Generated!'}</div>
              <div className="text-sm text-green-600 mt-1">{result.questions?.length || config.numberOfQuestions} questions • {result.difficulty || config.difficulty}</div>
              <div className="text-xs text-gray-500 mt-2">Status: <span className="font-semibold text-yellow-600">PENDING review</span></div>
            </div>

            <div className="space-y-2">
              {(result.questions || []).map((q, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{i + 1}. {q.questionText}</div>
                  <div className="space-y-1">
                    {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, j) => (
                      <div key={j} className={`text-xs px-3 py-1 rounded-lg ${
                        ['A','B','C','D'][j] === q.correctAnswer ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-500'
                      }`}>
                        {['A','B','C','D'][j]}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={reset}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Generate Another
              </button>
              <button onClick={() => window.location.href = '/admin/quizzes'}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
                Review Quizzes →
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
