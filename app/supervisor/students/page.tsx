'use client'

export default function StudentsPage(){
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Students</h1>
      <div className="card">
        <p className="text-sm text-muted">List of 10 students. Click a student to view profile.</p>
        <div className="mt-4 grid gap-2">
          {Array.from({length:10}).map((_,i)=> (
            <a key={i} href={`/supervisor/students/stu${i+1}`} className="block p-3 border rounded hover:bg-gray-50">Student {String(i+1).padStart(2,'0')} — STU{String(i+1).padStart(2,'0')}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
