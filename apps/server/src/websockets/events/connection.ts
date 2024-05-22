import { Socket } from 'socket.io';

import { RealtimeSessionHandler } from '../RealtimeSessionHandler';

const sessionHandler = new RealtimeSessionHandler();

export function handleSocketEvents(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
    sessionHandler.addSession(socket);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        sessionHandler.removeSession(socket);
    });

    socket.on('joinRoom', (roomId: string, nickname: string) => {
        console.log(`User ${socket.id} joining room: ${roomId} with nickname: ${nickname}`);
        socket.join(roomId);
        sessionHandler.addSessionToRoom(socket, roomId);
        sessionHandler.setNickname(socket, nickname, roomId);
        socket.to(roomId).emit('nickname', { socketId: socket.id, nickname });
    });

    socket.on('leaveRoom', (roomId: string) => {
        console.log(`User ${socket.id} leaving room: ${roomId}`);
        socket.leave(roomId);
        sessionHandler.removeSessionFromRoom(socket, roomId);
    });

    socket.on(
        'label',
        (
            label: string,
            points: {
                rightBottom: { x: number; y: number };
                leftBottom: { x: number; y: number };
                leftTop: { x: number; y: number };
                rightTop: { x: number; y: number };
            },
            roomId: string
        ) => {
            console.log(`Label received in room ${roomId}:`, label, points);
            socket.to(roomId).emit('label', { label, points });
        }
    );
}
