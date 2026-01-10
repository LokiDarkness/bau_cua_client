export default function PlayerList({ room, playerId }) {
  return (
    <div className="mb-3">
      <h3 className="font-bold mb-2">👥 Người chơi</h3>
      {room.players.map(p => (
        <div
          key={p.id}
          className={`flex justify-between text-sm py-1
            ${p.id === playerId ? 'text-yellow-400' : ''}`}
        >
          <span>{p.name}</span>
          <span>💰 {p.chips}</span>
        </div>
      ))}
    </div>
  )
}
