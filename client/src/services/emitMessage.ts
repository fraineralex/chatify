/* eslint-disable react-hooks/rules-of-hooks */
import { useSocketStore } from '../store/socket'

export function emitMessage (content: string) {
  const socket = useSocketStore(state => state.socket)

  socket.emit('chat message', content)
}
