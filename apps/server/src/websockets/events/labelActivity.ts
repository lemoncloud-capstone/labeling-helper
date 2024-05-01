import { Socket } from 'socket.io';

export function handleLabelActivity(socket: Socket, data: any): void {
    console.log(`Label activity from ${socket.id}`, data);
    // 여기에서 라벨링 데이터 처리 로직 구현
    // 예: socket.broadcast.emit("labelActivity", data); 다른 사용자에게 브로드캐스트
}
