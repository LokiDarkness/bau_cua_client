import DiceArea from '../components/DiceArea'
import Board from '../components/Board'
import { socket, playerId } from '../socket'

export default function PcLayout({ room, dice, rolling, winSlots, slotRefs }){
  return (
    <div className="min-h-screen bg-green-800 p-6 grid grid-cols-12 gap-4">
      <div className="col-span-6 bg-white p-4 rounded-xl">
        <DiceArea rolling={rolling} dice={dice} />
        <Board
          room={room}
          winSlots={winSlots}
          slotRefs={slotRefs}
          onBet={s=>socket.emit('room:placeBet',{
            roomId:room.id,slot:s,amount:100
          })}
        />
        {room.hostId===playerId && (
          <button onClick={()=>socket.emit('room:startRoll',{roomId:room.id})}
            className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl">
            🎲 QUAY
          </button>
        )}
      </div>
    </div>
  )
}
