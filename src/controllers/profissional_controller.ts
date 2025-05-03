import { Request, Response } from 'express';

// TODO: Deve ser substituido por um banco de dados
// TODO: Mudar os campos da data para usarem um type Date
const profissionais = new Map<string, any>(); // Armazena os profissionais em memória, com o email como chave

// TODO: Adicionar criptografia para senhas
export const cadastrarProfissional = (req: Request, res: Response) => {

    const { nome, nascimento, telefone, email, profissao, numero_registro, senha } = req.body;

    // // Validação básica dos campos
    if (!nome || !nascimento || !telefone || !email || !profissao || !numero_registro || !senha) {
       res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
       return;
    }

    // // Verifica se o email já está cadastrado
    if (profissionais.has(email)) {
       res.status(400).json({ error: 'Email já cadastrado.' });
       return;
    }

    // Criação do objeto profissional
    const novoProfissional = {
        nome,
        nascimento,
        telefone,
        email,
        profissao,
        numero_registro,
        senha, // TODO: Criptografar senha
    };

    // Adiciona o profissional ao mapa
    profissionais.set(email, novoProfissional);

    res.status(201).json({ message: 'Profissional cadastrado com sucesso!', profissional: novoProfissional });
};

export const loginProfissional = (req: Request, res: Response) => {
    const { email, senha } = req.body;

    // Validação básica dos campos
    if (!email || !senha) {
        res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        return;
    }

    // Busca o profissional pelo email
    const profissional = profissionais.get(email);

    if (!profissional) {
        res.status(404).json({ error: 'Profissional não encontrado.' });
        return;
    }

    // Verifica se a senha está correta
    if (profissional.senha !== senha) {
        res.status(401).json({ error: 'Senha incorreta.' });
        return;
    }

    res.status(200).json({ message: 'Login realizado com sucesso!', profissional });
};