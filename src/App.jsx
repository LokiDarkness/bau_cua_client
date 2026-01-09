import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

/* ===== PLAYER ID CỐ ĐỊNH ===== */
let playerId = localStorage.getItem('playerId')
if (!playerId){
  playerId = crypto.randomUUID()
  localStorage.setItem('playerId', playerId)
}

const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports:['websocket'],
  auth:{ playerId }
})

const SLOTS = ['bau','cua','tom','ca','ga','nai']
const LABEL = { bau:'Bầu', cua:'Cua', tom:'Tôm', ca:'Cá', ga:'Gà', nai:'Nai' }

export default function App(){
  const [view,setView]=useState('lobby')
  const [name,setName]=useState(localStorage.getItem('name')||'')
  const [rooms,setRooms]=useState([])
  const [room,setRoom]=useState(null)
  const [dice,setDice]=useState(null)
  const [rolling,setRolling]=useState(false)
  const [betLock, setBetLock] = useState(false)
  
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
    })

    return ()=>socket.removeAllListeners()
  },[])

  function ensureName(){
    if (!name){
      const n='Player'+Math.floor(Math.random()*9000)
      setName(n);localStorage.setItem('name',n)
      return n
    }
    localStorage.setItem('name',name)
    return name
  }

  /* ===== ACTIONS ===== */
  function createRoom(){
    socket.emit('lobby:createRoom',{ name:'Bàn của '+ensureName() })
  }
  function joinRoom(id){
    socket.emit('lobby:joinRoom',{ roomId:id, name:ensureName() })
  }
  function placeBet(slot){
    if (!room || room.state !== 'betting') return
    if (betLock) return

    setBetLock(true)

    socket.emit(
      'room:placeBet',
      { roomId: room.id, slot, amount: 100 },
      () => {
        // mở khóa sau 150ms
        setTimeout(() => setBetLock(false), 150)
      }
    )
  }

  function startRoll(){
    socket.emit('room:startRoll',{ roomId:room.id })
  }

  /* ===== LOBBY ===== */
  if (view==='lobby'){
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Bầu Cua Cloud</h1>
        <input className="border px-2 mr-2" value={name}
          onChange={e=>setName(e.target.value)} />
        <button className="bg-red-600 text-white px-3" onClick={createRoom}>Tạo</button>
        {rooms.map(r=>(
          <div key={r.id}>
            {r.name} ({r.playerCount})
            <button onClick={()=>joinRoom(r.id)}>Vào</button>
          </div>
        ))}
      </div>
    )
  }

  /* ===== ROOM ===== */
  return (
    <div className="p-2">
      <div className="bg-red-600 text-white p-2 flex justify-between">
        <span>{room.name}</span>
        <span>Host: {room.hostId===playerId?'Bạn':'Người khác'}</span>
      </div>

      <div className="text-center my-2">
        {room.state==='betting'?'🟢 Đặt cược':'🔴 Đang quay'}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(s=>(
          <button key={s} onClick={()=>placeBet(s)}
            disabled={room.state!=='betting'}
            className="border p-3">
            {LABEL[s]} (Tổng {room.totals[s]})
          </button>
        ))}
      </div>

      {room.hostId===playerId && (
        <button onClick={startRoll}
          className="bg-red-600 text-white w-full mt-3 p-2">
          🎲 QUAY
        </button>
      )}

      <div className="mt-3">
        {dice && dice.map((d,i)=><span key={i}>{LABEL[d]} </span>)}
      </div>
    </div>
  )
}
