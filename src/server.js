import 'dotenv/config'
import createApp from './app.js';

const app = createApp();
const PORT = process.env.PORT || 3333;

app.get('/', (req, res) => {
    res.send("Olá, mundo!");
})

app.listen(PORT, () => {
    console.log(`Tudo certo!😎\nA aplicação MediControl  está rodando na porta http://localhost:${PORT} ⚡`);
});
