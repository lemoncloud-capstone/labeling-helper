import { Socket } from 'socket.io';

export class RealtimeSessionHandler {
    private sessions = new Map<string, Socket>();
    private rooms = new Map<string, Set<string>>();
    private nicknames = new Map<string, Map<string, string>>(); // roomId -> (socketId -> nickname)

    addSession(socket: Socket) {
        this.sessions.set(socket.id, socket);
        console.log(`Session added: ${socket.id}`);
        socket.emit('socketId', socket.id);
    }

    removeSession(socket: Socket) {
        this.sessions.delete(socket.id);
        console.log(`Session removed: ${socket.id}`);
    }

    addSessionToRoom(socket: Socket, roomId: string) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)!.add(socket.id);
        console.log(`Session ${socket.id} added to room ${roomId}`);
    }

    removeSessionFromRoom(socket: Socket, roomId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(socket.id);
            console.log(`Session ${socket.id} removed from room ${roomId}`);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }

    setNickname(socket: Socket, nickname: string, roomId: string) {
        if (!this.nicknames.has(roomId)) {
            this.nicknames.set(roomId, new Map());
        }
        this.nicknames.get(roomId)!.set(socket.id, nickname);
        console.log(`Nickname set for socket ${socket.id} in room ${roomId}: ${nickname}`);
    }
}
