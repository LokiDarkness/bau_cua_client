export default function RollButton({ show, onRoll }){
  if (!show) return null
  return (
    <button
      onClick={onRoll}
      className="fixed bottom-4 left-4 right-4
      bg-red-600 text-white py-4
      rounded-2xl text-lg font-bold shadow-xl">
      🎲 QUAY
    </button>
  )
}
