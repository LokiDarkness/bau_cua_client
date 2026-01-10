import DiceArea from '../DiceArea'
import DesktopBoard from './DesktopBoard'
import PlayerList from './PlayerList'
import DesktopChat from './DesktopChat'
import RollButton from '../RollButton'

export default function DesktopCasinoLayout({
  room,
  dice,
  rolling,
  playerId,
  onBet,
  onRoll,
  chat,
  onSendChat
}) {
  const me = room.players.find(p => p.id === playerId)

  return (
    <div className="h-screen bg-neutral-800 text-white flex flex-col">

      {/* TOP */}
      <div className="h-14 bg-red-700 flex items-center
                      justify-between px-6 font-bold">
        <span>🎲 Bầu Cua Cloud</span>
        <span>💰 {me?.chips ?? 0}</span>
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT */}
        <div className="w-64 bg-neutral-900 p-3 flex flex-col">
          <PlayerList room={room} playerId={playerId} />
          <DesktopChat chat={chat} onSend={onSendChat} />
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <DiceArea rolling={rolling} dice={dice} />
          <DesktopBoard room={room} onBet={onBet} />

          {room.hostId === playerId && (
            <div className="mt-4 w-64">
              <RollButton
                disabled={room.state !== 'betting'}
                onClick={onRoll}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
