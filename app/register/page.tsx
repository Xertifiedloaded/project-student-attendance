'use client'

import { useEffect, useRef, useState } from 'react'

export default function Register(){
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [role,setRole] = useState('STUDENT')
  const [error,setError] = useState<string|null>(null)
  const [streaming,setStreaming] = useState(false)
  const videoRef = useRef<HTMLVideoElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const [photoDataUrl,setPhotoDataUrl] = useState<string|null>(null)

  useEffect(()=>{
    return ()=>{
      if(videoRef.current && videoRef.current.srcObject){
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(t=>t.stop())
      }
    }
  },[])

  async function startCamera(){
    setError(null)
    try{
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      if(videoRef.current){
        videoRef.current.srcObject = s
        await videoRef.current.play()
        setStreaming(true)
      }
    }catch(e:any){
      setError('Could not access camera: ' + (e?.message || e))
    }
  }

  function capture(){
    setError(null)
    if(!videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current || document.createElement('canvas')
    canvas.width = video.videoWidth || 320
    canvas.height = video.videoHeight || 240
    const ctx = canvas.getContext('2d')
    if(!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const data = canvas.toDataURL('image/jpeg', 0.9)
    setPhotoDataUrl(data)
  }

  async function submit(e: any){
    e?.preventDefault()
    setError(null)
    if(!email) { setError('Please enter your email'); return }
    const base64 = photoDataUrl ? photoDataUrl.split(',')[1] : null
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role, photoBase64: base64 })
    })
    const data = await res.json()
    if(!res.ok){ setError(data.error || 'Registration failed'); return }
    // After register, navigate to login
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md card">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded bg-white flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5.13 15.87 2 12 2Z" fill="#ffffff"/></svg>
          </div>
          <h1 className="text-lg font-semibold text-white">Farm Attendance</h1>
        </div>

        <div className="bg-white p-6 rounded">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Register</h2>
          {error && <div className="mb-2 text-sm text-red-600">{error}</div>}

          <form onSubmit={submit}>
            <label className="block mb-2 text-sm text-muted">Email
              <input className="w-full border p-2 mt-1 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </label>
            <label className="block mb-2 text-sm text-muted">Full name
              <input className="w-full border p-2 mt-1 rounded" value={name} onChange={(e)=>setName(e.target.value)} />
            </label>

            <label className="block mb-4 text-sm text-muted">Role
              <select className="w-full border p-2 mt-1 rounded" value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value="STUDENT">Student</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
            </label>

            <div className="mb-3">
              {!streaming && <button type="button" onClick={startCamera} className="btn-brand px-3 py-2 rounded">Open camera</button>}
              {streaming && !photoDataUrl && (
                <div className="mt-3">
                  <video ref={videoRef} className="w-full rounded" playsInline />
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={capture} className="btn-brand px-3 py-2 rounded">Capture</button>
                    <button type="button" onClick={()=>{ if(videoRef.current && videoRef.current.srcObject){ const tracks = (videoRef.current.srcObject as MediaStream).getTracks(); tracks.forEach(t=>t.stop()); videoRef.current.srcObject = null } setStreaming(false); setPhotoDataUrl(null) }} className="px-3 py-2 rounded border">Close</button>
                  </div>
                </div>
              )}

              {photoDataUrl && (
                <div className="mt-3">
                  <img src={photoDataUrl} alt="Captured" className="w-full rounded" />
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={()=>setPhotoDataUrl(null)} className="px-3 py-2 rounded border">Retake</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="w-full btn-brand py-2 rounded">Register</button>
              <a href="/login" className="w-full text-center py-2 rounded border">Back to login</a>
            </div>
          </form>

          <canvas ref={canvasRef} style={{display: 'none'}} />
        </div>
      </div>
    </div>
  )
}
