import { useState } from 'react'

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('')

  function send() {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex gap-2 p-3 border-t">
      <input
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        placeholder="Nhập chat..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && send()}
      />
      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        Gửi
      </button>
    </div>
  )
}
