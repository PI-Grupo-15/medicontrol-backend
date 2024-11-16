import express from 'express';
import {getUser} from './controllers/users-controller';
import router from './routes/routes';

function createApp() {
    const app = express();

    app.use(express.json());

    app.use('/', router);

    return app;
}

export default createApp;
