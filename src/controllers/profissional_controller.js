import "dotenv/config";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { profissionalModel } from "../models/profissional.model.js";

// TODO: Deve ser substituido por um banco de dados
// TODO: Mudar os campos da data para usarem um type Date
//const profissionais = new Map([]); // Armazena os profissionais em memória, com o email como chave

// TODO: Adicionar criptografia para senhas



export const cadastrarProfissional = async (req, res) => {

    try {       
               
        const { nome, nascimento, telefone, email, profissao, numero_registro, senha } = req.body;

        // Validação básica dos campos
        if (!nome || !nascimento || !telefone || !email || !profissao || !numero_registro || !senha) {
            res.status(400).json({ error: 'Todos os campos são obrigatórios.' });       
            return;            
        } 

        const emailProfissional = await profissionalModel.findOneByEmail(email)
        // Verifica se o email já está cadastrado
        if (emailProfissional) {
            res.status(409).json({ ok: false, msg: 'Email já existe.'});
            return;
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashePassword = await bcryptjs.hash(senha, salt)

        // Criação do objeto profissional
        const novoProfissional = await profissionalModel.create({
            nome,
            nascimento,     
            telefone,
            email,
            profissao,
            numero_registro,
            senha: hashePassword // TODO: Criptografar senha
        });

        const token = jwt.sign({ email: novoProfissional.email},
             process.env.JWT_SECRET,
             {
                expiresIn: "1h"
            });

        return res.status(201).json({ok: true, msg: token});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error Server II'
        })
    }
};

export const loginProfissional = async (req, res) => {

    try {

        const { email, senha } = req.body;

        // Validação básica dos campos
        if (!email || !senha) {
            res.status(400).json({ error: 'Email e senha são obrigatórios.' });
            return;
        }

        
        const emailProfissional = await profissionalModel.findOneByEmail(email);
        // Busca o profissional pelo email
        if (!emailProfissional) {
            res.status(404).json({ error: 'Profissional não encontrado.' });
            return;
        }

        const senhaProfissional = await profissionalModel.findOneBySenha(senha);
        // Verifica se a senha está correta
        if (!senhaProfissional) {
            res.status(401).json({ error: 'Senha incorreta.' });
            return;
        }

        const token = jwt.sign({ email: senhaProfissional.email},
             process.env.JWT_SECRET,
             {
                expiresIn: "1h"
            });

        res.status(200).json({ ok: true,  message: token});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error Server'
        })
    }
};