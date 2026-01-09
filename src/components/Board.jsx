const SLOTS=['bau','cua','tom','ca','ga','nai']
const LABEL={ bau:'Bầu',cua:'Cua',tom:'Tôm',ca:'Cá',ga:'Gà',nai:'Nai' }

export default function Board({ room, winSlots, slotRefs, onBet }){
  return (
    <div className="grid grid-cols-3 gap-2">
      {SLOTS.map(s=>(
        <button key={s}
          ref={el=>slotRefs.current[s]=el}
          onClick={()=>onBet(s)}
          disabled={room.state!=='betting'}
          className={`border p-3 rounded-xl
            ${winSlots[s]>=2?'win-slot-strong':''}
            ${winSlots[s]===1?'win-slot':''}`}>
          {LABEL[s]}<br/>
          Tổng {room.totals[s]}
        </button>
      ))}
    </div>
  )
}
