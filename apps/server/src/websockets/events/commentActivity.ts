import { Socket } from 'socket.io';

export function handleCommentActivity(socket: Socket, data: any): void {
    console.log(`Comment activity from ${socket.id}`, data);
    // 여기에서 코멘트 데이터 처리 로직 구현
    // 예: socket.broadcast.emit("commentActivity", data); 다른 사용자에게 브로드캐스트
}
