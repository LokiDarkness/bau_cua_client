import { useEffect, useState } from 'react'
import DiceArea from './DiceArea'
import BettingBoard from './BettingBoard'
import RollButton from './RollButton'
import ChatButton from './ChatButton'
import ChatSheet from './ChatSheet'
import { socket } from './socket'

export default function MobileCasinoLayout({
  room,dice,rolling,playerId,onBet,onRoll,chat,onSendChat
}) {
  const [showChat,setShowChat]=useState(false)
  const me = room.players.find(p=>p.id===playerId)

  return (
    <div className="min-h-screen bg-neutral-900 text-white pt-14 pb-24 px-3">
      <div className="fixed top-0 left-0 right-0 h-14 bg-red-600
                      flex justify-between items-center px-4">
        <b>{room.name}</b><span>💰 {me?.chips||0}</span>
      </div>

      <DiceArea rolling={rolling} dice={dice}/>
      <BettingBoard room={room} onBet={onBet}/>

      {room.hostId===playerId &&
        <RollButton disabled={room.state!=='betting'} onClick={onRoll}/>}

      <ChatButton onClick={()=>setShowChat(true)}/>
      <ChatSheet open={showChat} onClose={()=>setShowChat(false)}
        messages={chat} onSend={onSendChat}/>
    </div>
  )
}
