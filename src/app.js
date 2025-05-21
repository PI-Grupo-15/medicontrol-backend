import express from 'express';
import router from './routes/routes.js';

function createApp() {
    const app = express();

    app.use(express.json());

    app.use('/', router);

    return app;
}

export default createApp;
