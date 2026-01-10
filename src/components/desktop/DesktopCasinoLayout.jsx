import DiceArea from '../DiceArea'
import BettingBoard from '../BettingBoard'
import RollButton from '../RollButton'
import DesktopChat from '../DesktopChat'
import PlayerList from '../PlayerList'

export default function DesktopCasinoLayout({
  room,dice,rolling,playerId,onBet,onRoll,chat,onSendChat
}) {
  const me = room.players.find(p=>p.id===playerId)

  return (
    <div className="h-screen bg-neutral-800 text-white flex flex-col">
      <div className="h-14 bg-red-700 flex justify-between items-center px-6">
        <b>🎲 Bầu Cua Cloud</b><span>💰 {me?.chips||0}</span>
      </div>

      <div className="flex flex-1">
        <div className="w-64 bg-neutral-900 p-3">
          <PlayerList room={room} playerId={playerId}/>
          <DesktopChat chat={chat} onSend={onSendChat}/>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <DiceArea rolling={rolling} dice={dice}/>
          <BettingBoard room={room} onBet={onBet}/>
          {room.hostId===playerId &&
            <div className="mt-4 w-64">
              <RollButton disabled={room.state!=='betting'} onClick={onRoll}/>
            </div>}
        </div>
      </div>
    </div>
  )
}
