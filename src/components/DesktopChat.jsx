import { useState } from 'react'

export default function DesktopChat({ chat, onSend }) {
  const [text, setText] = useState('')

  function send(){
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex flex-col flex-1 border-t border-neutral-700 pt-2">
      <div className="flex-1 overflow-auto text-sm">
        {chat.map((m,i)=>(
          <div key={i}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-2">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && send()}
          className="flex-1 bg-neutral-700 px-2 py-1 text-sm rounded"
        />
        <button
          onClick={send}
          className="bg-blue-600 px-2 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  )
}
