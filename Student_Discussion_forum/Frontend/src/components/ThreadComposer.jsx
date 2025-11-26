import { useState } from 'react'

const initialState = {
  title: '',
  description: '',
  tags: ''
}

const ThreadComposer = ({ onSubmit, busy }) => {
  const [form, setForm] = useState(initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }
    onSubmit(payload).then(() => setForm(initialState))
  }

  return (
    <form className="panel composer" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>Start a new discussion</h2>
        <p>Share a question, project idea, or topic with your peers.</p>
      </div>
      <label>
        Topic title
        <input
          type="text"
          name="title"
          placeholder="E.g. Best resources to learn React?"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Details
        <textarea
          name="description"
          rows="4"
          placeholder="Add as much context as possible so others can jump in."
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Tags (comma separated)
        <input
          type="text"
          name="tags"
          placeholder="react, mongodb, final-project"
          value={form.tags}
          onChange={handleChange}
        />
      </label>
      <button type="submit" className="primary" disabled={busy}>
        {busy ? 'Publishing…' : 'Publish thread'}
      </button>
    </form>
  )
}

export default ThreadComposer

