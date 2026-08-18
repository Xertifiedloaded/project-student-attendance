'use client'

import { useEffect, useState } from 'react'

export default function SupervisorDashboard(){
  const [summary, setSummary] = useState<any>(null)

  useEffect(()=>{
    fetch('/api/supervisor/summary').then(r=>r.json()).then(setSummary)
  },[])

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
    </div>
  )
}
