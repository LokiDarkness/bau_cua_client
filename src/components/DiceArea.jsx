import { SLOT_ICONS } from './constants/icons'

export default function DiceArea({ rolling, dice }) {
  return (
    <div className="flex justify-center gap-4 mt-6 mb-4">
      {rolling &&
        [1,2,3].map(i => (
          <div key={i}
            className="w-16 h-16 bg-white rounded-2xl
                       flex items-center justify-center
                       animate-dice">
            <span className="text-2xl font-bold">?</span>
          </div>
        ))
      }

      {!rolling && dice &&
        dice.map((d,i)=>(
          <div key={i}
            className="w-16 h-16 bg-white rounded-2xl
                       flex items-center justify-center">
            <img src={SLOT_ICONS[d]} className="w-10 h-10" />
          </div>
        ))
      }
    </div>
  )
}
