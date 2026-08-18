'use client'

import { useEffect, useState } from 'react'

export default function SupervisorDashboard(){
  const [summary, setSummary] = useState<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(()=>{
    fetch('/api/supervisor/summary').then(r=>r.json()).then(setSummary)
  },[])

  async function viewStudent(studentId: string){
    setLoadingDetails(true)
    setSelected(null)
    try{
      const res = await fetch(`/api/supervisor/student/${studentId}`)
      const data = await res.json()
      if(res.ok) setSelected(data)
      else alert(data.error || 'Could not load student')
    }catch(e){
      alert('Could not load student')
    }
    setLoadingDetails(false)
  }

  async function verifyAttendance(attendanceId: string, action: 'verify'|'unverify'){
    try{
      const res = await fetch('/api/attendance/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attendanceId, action }) })
      const data = await res.json()
      if(res.ok){
        alert('Attendance updated')
        // refresh summary
        fetch('/api/supervisor/summary').then(r=>r.json()).then(setSummary)
        // refresh selected
        if(selected?.lastAttendance?.id) viewStudent(selected.student.studentId)
      } else alert(data.error || 'Failed')
    }catch(e){ alert('Failed') }
  }

  if(!summary) return <div className="p-6">Loading...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{summary.project.name}</h1>
        <p className="text-sm text-muted">Week {summary.project.week}</p>
      </div>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Students Overview</h2>
          <a className="btn-brand px-3 py-1 rounded" href="/api/export/attendance?scope=current-week">Export Week</a>
        </div>
        <table className="w-full table-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th>Student</th>
              <th>Morning</th>
              <th>Evening</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {summary.students.map((s: any)=> (
              <tr key={s.studentId} className="border-t">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {s.photo ? <span className="text-xs text-green-700">●</span> : <span className="text-xs text-muted">○</span>}
                    </div>
                    <span className="text-xs text-muted">{s.studentId}</span>
                  </div>
                </td>
                <td>{s.morningPresent}</td>
                <td>{s.eveningPresent}</td>
                <td>{s.totalPresent}</td>
                <td className="py-2">
                  <button onClick={()=>viewStudent(s.studentId)} className="px-3 py-1 rounded border text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm text-muted">Project Progress</h3>
          <div className="mt-2 text-2xl font-semibold">—%</div>
        </div>
        <div className="card">
          <h3 className="text-sm text-muted">Morning Attendance</h3>
          <div className="mt-2 text-2xl font-semibold">—%</div>
        </div>
        <div className="card">
          <h3 className="text-sm text-muted">Evening Attendance</h3>
          <div className="mt-2 text-2xl font-semibold">—%</div>
        </div>
      </div>

      {selected && selected.student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold">{selected.student.name}</div>
                <div className="text-xs text-muted">{selected.student.studentId}</div>
              </div>
              <div>
                <button onClick={()=>setSelected(null)} className="px-2 py-1 rounded border">Close</button>
              </div>
            </div>

            <div className="mb-3">
              {selected.student.photo ? (
                <img src={selected.student.photo} alt="Registered" className="w-full h-auto object-contain" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">No photo</div>
              )}
            </div>

            <div className="mb-3">
              <h4 className="font-semibold">Last attendance</h4>
              {selected.lastAttendance ? (
                <div>
                  <div className="text-sm">Status: <span className="font-medium">{selected.lastAttendance.status}</span></div>
                  <div className="text-sm">Time: {new Date(selected.lastAttendance.timestamp).toLocaleString()}</div>
                  <div className="text-sm">Distance: {selected.lastAttendance.distance || '—'} m</div>
                </div>
              ) : (
                <div className="text-sm text-muted">No attendance yet</div>
              )}
            </div>

            {selected.lastAttendance && (
              <div className="flex gap-2">
                <button onClick={()=>verifyAttendance(selected.lastAttendance._id, 'verify')} className="btn-brand px-3 py-2 rounded">Mark verified</button>
                <button onClick={()=>verifyAttendance(selected.lastAttendance._id, 'unverify')} className="px-3 py-2 rounded border">Mark needs review</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
