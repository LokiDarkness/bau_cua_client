const SLOTS = ['bau','cua','tom','ca','ga','nai']
const LABEL = {
  bau:'BẦU', cua:'CUA', tom:'TÔM',
  ca:'CÁ', ga:'GÀ', nai:'NAI'
}

export default function DesktopBoard({ room, onBet }) {
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {SLOTS.map(s => (
        <button
          key={s}
          onClick={() => onBet(s)}
          disabled={room.state !== 'betting'}
          className="
            w-40 h-32 rounded-2xl bg-white text-black
            shadow-2xl font-bold text-xl
            hover:scale-105 transition
            disabled:opacity-40
          "
        >
          <div>{LABEL[s]}</div>
          <div className="text-sm mt-2">
            Tổng {room.totals[s]}
          </div>
        </button>
      ))}
    </div>
  )
}
