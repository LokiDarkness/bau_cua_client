import { useEffect, useState, useRef } from 'react'
import { socket, playerId } from '../socket'

export function useGameSocket(){
  const [rooms,setRooms]=useState([])
  const [room,setRoom]=useState(null)
  const [dice,setDice]=useState(null)
  const [rolling,setRolling]=useState(false)
  const [winSlots,setWinSlots]=useState({})
  const [chips,setChips]=useState([])
  const [particles,setParticles]=useState([])
  const slotRefs = useRef({})
  const winSound = useRef(new Audio('/win.mp3'))

  useEffect(()=>{
    socket.emit('lobby:getRooms', setRooms)
    socket.on('lobby:update', setRooms)

    socket.on('room:update', r=>{
      setRoom(r)
      if (r.state==='rolling'){ setRolling(true); setDice(null) }
      if (r.state==='betting'){ setRolling(false) }
    })

    socket.on('room:rolled', ({ dice, room })=>{
      setDice(dice)
      setRoom(room)
      setRolling(false)

      const counts={}
      dice.forEach(d=>counts[d]=(counts[d]||0)+1)
      setWinSlots(counts)

      try{
        winSound.current.currentTime=0
        winSound.current.play()
      }catch{}

      setTimeout(()=>setWinSlots({}),1300)
    })

    return ()=>socket.removeAllListeners()
  },[])

  return {
    rooms, room, dice, rolling,
    winSlots, chips, setChips,
    particles, setParticles,
    slotRefs
  }
}
