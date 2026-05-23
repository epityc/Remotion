'use client';
import { useState } from 'react';

const TOPICS = [
  'Top 5 productivity hacks',
  'Mindblowing space facts',
  'How to make $1000 online',
  'Python tips every developer needs',
  'Hidden iPhone features you didn\'t know',
];

const VOICES = [
  { id: 'alloy', label: 'Alloy (Neutral)' },
  { id: 'echo', label: 'Echo (Male)' },
  { id: 'nova', label: 'Nova (Female)' },
  { id: 'shimmer', label: 'Shimmer (Soft)' },
];

const STYLES = [
  { id: 'cinematic', label: '🎬 Cinematic', desc: 'Dark, dramatic visuals' },
  { id: 'nature', label: '🌿 Nature', desc: 'Calming outdoor scenes' },
  { id: 'tech', label: '💻 Tech/Futuristic', desc: 'Digital, neon aesthetics' },
  { id: 'minimal', label: '⬜ Minimal', desc: 'Clean, white backgrounds' },
];

const STEPS = ['Script', 'Voice', 'Visuals', 'Generate'];

export default function FacelessReelsPage() {
  const [step, setStep] = useState(0);
  const [script, setScript] = useState('');
  const [voice, setVoice] = useState('nova');
  const [style, setStyle] = useState('cinematic');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress steps
      const steps = [
        { label: 'Generating voiceover...', pct: 25 },
        { label: 'Generating background visuals...', pct: 55 },
        { label: 'Compositing reel...', pct: 80 },
        { label: 'Finalizing...', pct: 95 },
      ];

      for (const s of steps) {
        setProgress(s.pct);
        await new Promise(r => setTimeout(r, 1200));
      }

      // In production this calls the real API
      // For now simulate a result
      setProgress(100);
      setResult({
        title: script.slice(0, 50) + (script.length > 50 ? '...' : ''),
        duration: '0:47',
        format: '9:16 • 1080×1920',
        style,
        voice,
        previewUrl: null,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13 }}>← Back</a>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎬</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Faceless Reels</span>
          <span style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>NEW</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <a href="/pricing" style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(168,85,247,0.15)', color: '#a855f7', textDecoration: 'none', fontSize: 13, fontWeight: 600, border: '1px solid rgba(168,85,247,0.3)' }}>
            Upgrade for HD
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 48, position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: i <= step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ flex: 1, height: 2, background: i <= step ? '#a855f7' : 'rgba(255,255,255,0.1)' }} />}
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, background: i === step ? '#a855f7' : i < step ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)', border: i === step ? '2px solid #a855f7' : i < step ? '2px solid rgba(168,85,247,0.5)' : '2px solid rgba(255,255,255,0.1)', color: i === step ? 'white' : i < step ? '#a855f7' : 'rgba(255,255,255,0.3)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#a855f7' : 'rgba(255,255,255,0.1)' }} />}
              </div>
              <span style={{ fontSize: 12, color: i === step ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Script */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Write your script</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>What is your reel about? Write a script or pick a template below.</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Quick templates</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TOPICS.map(t => (
                  <button key={t} onClick={() => setScript(t)} style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              placeholder="E.g. '5 things you didn't know about black holes. Number 1: A black hole the size of a coin would weigh as much as Mount Everest...'"
              style={{ width: '100%', minHeight: 160, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: 'white', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{script.length} characters · ~{Math.ceil(script.split(' ').length / 150)} min read aloud</span>
              <button onClick={() => script.trim() && setStep(1)} style={{ padding: '10px 24px', borderRadius: 8, background: script.trim() ? '#a855f7' : 'rgba(255,255,255,0.06)', color: script.trim() ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: 14, cursor: script.trim() ? 'pointer' : 'not-allowed', border: 'none' }}>
                Next: Choose Voice →
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Voice */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Choose a voice</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>AI-generated voiceover for your reel.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {VOICES.map(v => (
                <div key={v.id} onClick={() => setVoice(v.id)} style={{ padding: 20, borderRadius: 12, border: `1px solid ${voice === v.id ? '#a855f7' : 'rgba(255,255,255,0.08)'}`, background: voice === v.id ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: voice === v.id ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎙</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{v.label}</div>
                  </div>
                  {voice === v.id && <div style={{ marginLeft: 'auto', color: '#a855f7' }}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(0)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 14 }}>← Back</button>
              <button onClick={() => setStep(2)} style={{ padding: '10px 24px', borderRadius: 8, background: '#a855f7', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>Next: Visuals →</button>
            </div>
          </div>
        )}

        {/* Step 2: Visual Style */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Choose visual style</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>Background visuals are AI-generated to match your content.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {STYLES.map(s => (
                <div key={s.id} onClick={() => setStyle(s.id)} style={{ padding: 20, borderRadius: 12, border: `1px solid ${style === s.id ? '#a855f7' : 'rgba(255,255,255,0.08)'}`, background: style === s.id ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.label.split(' ')[0]}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.label.split(' ').slice(1).join(' ')}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                  {style === s.id && <div style={{ marginTop: 8, color: '#a855f7', fontSize: 13, fontWeight: 600 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(1)} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 14 }}>← Back</button>
              <button onClick={() => { setStep(3); handleGenerate(); }} style={{ padding: '10px 24px', borderRadius: 8, background: '#a855f7', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>Generate Reel ✨</button>
            </div>
          </div>
        )}

        {/* Step 3: Generate */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            {generating && (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Generating your reel...</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>This takes about 30-60 seconds</p>
                <div style={{ maxWidth: 400, margin: '0 auto 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #a855f7, #ec4899)', borderRadius: 100, width: `${progress}%`, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{progress}%</div>
              </div>
            )}

            {!generating && result && (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your reel is ready!</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontSize: 14 }}>Kalivid has generated your faceless reel.</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, maxWidth: 400, margin: '0 auto 32px', textAlign: 'left' }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Reel details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[['Title', result.title], ['Duration', result.duration], ['Format', result.format], ['Style', result.style], ['Voice', result.voice]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                        <span style={{ color: 'white', fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button style={{ padding: '12px 28px', borderRadius: 8, background: '#a855f7', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', border: 'none' }}>⬇ Download Reel</button>
                  <button onClick={() => { setStep(0); setResult(null); setScript(''); }} style={{ padding: '12px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 14 }}>Make another</button>
                </div>
              </div>
            )}

            {!generating && error && (
              <div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
                <p style={{ color: 'rgba(255,100,100,0.8)', marginBottom: 24 }}>{error}</p>
                <button onClick={() => setStep(2)} style={{ padding: '10px 24px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 14 }}>← Try again</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
