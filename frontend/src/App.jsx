import './App.css'
import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Loading API state')
  const [submitting, setSubmitting] = useState(false)

  async function loadTasks() {
    const response = await fetch(`${API_BASE_URL}/api/tasks`)
    if (!response.ok) {
      throw new Error(`Task API failed with ${response.status}`)
    }
    setTasks(await response.json())
    setStatus('API connected')
  }

  useEffect(() => {
    loadTasks().catch((error) => {
      setStatus(error.message)
    })
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextTitle = title.trim()

    if (!nextTitle) {
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: nextTitle }),
      })

      if (!response.ok) {
        throw new Error(`Create task failed with ${response.status}`)
      }

      setTitle('')
      await loadTasks()
    } catch (error) {
      setStatus(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="shell">
      <section className="overview">
        <div>
          <p className="eyebrow">Platform Starter</p>
          <h1>Release workbench</h1>
          <p className="summary">
            A small task service used to prove API, database, and web delivery
            before Jenkins and GitOps automation are added.
          </p>
        </div>
        <div className="status">
          <span className="status-dot" />
          <span>{status}</span>
        </div>
      </section>

      <section className="panel">
        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">Task title</label>
          <div className="form-row">
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add a deployment task"
              maxLength={120}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Adding' : 'Add'}
            </button>
          </div>
        </form>

        <div className="task-list">
          <div className="list-header">
            <h2>Tasks</h2>
            <span>{tasks.length} total</span>
          </div>
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <span>{task.title}</span>
                  <time dateTime={task.createdAt}>
                    {new Date(task.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
