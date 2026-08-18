export default function Home(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-brand">Farm Attendance</h1>
            <p className="mt-4 text-muted">Simple, reliable supervision for small farm projects. Track student attendance, shifts and weekly data collection with evidence and exports.</p>
            <div className="mt-6">
              <a href="/login" className="btn-brand px-4 py-2 rounded mr-3">Sign in</a>
              <a href="/supervisor" className="btn-ghost px-4 py-2 rounded">Supervisor</a>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold">Project Snapshot</h3>
            <div className="mt-3">
              <p className="text-sm text-muted">Final Year Farm Practical — 10 Students</p>
              <div className="mt-4 text-2xl font-semibold">Week 1 of 10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}