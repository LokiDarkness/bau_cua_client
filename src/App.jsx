import { useEffect, useState } from 'react'
import { socket, playerId } from './socket'
import DiceArea from './components/DiceArea'
import BettingBoard from './components/BettingBoard'
import RollButton from './components/RollButton'
import ChatButton from './components/ChatButton'
import ChatSheet from './components/ChatSheet'

export default function App(){
  const [view,setView]=useState('lobby')
  const [name,setName]=useState(localStorage.getItem('name')||'')
  const [rooms,setRooms]=useState([])
  const [room,setRoom]=useState(null)

  const [dice,setDice]=useState(null)
  const [rolling,setRolling]=useState(false)

  const [chat,setChat]=useState([])
  const [showChat,setShowChat]=useState(false)

  useEffect(()=>{
    socket.emit('lobby:getRooms',setRooms)
    socket.on('lobby:update',setRooms)

    socket.on('room:update',r=>{
      setRoom(r)
      setView('room')
      setRolling(r.state==='rolling')
      if (r.state==='betting') setDice(null)
    })

    socket.on('room:rolled',({dice,room})=>{
      setDice(dice)
      setRoom(room)
      setRolling(false)
    })

    socket.on('room:chat',m=>setChat(c=>[...c,m]))

    return ()=>socket.removeAllListeners()
  },[])

  function ensureName(){
    if(!name){
      const n='Player'+Math.floor(Math.random()*9000)
      setName(n);localStorage.setItem('name',n)
      return n
    }
    localStorage.setItem('name',name)
    return name
  }

  /* ===== LOBBY ===== */
  if(view==='lobby'){
    return (
      <div className="p-4 text-white">
        <h1 className="text-xl font-bold mb-3">🎲 Bầu Cua Cloud</h1>
        <input className="border px-2 text-black"
          value={name} onChange={e=>setName(e.target.value)} />
        <button className="bg-red-600 px-3 ml-2"
          onClick={()=>socket.emit('lobby:createRoom',{name:'Bàn của '+ensureName()})}>
          Tạo phòng
        </button>

        {rooms.map(r=>(
          <div key={r.id} className="mt-2">
            {r.name} ({r.playerCount})
            <button className="ml-2 bg-blue-600 px-2"
              onClick={()=>socket.emit('lobby:joinRoom',{roomId:r.id,name:ensureName()})}>
              Vào
            </button>
          </div>
        ))}
      </div>
    )
  }

  if(!room){
    return <div className="text-white p-4">Đang tải...</div>
  }

  const me = room.players.find(p=>p.id===playerId)

  /* ===== ROOM – MOBILE CASINO ===== */
  return (
    <div className="min-h-screen bg-neutral-900 text-white pt-14 pb-24 px-3">
      {/* TOP */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 h-14
                      flex justify-between items-center px-4">
        <b>{room.name}</b>
        <span>💰 {me?.chips||0}</span>
      </div>

      <DiceArea rolling={rolling} dice={dice} />

      <BettingBoard
        room={room}
        onBet={slot=>socket.emit('room:placeBet',{
          roomId:room.id,slot,amount:100
        })}
      />

      {room.hostId===playerId && (
        <RollButton
          disabled={room.state!=='betting'}
          onClick={()=>socket.emit('room:startRoll',{roomId:room.id})}
        />
      )}

      <ChatButton onClick={()=>setShowChat(true)} />
      <ChatSheet
        open={showChat}
        onClose={()=>setShowChat(false)}
        messages={chat}
        onSend={text=>socket.emit('room:chat',{roomId:room.id,text})}
      />
    </div>
  )
}
