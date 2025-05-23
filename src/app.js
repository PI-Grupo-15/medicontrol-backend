import express, { Router } from 'express';
import usersRouter from './routes/routes.js';

function createApp() {
    const app = express();

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use('/', usersRouter);

    return app;
}

export default createApp;
