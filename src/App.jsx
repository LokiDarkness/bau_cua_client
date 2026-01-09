import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SERVER_URL)

const SLOTS = ['bau','cua','tom','ca','ga','nai']
const LABEL = { bau:'Bầu', cua:'Cua', tom:'Tôm', ca:'Cá', ga:'Gà', nai:'Nai' }

export default function App(){
  const [view, setView] = useState('lobby')
  const [name, setName] = useState(localStorage.getItem('name') || '')
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState(null)

  const [dice, setDice] = useState(null)
  const [rollingDice, setRollingDice] = useState(false)

  // chat
  const [chat, setChat] = useState([])
  const [chatText, setChatText] = useState('')
  const [showChat, setShowChat] = useState(false)

  // chip animation
  const [chips, setChips] = useState([])
  const slotRefs = useRef({})

  useEffect(() => {
    socket.emit('lobby:getRooms', setRooms)
    socket.on('lobby:update', setRooms)

    socket.on('room:update', r => {
      setRoom(r)
      if (r.state === 'rolling') setRollingDice(true)
      if (r.state === 'betting') {
        setRollingDice(false)
        setDice(null)
      }
      setView('room')
    })

    socket.on('room:rolled', ({ dice, room }) => {
      setDice(dice)
      setRoom(room)

      // CHIP THẮNG BAY VỀ HUD
      const me = room.players.find(p => p.id === socket.id)
      if (me){
        const hud = document.getElementById('chipHud')
        if (hud){
          const r = hud.getBoundingClientRect()
          setChips(c => ([
            ...c,
            {
              id: Date.now() + Math.random(),
              x: r.left + r.width/2,
              y: r.top + r.height/2,
              dx: 0,
              dy: -40
            }
          ]))
        }
      }
    })

    socket.on('room:chat', msg => {
      setChat(c => [...c, msg])
    })

    return () => socket.off()
  }, [])

  function ensureName(){
    if (!name){
      const n = 'Player' + Math.floor(Math.random()*9000)
      setName(n)
      localStorage.setItem('name', n)
      return n
    }
    localStorage.setItem('name', name)
    return name
  }

  function myPlayer(){
    return room?.players.find(p => p.id === socket.id)
  }

  // ===== ACTIONS =====
  function createRoom(){
    const n = ensureName()
    socket.emit('lobby:createRoom', { name: 'Bàn của ' + n }, id => {
      socket.emit('lobby:joinRoom', { roomId: id, name: n })
    })
  }

  function joinRoom(id){
    socket.emit('lobby:joinRoom', { roomId: id, name: ensureName() })
  }

  function placeBet(slot){
    if (room.state !== 'betting') return
    if (myPlayer()?.chips <= 0) return alert('Hết chip')

    // CHIP BAY TỪ Ô CƯỢC
    const el = slotRefs.current[slot]
    if (el){
      const r = el.getBoundingClientRect()
      setChips(c => ([
        ...c,
        {
          id: Date.now() + Math.random(),
          x: r.left + r.width/2,
          y: r.top + r.height/2,
          dx: 0,
          dy: 40
        }
      ]))
    }

    socket.emit('room:placeBet', { roomId: room.id, slot, amount: 100 })
  }

  function startRoll(){
    socket.emit('room:startRoll', { roomId: room.id })
  }

  function grantChips(id){
    const amt = parseInt(prompt('Cấp chip', '1000'))
    if (!amt) return
    socket.emit('room:grantChips', { roomId: room.id, targetId:id, amount:amt })
  }

  function sendChat(){
    if (!chatText.trim()) return
    socket.emit('room:chat', { roomId: room.id, text: chatText })
    setChatText('')
  }

  // ===== LOBBY =====
  if (view === 'lobby'){
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">🎲 Bầu Cua Cloud</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Tên bạn"
          />
          <button onClick={createRoom} className="bg-red-600 text-white px-4 rounded">
            Tạo
          </button>
        </div>

        <div className="space-y-2">
          {rooms.map(r => (
            <div key={r.id} className="bg-white p-3 rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-500">{r.playerCount} người</div>
              </div>
              <button
                onClick={()=>joinRoom(r.id)}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Vào
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!room) return null

  // ===== ROOM =====
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* TOP BAR */}
      <div className="bg-red-600 text-white px-4 py-2 flex justify-between items-center">
        <div className="font-bold">{room.name}</div>
        <div id="chipHud">💰 {myPlayer()?.chips ?? 0}</div>
      </div>

      {/* STATUS */}
      <div className="text-center py-2 font-semibold">
        {room.state === 'betting'
          ? '🟢 Đang đặt cược'
          : '🔴 Đang quay'}
      </div>

      {/* DICE */}
      <div className="flex justify-center gap-4 py-2">
        {rollingDice &&
          [1,2,3].map(i => (
            <div
              key={i}
              className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center text-xl font-bold animate-dice"
            >
              ?
            </div>
          ))
        }

        {!rollingDice && dice &&
          dice.map((d,i)=>(
            <div
              key={i}
              className="w-14 h-14 bg-white rounded-xl shadow flex items-center justify-center font-bold"
            >
              {LABEL[d]}
            </div>
          ))
        }
      </div>

      {/* BOARD */}
      <div className="grid grid-cols-3 gap-2 p-2">
        {SLOTS.map(s => (
          <button
            key={s}
            ref={el => slotRefs.current[s] = el}
            onClick={()=>placeBet(s)}
            disabled={room.state !== 'betting'}
            className={`rounded-xl p-3 shadow bg-white active:scale-95 ${
              room.state !== 'betting' && 'opacity-50'
            }`}
          >
            <div className="font-bold">{LABEL[s]}</div>
            <div className="text-xs text-gray-500">
              Tổng: {room.totals[s]}
            </div>
          </button>
        ))}
      </div>

      {/* ROLL */}
      {room.hostId === socket.id && (
        <button
          onClick={startRoll}
          disabled={room.state !== 'betting'}
          className="mx-4 my-2 py-2 bg-red-600 text-white rounded-xl font-bold"
        >
          🎲 QUAY
        </button>
      )}

      {/* PLAYERS */}
      <div className="px-4 text-sm">
        {room.players.map(p => (
          <div key={p.id} className="flex justify-between py-1">
            <span>{p.name} — 💰 {p.chips}</span>
            {room.hostId === socket.id && p.id !== socket.id && (
              <button
                onClick={()=>grantChips(p.id)}
                className="text-blue-600"
              >
                + chip
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={()=>setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-12 h-12 text-xl"
      >
        💬
      </button>

      {/* CHAT POPUP */}
      {showChat && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-3 max-h-[60%] flex flex-col">
          <div className="font-bold mb-2">Chat</div>
          <div className="flex-1 overflow-auto text-sm mb-2">
            {chat.map((m,i)=>(
              <div key={i}><b>{m.from}:</b> {m.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2"
              value={chatText}
              onChange={e=>setChatText(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && sendChat()}
            />
            <button onClick={sendChat} className="bg-blue-600 text-white px-3 rounded">
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* CHIP ANIMATION */}
      {chips.map(c => (
        <div
          key={c.id}
          className="chip"
          style={{
            left: c.x,
            top: c.y,
            '--dx': `${c.dx}px`,
            '--dy': `${c.dy}px`
          }}
          onAnimationEnd={() =>
            setChips(cs => cs.filter(x => x.id !== c.id))
          }
        />
      ))}
    </div>
  )
}
