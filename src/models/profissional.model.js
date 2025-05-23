import {db} from '../database/connection_database.js'

const create = async ({nome, nascimento, telefone, email, profissao, numero_registro, senha}) => {
    const query = {
        text: `
        INSERT INTO profissionais (nome, nascimento, telefone, email, profissao, numero_registro, senha)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING nome, email, uid
       `,
        values: [nome, nascimento, telefone, email, profissao, numero_registro, senha]
    }

    const { rows } = await db.query(query)
    return rows [0];

}

const findOneByEmail = async (email) => {
    const query = {
        text: `
        SELECT * FROM profissionais
        WHERE EMAIL = $1
        `,
        values: [email]
    }

    const { rows } = await db.query(query)
    return rows [0];
}

const findOneBySenha = async (senha) => {
    const query = {
        text: `
        SELECT * FROM profissionais
        WHERE SENHA = $1
        `,
        values: [senha]
    }

    const { rows } = await db.query(query)
    return rows [0];
}

export const profissionalModel = {
    create,
    findOneByEmail,
    findOneBySenha
}