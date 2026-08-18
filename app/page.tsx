'use client'
import { Zilla_Slab, Inter, IBM_Plex_Mono } from 'next/font/google'

const display = Zilla_Slab({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export default function Home() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#2b3324] text-[#f1e9d8]`}> 
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5.13 15.87 2 12 2Z" fill="var(--mustard)" />
            </svg>
            <span>Farm Attendance</span>
          </div>
          <a href="/login" className="btn-ghost-nav">Sign in</a>
        </div>
      </header>

      <main className="wrap hero">
        <div className="hero-copy">
          <p className="eyebrow">Final Year Farm Practical &middot; Cohort of 10</p>
          <h1>
            One log, kept
            <br />
            straight all season.
          </h1>
          <p className="lede">
            Supervisors mark shifts and review evidence in minutes. Students clock in,
            attach proof of work, and see exactly where their attendance stands —
            no spreadsheets, no chasing signatures.
          </p>
          <div className="cta-row">
            <a href="/login" className="btn-primary">Sign in</a>
            <a href="/supervisor" className="btn-secondary">Supervisor console</a>
          </div>
          <dl className="stat-row">
            <div>
              <dt>Students tracked</dt>
              <dd>10</dd>
            </div>
            <div>
              <dt>Weeks in program</dt>
              <dd>10</dd>
            </div>
            <div>
              <dt>Evidence required</dt>
              <dd>Every shift</dd>
            </div>
          </dl>
        </div>

        <div className="log-card" role="img" aria-label="Field log snapshot: Week 1 of 10, 10 students enrolled">
          <div className="log-stamp">WK<br />01<span>/10</span></div>
          <p className="log-kicker">Project snapshot</p>
          <h2>Week 1 of 10</h2>
          <div className="log-lines">
            <div className="log-row">
              <span>Students enrolled</span>
              <span className="log-value">10</span>
            </div>
            <div className="log-row">
              <span>Shifts logged</span>
              <span className="log-value">0</span>
            </div>
            <div className="log-row">
              <span>Evidence pending</span>
              <span className="log-value">&mdash;</span>
            </div>
            <div className="log-row">
              <span>Status</span>
              <span className="log-value log-value--live">Open</span>
            </div>
          </div>
          <p className="log-foot">Farm Attendance &middot; supervision record</p>
        </div>
      </main>

      <style jsx>{`
        .home-root {
          --ink: #1c2117;
          --field: #2b3324;
          --field-dark: #1f2519;
          --parchment: #f1e9d8;
          --parchment-line: #ddd0ae;
          --mustard: #c98a2b;
          --sage: #8fa88f;
          --font-display: 'Zilla Slab', serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;

          min-height: 100vh;
          background: var(--field);
          background-image: radial-gradient(circle at 15% 0%, var(--field-dark), var(--field) 55%);
          color: var(--parchment);
          font-family: var(--font-body);
          position: relative;
          overflow-x: hidden;
        }

        .grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .topbar {
          border-bottom: 1px solid rgba(241, 233, 216, 0.12);
          position: relative;
          z-index: 1;
        }

        .topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.01em;
        }

        .btn-ghost-nav {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--parchment);
          border: 1px solid rgba(241, 233, 216, 0.35);
          padding: 8px 16px;
          border-radius: 3px;
          text-decoration: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .btn-ghost-nav:hover {
          border-color: var(--mustard);
          background: rgba(201, 138, 43, 0.08);
        }
        .btn-ghost-nav:focus-visible {
          outline: 2px solid var(--mustard);
          outline-offset: 2px;
        }

        .hero {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
          padding: 88px 24px 96px;
        }

        .eyebrow {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--sage);
          margin: 0 0 18px;
        }

        h1 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(2.4rem, 4.2vw, 3.6rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin: 0 0 22px;
          color: var(--parchment);
        }

        .lede {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(241, 233, 216, 0.78);
          max-width: 46ch;
          margin: 0 0 34px;
        }

        .cta-row {
          display: flex;
          gap: 14px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--mustard);
          color: var(--field-dark);
          font-weight: 600;
          padding: 13px 26px;
          border-radius: 3px;
          text-decoration: none;
          font-size: 0.95rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(201, 138, 43, 0.35);
        }
        .btn-primary:focus-visible {
          outline: 2px solid var(--parchment);
          outline-offset: 2px;
        }

        .btn-secondary {
          color: var(--parchment);
          padding: 13px 22px;
          border-radius: 3px;
          border: 1px solid rgba(241, 233, 216, 0.3);
          text-decoration: none;
          font-size: 0.95rem;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .btn-secondary:hover {
          border-color: var(--sage);
          background: rgba(143, 168, 143, 0.08);
        }
        .btn-secondary:focus-visible {
          outline: 2px solid var(--mustard);
          outline-offset: 2px;
        }

        .stat-row {
          display: flex;
          gap: 36px;
          margin: 0;
          padding-top: 28px;
          border-top: 1px solid rgba(241, 233, 216, 0.14);
          flex-wrap: wrap;
        }

        .stat-row dt {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(241, 233, 216, 0.55);
          margin-bottom: 6px;
        }

        .stat-row dd {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.4rem;
          margin: 0;
          color: var(--parchment);
        }

        .log-card {
          position: relative;
          background: var(--parchment);
          color: var(--ink);
          border-radius: 4px;
          padding: 36px 34px 26px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          transform: rotate(0.6deg);
        }

        .log-stamp {
          position: absolute;
          top: -18px;
          right: 28px;
          background: var(--rust, #a64b3a);
          background: var(--mustard);
          color: var(--field-dark);
          font-family: var(--font-mono);
          font-weight: 500;
          font-size: 0.68rem;
          line-height: 1.15;
          text-align: center;
          padding: 8px 10px;
          border-radius: 3px;
          transform: rotate(4deg);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }
        .log-stamp span {
          display: block;
          font-size: 0.6rem;
          opacity: 0.85;
        }

        .log-kicker {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6b6350;
          margin: 0 0 6px;
        }

        .log-card h2 {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.7rem;
          margin: 0 0 22px;
        }

        .log-lines {
          border-top: 1px dashed var(--parchment-line);
        }

        .log-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 13px 0;
          border-bottom: 1px dashed var(--parchment-line);
          font-size: 0.92rem;
        }

        .log-value {
          font-family: var(--font-mono);
          font-weight: 500;
          color: var(--field);
        }

        .log-value--live {
          color: #4a6b3f;
        }
        .log-value--live::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4a6b3f;
          margin-right: 6px;
        }

        .log-foot {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.03em;
          color: #8a8168;
          margin: 18px 0 0;
          text-align: right;
        }

        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 56px 20px 64px;
            gap: 48px;
          }
          .log-card {
            transform: none;
            order: -1;
          }
          h1 {
            font-size: clamp(2rem, 8vw, 2.6rem);
          }
          .stat-row {
            gap: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .btn-primary,
          .btn-ghost-nav,
          .btn-secondary {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}