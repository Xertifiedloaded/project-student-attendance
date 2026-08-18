'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const router = useRouter()

  async function submit(e: any){
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if(!res.ok){ setError(data.error || 'Login failed'); return }
    // redirect based on role — use full navigation so the auth cookie set by the server is present on the next page
    const role = data?.role || 'STUDENT'
    if (role === 'SUPERVISOR') {
      window.location.href = '/supervisor'
    } else {
      window.location.href = '/student'
    }
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
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Sign in</h2>
          {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
          <form onSubmit={submit}>
            <label className="block mb-2 text-sm text-muted">Email
              <input className="w-full border p-2 mt-1 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </label>
            <label className="block mb-4 text-sm text-muted">Password
              <input type="password" className="w-full border p-2 mt-1 rounded" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </label>
            <button className="w-full btn-brand py-2 rounded">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}
