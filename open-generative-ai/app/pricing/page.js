'use client';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    credits: 50,
    color: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    features: ['50 credits/month', 'Watermarked exports', 'Image & video generation', 'Community support', '720p max resolution'],
    cta: 'Get Started',
    href: '/api/billing/checkout?plan=free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    credits: 1000,
    color: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.4)',
    features: ['1,000 credits/month', 'No watermark', 'HD exports (1080p)', 'Faceless Reels studio', 'Priority support', 'API access'],
    cta: 'Start Pro',
    href: '/api/billing/checkout?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    credits: 5000,
    color: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.15)',
    features: ['5,000 credits/month', 'Custom model integration', 'Dedicated API endpoint', 'White-label option', 'Dedicated support', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: 'mailto:sales@kalivid.ai',
    popular: false,
  },
];

const packs = [
  { name: 'Starter Pack', price: 9, credits: 200, href: '/api/billing/checkout?pack=starter' },
  { name: 'Growth Pack', price: 29, credits: 750, href: '/api/billing/checkout?pack=growth' },
  { name: 'Pro Pack', price: 79, credits: 2500, href: '/api/billing/checkout?pack=pro' },
];

const features = [
  { name: 'Credits/month', free: '50', pro: '1,000', enterprise: '5,000' },
  { name: 'Image generation', free: '✓', pro: '✓', enterprise: '✓' },
  { name: 'Video generation', free: '✓', pro: '✓', enterprise: '✓' },
  { name: 'Faceless Reels', free: '✗', pro: '✓', enterprise: '✓' },
  { name: 'Watermark-free exports', free: '✗', pro: '✓', enterprise: '✓' },
  { name: 'HD exports', free: '720p', pro: '1080p', enterprise: '4K' },
  { name: 'API access', free: '✗', pro: '✓', enterprise: '✓' },
  { name: 'Custom models', free: '✗', pro: '✗', enterprise: '✓' },
  { name: 'White-label', free: '✗', pro: '✗', enterprise: '✓' },
  { name: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated SLA' },
];

export default function PricingPage() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: 'Inter, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 20, padding: '4px 16px', fontSize: 13, color: '#a855f7', marginBottom: 20 }}>
            Simple, transparent pricing
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Choose your plan
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            Generate AI faceless reels, images, and videos. Pay as you go or subscribe for the best value.
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 80 }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ position: 'relative', background: plan.color, border: `1px solid ${plan.border}`, borderRadius: 16, padding: 32 }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#a855f7', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: plan.popular ? '#a855f7' : 'white' }}>${plan.price}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>/{plan.period}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{plan.credits.toLocaleString()} credits included</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: '#a855f7', fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, background: plan.popular ? '#a855f7' : 'rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none', border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)', transition: 'opacity 0.2s' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Credit Packs */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>Credit Packs</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Top up your credits anytime. Never expire.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {packs.map((pack) => (
              <div key={pack.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{pack.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#a855f7' }}>${pack.price}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{pack.credits.toLocaleString()} credits</div>
                <a href={pack.href} style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                  Buy Credits
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison */}
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>Feature Comparison</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600 }}>Free</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#a855f7' }}>Pro</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600 }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.7)' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: row.free === '✗' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>{row.free}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: row.pro === '✗' ? 'rgba(255,255,255,0.2)' : '#a855f7', fontWeight: row.pro !== '✗' ? 500 : 400 }}>{row.pro}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: row.enterprise === '✗' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
