import { Server as HttpServer } from 'http';

import { Server, Socket } from 'socket.io';

import { RealtimeSessionHandler } from './RealtimeSessionHandler';

export class WebSocketServer {
    private static io: Server;

    public static init(httpServer: HttpServer): void {
        this.io = new Server(httpServer, {
            // socket.io 설정 (CORS 등)
        });

        this.io.on('connection', (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);
            RealtimeSessionHandler.handleConnection(socket);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                RealtimeSessionHandler.handleDisconnection(socket);
            });
        });
    }

    public static getIO(): Server {
        return this.io;
    }
}
