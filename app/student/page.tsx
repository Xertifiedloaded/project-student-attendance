'use client'

import { useState } from 'react'

export default function StudentDashboard(){
  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState('')

  async function mark(shift: string){
    setMessage('')
    setLoading(true)
    // get geolocation
    if(!navigator.geolocation){ setMessage('Geolocation not supported'); setLoading(false); return }
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      const { latitude, longitude } = pos.coords
      // ask for photo via input
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.capture = 'environment'
      fileInput.onchange = async ()=>{
        const file = fileInput.files?.[0]
        if(!file){ setMessage('No photo selected'); setLoading(false); return }
        const reader = new FileReader()
        reader.onload = async ()=>{
          const result = reader.result
          if(typeof result !== 'string'){ setMessage('Failed to read image'); setLoading(false); return }
          const base64 = result.split(',')[1]
          const res = await fetch('/api/attendance/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shiftName: shift, latitude, longitude, photoBase64: base64 })
          })
          const data = await res.json()
          if(res.ok) setMessage('Attendance recorded')
          else setMessage(data.error || 'Error')
          setLoading(false)
        }
        reader.readAsDataURL(file)
      }
      fileInput.click()
    }, (err)=>{ setMessage('Location permission denied'); setLoading(false) })
  }

  return (
    <div className="p-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Good morning</h1>
        <p className="text-sm text-muted mb-4">Today's Schedule</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 card">
            <h2 className="font-medium">Morning Shift</h2>
            <p className="text-sm text-muted">08:00 - 12:00</p>
            <button onClick={()=>mark('Morning')} disabled={loading} className="mt-3 btn-brand py-2 rounded">Mark Morning Attendance</button>
          </div>

          <div className="p-4 card">
            <h2 className="font-medium">Evening Shift</h2>
            <p className="text-sm text-muted">16:00 - 18:00</p>
            <button onClick={()=>mark('Evening')} disabled={loading} className="mt-3 btn-ghost py-2 rounded">Mark Evening Attendance</button>
          </div>
        </div>
        {message && <div className="mt-4 text-sm">{message}</div>}
      </div>
    </div>
  )
}
