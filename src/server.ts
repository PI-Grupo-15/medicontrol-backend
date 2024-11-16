import createApp from './app';
import {getUser} from './controllers/users-controller';

const app = createApp();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Tudo certo!😎\nA aplicação MediControl  está rodando na porta http://localhost:${port}⚡`);
});
