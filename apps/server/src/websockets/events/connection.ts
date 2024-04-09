import { Socket } from 'socket.io';

export function handleConnection(socket: Socket): void {
    // 사용자 연결 로직
    console.log(`A new connection: ${socket.id}`);
}

export function handleDisconnection(socket: Socket): void {
    // 사용자 연결 해제 로직
    console.log(`A disconnection: ${socket.id}`);
}
