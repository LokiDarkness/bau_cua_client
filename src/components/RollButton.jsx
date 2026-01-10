export default function RollButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        fixed bottom-4 left-4 right-4 z-20
        h-14 rounded-full
        bg-gradient-to-r from-yellow-400 to-yellow-300
        text-black font-extrabold text-xl
        shadow-[0_0_20px_rgba(250,204,21,0.6)]
        active:scale-95
        disabled:opacity-40
      "
    >
      🎲 QUAY
    </button>
  )
}
