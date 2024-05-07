import { Socket } from 'socket.io';

export class RealtimeSessionHandler {
    private sessions = new Map<string, Socket>();

    addSession(socket: Socket) {
        this.sessions.set(socket.id, socket);
        console.log(`Session added: ${socket.id}`);
    }

    removeSession(socket: Socket) {
        this.sessions.delete(socket.id);
        console.log(`Session removed: ${socket.id}`);
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
