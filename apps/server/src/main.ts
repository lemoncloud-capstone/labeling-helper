import 'source-map-support/register';

import { createServer } from 'http';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';

import routers from './routers';
import { handleConnection, labelActivity } from './websockets/events/connection';

dotenv.config();

const app = express();
const httpServer = createServer(app); // HTTP 서버 생성
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: ['http://sandbox.lemoncloud.io', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'OPTIONS'],
    },
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(routers);

// socket.io
io.on('connection', socket => {
    console.log('New socket connected:', socket.id);
    handleConnection(socket); // 기본 연결 처리
    labelActivity(socket); // 라벨 이벤트 처리
});

const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;
const HOST = process.env.HOST ?? 'localhost';

// 기본 HTTP
app.get('/', (req, res) => {
    res.send({ message: `Hello Le'code, 와신상담` });
});

// httpServer를 사용하여 서버 시작
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${HOST}:${PORT}`);
});
