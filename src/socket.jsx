import { io } from 'socket.io-client'

let playerId = localStorage.getItem('playerId')
if (!playerId){
  playerId = crypto.randomUUID()
  localStorage.setItem('playerId', playerId)
}

export const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ['websocket'],
  auth: { playerId }
})

export { playerId }
