import { useEffect, useState } from 'react'
import { socket, playerId } from './socket'

/* MOBILE */
import MobileCasinoLayout from './components/MobileCasinoLayout'
/* DESKTOP */
import DesktopCasinoLayout from './components/desktop/DesktopCasinoLayout'

export default function App() {
  const [view, setView] = useState('lobby')
  const [name, setName] = useState(localStorage.getItem('name') || '')
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState(null)

  const [dice, setDice] = useState(null)
  const [rolling, setRolling] = useState(false)

  const [chat, setChat] = useState([])

  const isMobile = window.innerWidth < 768

  /* ================= SOCKET ================= */

  useEffect(() => {
    socket.emit('lobby:getRooms', setRooms)
    socket.on('lobby:update', setRooms)

    socket.on('room:update', r => {
      setRoom(r)
      setView('room')
      setRolling(r.state === 'rolling')
      if (r.state === 'betting') setDice(null)
    })

    socket.on('room:rolled', ({ dice, room }) => {
      setDice(dice)
      setRoom(room)
      setRolling(false)
    })

    socket.on('room:chat', msg => {
      setChat(c => [...c, msg])
    })

    return () => socket.removeAllListeners()
  }, [])

  /* ================= HELPERS ================= */

  function ensureName() {
    if (!name) {
      const n = 'Player' + Math.floor(Math.random() * 9000)
      setName(n)
      localStorage.setItem('name', n)
      return n
    }
    localStorage.setItem('name', name)
    return name
  }

  function joinRoom(id) {
    socket.emit('lobby:joinRoom', {
      roomId: id,
      name: ensureName()
    })
  }

  function createRoom() {
    socket.emit('lobby:createRoom', {
      name: 'Bàn của ' + ensureName()
    })
  }

  function placeBet(slot) {
    if (!room || room.state !== 'betting') return
    socket.emit('room:placeBet', {
      roomId: room.id,
      slot,
      amount: 100
    })
  }

  function startRoll() {
    if (!room) return
    socket.emit('room:startRoll', { roomId: room.id })
  }

  function sendChat(text) {
    if (!room) return
    socket.emit('room:chat', {
      roomId: room.id,
      text
    })
  }

  /* ================= LOBBY ================= */

  if (view === 'lobby') {
    return (
      <div className="min-h-screen bg-neutral-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">🎲 Bầu Cua Cloud</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-2 py-1 text-black rounded"
            placeholder="Tên bạn"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-red-600 px-4 rounded"
          >
            Tạo phòng
          </button>
        </div>

        <div className="space-y-2">
          {rooms.map(r => (
            <div
              key={r.id}
              className="bg-neutral-800 p-3 rounded flex justify-between"
            >
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-400">
                  {r.playerCount} người
                </div>
              </div>
              <button
                onClick={() => joinRoom(r.id)}
                className="bg-blue-600 px-3 rounded"
              >
                Vào
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-neutral-900 text-white">
        Đang tải phòng...
      </div>
    )
  }

  /* ================= ROOM ================= */

  const layoutProps = {
    room,
    dice,
    rolling,
    playerId,
    onBet: placeBet,
    onRoll: startRoll,
    chat,
    onSendChat: sendChat
  }

  return isMobile ? (
    <MobileCasinoLayout {...layoutProps} />
  ) : (
    <DesktopCasinoLayout {...layoutProps} />
  )
}
