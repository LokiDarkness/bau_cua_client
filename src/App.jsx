import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

let playerId = localStorage.getItem('playerId')
if (!playerId){
  playerId = crypto.randomUUID()
  localStorage.setItem('playerId', playerId)
}

const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports:['websocket'],
  auth:{ playerId }
})

const SLOTS=['bau','cua','tom','ca','ga','nai']
const LABEL={ bau:'Bầu',cua:'Cua',tom:'Tôm',ca:'Cá',ga:'Gà',nai:'Nai' }

export default function App(){
  const [view,setView]=useState('lobby')
  const [name,setName]=useState(localStorage.getItem('name')||'')
  const [rooms,setRooms]=useState([])
  const [room,setRoom]=useState(null)
  const [dice,setDice]=useState(null)
  const [rolling,setRolling]=useState(false)

  const [chips,setChips]=useState([])
  const [particles,setParticles]=useState([])
  const [winSlots,setWinSlots]=useState({})
  const [showHistory,setShowHistory]=useState(false)

  const slotRefs = useRef({})
  const winSound = useRef(new Audio('/win.mp3'))

  useEffect(()=>{
    socket.emit('lobby:getRooms',setRooms)
    socket.on('lobby:update',setRooms)

    socket.on('room:update',r=>{
      setRoom(r);setView('room')
      if (r.state==='rolling'){setRolling(true);setDice(null)}
      else setRolling(false)
    })

    socket.on('room:rolled',({dice,room})=>{
      setDice(dice);setRoom(room);setRolling(false)

      const counts={}
      dice.forEach(d=>counts[d]=(counts[d]||0)+1)
      setWinSlots(counts)
      winSound.current.play().catch(()=>{})

      const hud=document.getElementById('chipHud')
      if (!hud) return
      const h=hud.getBoundingClientRect()

      Object.entries(counts).forEach(([s,t])=>{
        const el=slotRefs.current[s]
        if (!el) return
        const r=el.getBoundingClientRect()

        for(let i=0;i<Math.min(6,t*2);i++){
          setChips(c=>[...c,{
            id:Math.random(),
            x:r.left+r.width/2,
            y:r.top+r.height/2,
            dx:h.left-r.left+(Math.random()*20-10),
            dy:h.top-r.top+(Math.random()*20-10)
          }])
        }

        for(let i=0;i<10;i++){
          setParticles(p=>[...p,{
            id:Math.random(),
            x:r.left+r.width/2,
            y:r.top+r.height/2,
            dx:Math.random()*80-40,
            dy:Math.random()*80-40
          }])
        }
      })

      setTimeout(()=>setWinSlots({}),1300)
    })

    return ()=>socket.removeAllListeners()
  },[])

  if (view==='lobby'){
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-3">🎲 Bầu Cua Cloud</h1>
        <input className="border px-2 mr-2" value={name}
          onChange={e=>setName(e.target.value)} />
        <button className="bg-red-600 text-white px-3"
          onClick={()=>socket.emit('lobby:createRoom',{name:'Bàn của '+name})}>
          Tạo phòng
        </button>

        {rooms.map(r=>(
          <div key={r.id} className="border p-2 mt-2 flex justify-between">
            <span>{r.name} ({r.playerCount})</span>
            <button className="bg-blue-600 text-white px-2"
              onClick={()=>socket.emit('lobby:joinRoom',{roomId:r.id,name})}>
              Vào
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (!room) return null
  const me = room.players.find(p=>p.id===playerId)

  return (
    <div className="min-h-screen bg-neutral-100 pt-20 px-3">
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white
                      flex justify-between px-4 py-3 shadow-lg">
        <b>{room.name}</b>
        <span id="chipHud">💰 {me?.chips||0}</span>
      </div>

      <div className="text-center font-bold my-2">
        {room.state==='betting'?'🟢 Đặt cược':'🔴 Đang quay'}
      </div>

      <div className="flex justify-center gap-3 my-2">
        {rolling && [1,2,3].map(i=>(
          <div key={i} className="w-14 h-14 bg-white rounded-xl
            flex items-center justify-center animate-dice">?</div>
        ))}
        {!rolling && dice && dice.map((d,i)=>(
          <div key={i} className="w-14 h-14 bg-white rounded-xl
            flex items-center justify-center font-bold">{LABEL[d]}</div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(s=>(
          <button key={s}
            ref={el=>slotRefs.current[s]=el}
            onClick={()=>socket.emit('room:placeBet',{roomId:room.id,slot:s,amount:100})}
            className={`border p-3 rounded-xl
              ${winSlots[s]>=2?'win-slot-strong':''}
              ${winSlots[s]===1?'win-slot':''}`}>
            {LABEL[s]}<br/>Tổng {room.totals[s]}
          </button>
        ))}
      </div>

      {room.hostId===playerId && (
        <button onClick={()=>socket.emit('room:startRoll',{roomId:room.id})}
          className="fixed bottom-4 left-4 right-4
          bg-red-600 text-white py-4 rounded-2xl text-lg font-bold">
          🎲 QUAY
        </button>
      )}

      {/* CHIP */}
      {chips.map(c=>(
        <div key={c.id} className="chip"
          style={{left:c.x,top:c.y,'--dx':`${c.dx}px`,'--dy':`${c.dy}px`}}
          onAnimationEnd={()=>setChips(cs=>cs.filter(x=>x.id!==c.id))}
        />
      ))}

      {/* PARTICLE */}
      {particles.map(p=>(
        <div key={p.id} className="particle"
          style={{left:p.x,top:p.y,'--dx':`${p.dx}px`,'--dy':`${p.dy}px`}}
          onAnimationEnd={()=>setParticles(ps=>ps.filter(x=>x.id!==p.id))}
        />
      ))}
    </div>
  )
}
