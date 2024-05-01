import { Socket } from 'socket.io';

import * as CommentActivityEvent from './events/commentActivity';
import * as ConnectionEvent from './events/connection';
import * as LabelActivityEvent from './events/labelActivity';

export class RealtimeSessionHandler {
    public static handleConnection(socket: Socket): void {
        ConnectionEvent.handleConnection(socket);

        socket.on('labelActivity', data => {
            LabelActivityEvent.handleLabelActivity(socket, data);
        });

        socket.on('commentActivity', data => {
            CommentActivityEvent.handleCommentActivity(socket, data);
        });
    }

    public static handleDisconnection(socket: Socket): void {
        ConnectionEvent.handleDisconnection(socket);
    }
}
