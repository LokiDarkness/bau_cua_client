import { SLOT_ICONS } from '../constants/icons'
const SLOTS = ['bau', 'cua', 'tom', 'ca', 'ga', 'nai']
const LABEL = {
  bau: 'BẦU',
  cua: 'CUA',
  tom: 'TÔM',
  ca: 'CÁ',
  ga: 'GÀ',
  nai: 'NAI'
}

export default function BettingBoard({ room, onBet }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {SLOTS.map(s => (
        <button
          key={s}
          onClick={() => onBet(s)}
          disabled={room.state !== 'betting'}
          className="
            relative bg-white text-black
            rounded-2xl h-24
            flex flex-col items-center justify-center
            shadow-xl active:scale-95
            disabled:opacity-50
          "
        >
          <img
            src={SLOT_ICONS[s]}
            alt={s}
            className="w-12 h-12 mb-1"
          />
          <span className="text-xs text-gray-600">
            Tổng {room.totals[s]}
          </span>
        </button>
      ))}
    </div>
  )
}
