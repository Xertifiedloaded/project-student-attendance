'use client'

import { useState, useEffect } from 'react'

export default function Topbar(){
  const [name, setName] = useState<string|'Guest'>("Guest")

  useEffect(()=>{
    // try fetching current user
    fetch('/api/auth/me').then(r=>r.json()).then(data=>{
      if(data?.ok && data.user){
        setName(data.user.name || data.user.email || 'User')
      }
    }).catch(()=>{})
  },[])

  async function handleLogout(){
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="hidden sm:block">
        <span className="text-sm text-muted">Signed in as</span>
        <div className="font-semibold">{name}</div>
      </div>

      <div className="ml-auto">
        <button onClick={handleLogout} className="px-3 py-2 rounded border text-sm">Logout</button>
      </div>
    </div>
  )
}
