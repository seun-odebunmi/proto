import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const server = express();
server.use(express.json());
server.use(cors(), helmet());
server.use('/', routes);

export default server;
