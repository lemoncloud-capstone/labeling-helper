import { Socket } from 'socket.io';

import { RealtimeSessionHandler } from '../RealtimeSessionHandler';

const sessionHandler = new RealtimeSessionHandler();

export function handleConnection(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
    sessionHandler.addSession(socket);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        sessionHandler.removeSession(socket);
    });
}

export function handleNickname(socket: Socket) {
    socket.on('nickname', (nickname: string) => {
        console.log(`Nickname received: ${nickname}`);
        sessionHandler.broadcastNickname(nickname, socket.id);
    });
}

export function labelActivity(socket: Socket) {
    socket.on('label', data => {
        console.log(`Label received: ${data}`);
        socket.broadcast.emit('label', data);
    });
}
