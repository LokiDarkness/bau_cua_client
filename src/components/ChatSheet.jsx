import ChatInput from './ChatInput'

export default function ChatSheet({
  open,
  onClose,
  messages,
  onSend
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* sheet */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-white text-black
          rounded-t-2xl
          max-h-[65%]
          flex flex-col
          animate-slide-up
        "
      >
        {/* header */}
        <div className="flex items-center justify-between
                        px-4 py-3 border-b">
          <span className="font-bold">💬 Chat phòng</span>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-auto px-3 py-2 text-sm">
          {messages.map((m, i) => (
            <div key={i} className="mb-1">
              <b>{m.from}:</b> {m.text}
            </div>
          ))}
        </div>

        {/* input */}
        <ChatInput onSend={onSend} />
      </div>
    </div>
  )
}
