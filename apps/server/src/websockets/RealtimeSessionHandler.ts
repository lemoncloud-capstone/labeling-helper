import { Socket } from 'socket.io';

export class RealtimeSessionHandler {
    private sessions = new Map<string, Socket>();

    addSession(socket: Socket) {
        this.sessions.set(socket.id, socket);
        console.log(`Session added: ${socket.id}`);
        socket.emit('socketId', socket.id);
    }

    removeSession(socket: Socket) {
        this.sessions.delete(socket.id);
        console.log(`Session removed: ${socket.id}`);
    }

    public broadcastNickname(nickname: string, senderId: string) {
        this.sessions.forEach((socket, sessionId) => {
            // if (sessionId !== senderId) {
            //     socket.emit('nickname', nickname);
            // }
            socket.emit('nickname', nickname);
        });
    }

    getSession(socketId: string) {
        return this.sessions.get(socketId);
    }

    broadcast(message: string) {
        this.sessions.forEach(socket => {
            socket.emit('broadcast', message);
        });
    }
}
