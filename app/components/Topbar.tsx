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
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 py-3">
        <div className="hidden sm:block">
          <div className="text-sm text-gray-500">Signed in as</div>
          <div className="font-semibold text-gray-800">{name}</div>
        </div>

        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md border text-sm bg-transparent hover:bg-gray-50 text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
