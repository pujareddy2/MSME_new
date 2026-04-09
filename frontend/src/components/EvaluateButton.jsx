// src/components/EvaluateButton.jsx

import { useState } from 'react';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const DIMENSIONS = [
  { key: 'problemSolutionFit', label: 'Problem-Solution Fit', icon: 'target', color: '#f97316' },
  { key: 'innovation',         label: 'Innovation',           icon: 'zap',    color: '#a855f7' },
  { key: 'feasibility',        label: 'Feasibility',          icon: 'wrench', color: '#3b82f6' },
  { key: 'clarity',            label: 'Clarity',              icon: 'gem',    color: '#06b6d4' },
];

async function callGroq(systemPrompt, userMessage) {
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userMessage  },
        ],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Groq API error');
  return data.choices[0].message.content;
}

function ScoreRing({ score, color }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 10) * circ;
  return (
    <svg width='72' height='72' viewBox='0 0 72 72'>
      <circle cx='36' cy='36' r={radius} fill='none' stroke='#1e293b' strokeWidth='6' />
      <circle cx='36' cy='36' r={radius} fill='none'
        stroke={color} strokeWidth='6'
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap='round'
        transform='rotate(-90 36 36)'
        style={{ filter: `drop-shadow(0 0 6px ${color})`,
                 transition: 'stroke-dasharray 1.2s ease' }}
      />
      <text x='36' y='41' textAnchor='middle' fill='#f1f5f9'
        fontSize='14' fontWeight='800'>{score}</text>
    </svg>
  );
}

function ScoreBar({ score, color }) {
  const pct = (score / 10) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
      <div style={{ flex: 1, height: '6px', background: '#1e293b',
        borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          borderRadius: '99px',
          transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 10px ${color}66`,
        }} />
      </div>
      <span style={{ color, fontWeight: 800, fontSize: '13px',
        minWidth: '32px', textAlign: 'right' }}>
        {score}/10
      </span>
    </div>
  );
}

export default function EvaluateButton({
  teamName         = 'Test Team',
  problemStatement = 'Default problem statement',
  abstract         = 'Default abstract',
}) {
  const [loading,   setLoading]   = useState(false);
  const [scores,    setScores]    = useState(null);
  const [summary,   setSummary]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error,     setError]     = useState('');
  const [dots,      setDots]      = useState('.');

  async function handleEvaluate() {
    setLoading(true);
    setError('');
    const interval = setInterval(
      () => setDots(d => d.length >= 3 ? '.' : d + '.'), 500
    );
    try {
      const system = `You are an expert hackathon judge.
Respond ONLY with valid JSON, no markdown:
{
  "problemSolutionFit": <integer 1-10>,
  "innovation": <integer 1-10>,
  "feasibility": <integer 1-10>,
  "clarity": <integer 1-10>,
  "overall": <integer 1-10>,
  "summary": "<2-3 sentences: strengths and one area to improve>"
}`;
      const userMsg = `Team: ${teamName}
Problem: ${problemStatement}
Solution: ${abstract}`;
      const raw    = await callGroq(system, userMsg);
      const clean  = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setScores(parsed);
      setSummary(parsed.summary || '');
      setShowModal(true);
    } catch (e) {
      setError(`Evaluation failed: ${e.message}`);
    }
    clearInterval(interval);
    setLoading(false);
  }

  const overallColor =
    scores?.overall >= 8 ? '#22c55e' :
    scores?.overall >= 6 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <link href='https://fonts.googleapis.com/css2?family=DM+Mono
        &family=Syne:wght@700;800&family=DM+Sans:wght@400;600&display=swap'
        rel='stylesheet' />
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

          <button onClick={handleEvaluate} disabled={loading} style={{
            background: loading ? 'linear-gradient(135deg,#1e293b,#0f172a)'
                                : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '11px 26px', fontWeight: 700, fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? `Analysing${dots}` : 'Evaluate'}
          </button>

          {scores && (
            <button onClick={() => setShowModal(true)} style={{
              background: 'linear-gradient(135deg,#059669,#047857)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '11px 26px', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer',
            }}>
              View Analysis
            </button>
          )}
        </div>
        {error && <p style={{ color: '#fca5a5', marginTop: '10px' }}>{error}</p>}
      </div>

      {showModal && scores && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(8px)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: '560px', background: '#09111f',
            border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden'
          }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg,#0f1f3d,#090f1e)',
              padding: '24px 28px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6366f1', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                    AI Judge Report
                  </p>
                  <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '20px',
                    fontWeight: 800 }}>{teamName}</h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <ScoreRing score={scores.overall} color={overallColor} />
                  <p style={{ color: '#64748b', fontSize: '10px', margin: '4px 0 0' }}>
                    OVERALL
                  </p>
                </div>
              </div>
            </div>

            {/* SCORE ROWS */}
            <div style={{ padding: '24px 28px', display: 'flex',
              flexDirection: 'column', gap: '18px' }}>
              {DIMENSIONS.map((dim) => (
                <div key={dim.key} style={{ display: 'flex',
                  alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px',
                    background: `${dim.color}18`, border: `1px solid ${dim.color}33`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '16px' }}>
                    {dim.icon}
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '13px',
                    fontWeight: 600, minWidth: '155px' }}>
                    {dim.label}
                  </span>
                  <ScoreBar score={scores[dim.key]} color={dim.color} />
                </div>
              ))}

              {/* SUMMARY */}
              <div style={{ padding: '16px 18px', background: '#0f1a2e',
                border: '1px solid #1e3a5f', borderRadius: '12px',
                display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>Note</span>
                <p style={{ color: '#94a3b8', fontSize: '13px',
                  lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                  {summary}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid #1e293b',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#334155', fontSize: '11px' }}>
                Powered by Groq  llama-3.3-70b
              </span>
              <button onClick={() => setShowModal(false)} style={{
                background: '#1e293b', color: '#94a3b8',
                border: '1px solid #334155', borderRadius: '8px',
                padding: '8px 20px', fontWeight: 600, cursor: 'pointer'
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
