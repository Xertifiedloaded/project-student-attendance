'use client'

import { useEffect, useRef, useState } from 'react'
import { Zilla_Slab, Inter, IBM_Plex_Mono } from 'next/font/google'

const display = Zilla_Slab({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((t) => t.stop())
      }
    }
  }, [])

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    setStreaming(false)
  }

  async function startCamera() {
    setError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
        setStreaming(true)
      }
    } catch (e: any) {
      setError("We couldn't reach your camera — check your browser permissions and try again.")
    }
  }

  function capture() {
    setError(null)
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current || document.createElement('canvas')
    canvas.width = video.videoWidth || 320
    canvas.height = video.videoHeight || 240
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.9))
    stopCamera()
  }

  function onUpload(e: any) {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      if (typeof r.result === 'string') setPhotoDataUrl(r.result)
    }
    r.readAsDataURL(f)
  }

  async function submit(e: any) {
    e?.preventDefault()
    setError(null)
    if (!email) {
      setError("Don't forget your email — that's how you'll sign back in.")
      return
    }
    if (!name) {
      setError("Tell us your name so we know who's on the roster.")
      return
    }
    setLoading(true)
    const base64 = photoDataUrl ? photoDataUrl.split(',')[1] : null
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, photoBase64: base64 }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "That didn't go through — try again.")
        setLoading(false)
        return
      }
      window.location.href = role === 'STUDENT' ? '/student' : '/login'
    } catch (e) {
      setError('Something went wrong on our end. Try again in a moment.')
      setLoading(false)
    }
  }

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen w-full flex flex-col lg:flex-row font-[family-name:var(--font-body)] bg-[#2b3324]`}>
      <div className="relative hidden lg:flex lg:w-[42%] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_15%_0%,#1f2519,#2b3324_55%)] px-14 py-16 text-[#f1e9d8]">
        <a href="/" className="flex items-center gap-3 font-[family-name:var(--font-display)] text-lg font-bold">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5.13 15.87 2 12 2Z" fill="#c98a2b" />
          </svg>
          Farm Attendance
        </a>
        <div>
          <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[#8fa88f]">Cohort of 10 &middot; Final year practical</p>
          <h1 className="mb-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight">
            Get your name
            <br />
            on the roster.
          </h1>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-[#f1e9d8]/75">
            A minute of setup now means no arguing over attendance later.
            Add a photo so your supervisor recognizes you on the field, day one.
          </p>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-xs text-[#f1e9d8]/40">Farm Attendance &middot; supervision record</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#c98a2b]/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5.13 15.87 2 12 2Z" fill="#c98a2b" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[#f1e9d8]">Farm Attendance</span>
          </div>

          <div className="rounded-lg bg-[#f1e9d8] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-9">
            <p className="mb-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.06em] text-[#6b6350]">New here</p>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold text-[#1c2117]">Set up your record</h2>

            {error && (
              <div className="mb-5 rounded-md border border-[#a64b3a]/30 bg-[#a64b3a]/10 px-4 py-3 text-sm text-[#a64b3a]">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#1c2117]">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full rounded-md border border-[#ddd0ae] bg-white px-3.5 py-2.5 text-[#1c2117] outline-none transition focus:border-[#c98a2b] focus:ring-2 focus:ring-[#c98a2b]/25"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#1c2117]">Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As it appears on your roster"
                  className="w-full rounded-md border border-[#ddd0ae] bg-white px-3.5 py-2.5 text-[#1c2117] outline-none transition focus:border-[#c98a2b] focus:ring-2 focus:ring-[#c98a2b]/25"
                />
              </label>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-[#1c2117]">You are a</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('STUDENT')}
                    className={`rounded-md border px-4 py-2.5 text-sm font-medium transition ${
                      role === 'STUDENT'
                        ? 'border-[#184E3B] bg-[#184E3B] text-white'
                        : 'border-[#ddd0ae] bg-white text-[#1c2117] hover:border-[#184E3B]'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('SUPERVISOR')}
                    className={`rounded-md border px-4 py-2.5 text-sm font-medium transition ${
                      role === 'SUPERVISOR'
                        ? 'border-[#184E3B] bg-[#184E3B] text-white'
                        : 'border-[#ddd0ae] bg-white text-[#1c2117] hover:border-[#184E3B]'
                    }`}
                  >
                    Supervisor
                  </button>
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-[#1c2117]">
                  Photo <span className="font-normal text-[#6b6350]">(so your supervisor knows it's you)</span>
                </span>

                {!streaming && !photoDataUrl && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="rounded-md border border-dashed border-[#ddd0ae] bg-white/60 px-3 py-6 text-sm text-[#6b6350] transition hover:border-[#c98a2b] hover:text-[#1c2117]"
                    >
                      Use camera
                    </button>
                    <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-[#ddd0ae] bg-white/60 px-3 py-6 text-center text-sm text-[#6b6350] transition hover:border-[#c98a2b] hover:text-[#1c2117]">
                      Upload a picture
                      <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                    </label>
                  </div>
                )}

                {streaming && !photoDataUrl && (
                  <div className="overflow-hidden rounded-md border border-[#ddd0ae]">
                    <video ref={videoRef} playsInline className="aspect-[4/3] w-full bg-black object-cover" />
                    <div className="flex gap-2 bg-white p-2.5">
                      <button type="button" onClick={capture} className="flex-1 rounded-md bg-[#184E3B] py-2 text-sm font-medium text-white transition hover:bg-[#216B47]">
                        Capture
                      </button>
                      <button type="button" onClick={stopCamera} className="rounded-md border border-[#ddd0ae] px-4 py-2 text-sm text-[#1c2117]">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {photoDataUrl && (
                  <div className="overflow-hidden rounded-md border border-[#ddd0ae]">
                    <img src={photoDataUrl} alt="Your uploaded photo" className="aspect-[4/3] w-full object-cover" />
                    <div className="flex items-center justify-between bg-white p-2.5">
                      <span className="pl-1 text-xs text-[#6b6350]">That'll do nicely.</span>
                      <button type="button" onClick={() => setPhotoDataUrl(null)} className="rounded-md border border-[#ddd0ae] px-3 py-1.5 text-sm text-[#1c2117]">
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#184E3B] py-3 text-sm font-semibold text-white transition hover:bg-[#216B47] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Setting up your record…' : 'Create my record'}
              </button>

              <p className="text-center text-sm text-[#6b6350]">
                Already signed up?{' '}
                <a href="/login" className="font-medium text-[#184E3B] underline-offset-2 hover:underline">
                  Sign in instead
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}