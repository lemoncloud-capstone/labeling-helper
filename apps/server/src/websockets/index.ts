import { Server as HttpServer } from 'http';

import { WebSocketServer } from './WebSocketServer';

export const initWebSocketServer = (server: HttpServer): void => {
    WebSocketServer.init(server);
};
