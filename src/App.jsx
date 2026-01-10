import { useEffect, useState } from 'react'
import { socket, playerId } from './socket'
import MobileCasinoLayout from './components/MobileCasinoLayout'
import DesktopCasinoLayout from './components/desktop/DesktopCasinoLayout'

export default function App(){
  const [view,setView]=useState('lobby')
  const [name,setName]=useState(localStorage.getItem('name')||'')
  const [rooms,setRooms]=useState([])
  const [room,setRoom]=useState(null)
  const [dice,setDice]=useState(null)
  const [rolling,setRolling]=useState(false)
  const [chat,setChat]=useState([])

  const isMobile = window.innerWidth < 768

  useEffect(()=>{
    socket.emit('lobby:getRooms',setRooms)
    socket.on('lobby:update',setRooms)
    socket.on('room:update',r=>{
      setRoom(r); setView('room')
      setRolling(r.state==='rolling')
      if(r.state==='betting') setDice(null)
    })
    socket.on('room:rolled',({dice,room})=>{
      setDice(dice); setRoom(room); setRolling(false)
    })
    socket.on('room:chat',m=>setChat(c=>[...c,m]))
    return ()=>socket.removeAllListeners()
  },[])

  const ensureName=()=>{
    if(!name){ const n='Player'+Math.floor(Math.random()*9000)
      setName(n); localStorage.setItem('name',n); return n }
    localStorage.setItem('name',name); return name
  }

  if(view==='lobby'){
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">🎲 Bầu Cua Cloud</h1>
        <div className="flex gap-2 mb-4">
          <input className="flex-1 px-2 py-1 text-black rounded"
            value={name} onChange={e=>setName(e.target.value)}/>
          <button className="bg-red-600 px-4 rounded"
            onClick={()=>socket.emit('lobby:createRoom',{name:'Bàn của '+ensureName()})}>
            Tạo phòng
          </button>
        </div>
        {rooms.map(r=>(
          <div key={r.id} className="bg-neutral-800 p-3 rounded mb-2 flex justify-between">
            <div><b>{r.name}</b><div className="text-sm text-gray-400">{r.playerCount} người</div></div>
            <button className="bg-blue-600 px-3 rounded"
              onClick={()=>socket.emit('lobby:joinRoom',{roomId:r.id,name:ensureName()})}>
              Vào
            </button>
          </div>
        ))}
      </div>
    )
  }

  const layoutProps={
    room,dice,rolling,playerId,
    onBet:(slot)=>socket.emit('room:placeBet',{roomId:room.id,slot,amount:100}),
    onRoll:()=>socket.emit('room:startRoll',{roomId:room.id}),
    chat,onSendChat:(text)=>socket.emit('room:chat',{roomId:room.id,text})
  }

  return isMobile
    ? <MobileCasinoLayout {...layoutProps}/>
    : <DesktopCasinoLayout {...layoutProps}/>
}
