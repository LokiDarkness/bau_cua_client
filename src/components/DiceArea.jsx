const LABEL={ bau:'Bầu',cua:'Cua',tom:'Tôm',ca:'Cá',ga:'Gà',nai:'Nai' }

export default function DiceArea({ rolling, dice }){
  return (
    <div className="flex justify-center gap-3 my-2">
      {rolling && [1,2,3].map(i=>(
        <div key={i}
          className="w-14 h-14 bg-white rounded-xl
          flex items-center justify-center
          font-bold animate-dice">?</div>
      ))}
      {!rolling && dice && dice.map((d,i)=>(
        <div key={i}
          className="w-14 h-14 bg-white rounded-xl
          flex items-center justify-center font-bold">
          {LABEL[d]}
        </div>
      ))}
    </div>
  )
}
