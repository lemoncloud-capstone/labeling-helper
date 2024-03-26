import 'source-map-support/register';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import routers from './routers';

dotenv.config({ path: '.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(routers);

const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;
const HOST = process.env.HOST ?? 'localhost';

app.get('/', (req, res) => {
    res.send({ message: `Hello Le'code, 와신상담` });
});

app.listen(PORT, () => {
    console.log(`Running on port ${HOST}:${PORT}`);
});
