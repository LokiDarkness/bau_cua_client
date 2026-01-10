const LABEL = {
  bau: 'BẦU',
  cua: 'CUA',
  tom: 'TÔM',
  ca: 'CÁ',
  ga: 'GÀ',
  nai: 'NAI'
}

export default function DiceArea({ rolling, dice }) {
  return (
    <div className="flex justify-center gap-4 mt-6 mb-4">
      {rolling &&
        [1, 2, 3].map(i => (
          <div
            key={i}
            className="w-16 h-16 bg-white text-black
                       rounded-2xl flex items-center
                       justify-center font-bold
                       animate-dice"
          >
            ?
          </div>
        ))}

      {!rolling && dice &&
        dice.map((d, i) => (
          <div
            key={i}
            className="w-16 h-16 bg-white text-black
                       rounded-2xl flex items-center
                       justify-center font-bold"
          >
            {LABEL[d]}
          </div>
        ))}
    </div>
  )
}
