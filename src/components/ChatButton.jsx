export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-24 right-4 z-30
        w-14 h-14 rounded-full
        bg-blue-600 text-white
        text-2xl shadow-xl
        active:scale-95
      "
    >
      💬
    </button>
  )
}
