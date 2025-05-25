import createApp from './app';

const app = createApp();
const port = 3333;

app.listen(port, () => {
    console.log(`Tudo certo!\nA aplicação MediControl  está rodando na porta http://localhost:${port}⚡`);
});
