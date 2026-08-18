'use client'

import { useEffect, useState } from 'react'

export default function Profile(){
  const [user, setUser] = useState<any|null>(null)

  useEffect(()=>{
    fetch('/api/user/me').then(r=>r.json()).then(data=>{
      if(data?.ok) setUser(data.user)
    }).catch(()=>{})
  },[])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="card p-4">
        <p className="text-sm text-muted">Profile and contact info.</p>
        {user ? (
          <div className="mt-3 flex items-center gap-4">
            {user.photo ? (
              <img src={user.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">No photo</div>
            )}
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-muted">{user.email}</div>
              <div className="text-sm mt-2">{user.photo ? <span className="text-green-700">Registered photo uploaded</span> : <span className="text-red-600">No registered photo</span>}</div>
            </div>
          </div>
        ) : (
          <div className="mt-3">Loading...</div>
        )}
      </div>
    </div>
  )
}
