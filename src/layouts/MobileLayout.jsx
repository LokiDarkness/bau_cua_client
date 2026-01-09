import TopBar from '../components/TopBar'
import DiceArea from '../components/DiceArea'
import Board from '../components/Board'
import RollButton from '../components/RollButton'
import { socket, playerId } from '../socket'

export default function MobileLayout(props){
  const { room, dice, rolling, winSlots, slotRefs } = props
  const me = room.players.find(p=>p.id===playerId)

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-24 px-3">
      <TopBar title={room.name} chips={me?.chips||0} />
      <DiceArea rolling={rolling} dice={dice} />
      <Board
        room={room}
        winSlots={winSlots}
        slotRefs={slotRefs}
        onBet={s=>socket.emit('room:placeBet',{
          roomId:room.id,slot:s,amount:100
        })}
      />
      <RollButton
        show={room.hostId===playerId}
        onRoll={()=>socket.emit('room:startRoll',{roomId:room.id})}
      />
    </div>
  )
}
