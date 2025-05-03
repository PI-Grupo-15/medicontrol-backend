import { Request, Response } from 'express';

// TODO: Deve ser substituido por um banco de dados
// TODO: Mudar os campos da data para usarem um type Date
const pacientes = new Map<number, any[]>(); // Armazena os pacientes em memória, agrupados pelo profissional_id
const atividades = new Map<number, any[]>(); // Armazena as atividades em memória, agrupadas pelo paciente_id
let atividadeIdCounter = 1; // Variável global para gerar IDs únicos para atividades

export const cadastrarPaciente = (req: Request, res: Response) => {
    const {
        profissional_id,
        nome,
        data_nascimento,
        contato_emergencia,
        convenio_medico,
        numero_convenio,
        hospital_conveniado,
        genero,
        alergia,
        observacao
    } = req.body;

    // Validação básica dos campos
    if (
        !profissional_id ||
        !nome ||
        !data_nascimento ||
        !contato_emergencia ||
        !convenio_medico ||
        !numero_convenio ||
        !hospital_conveniado ||
        !genero
    ) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
    }

    // Validação do gênero
    const generosValidos = ['feminino', 'masculino', 'outro'];
    if (!generosValidos.includes(genero)) {
        res.status(400).json({ error: 'Gênero inválido. Valores permitidos: feminino, masculino, outro.' });
        return;
    }

    // Criação do objeto paciente
    const novoPaciente = {
        id: (pacientes.get(profissional_id)?.length ?? 0) + 1, // Gera um ID simples
        nome,
        data_nascimento,
        contato_emergencia,
        convenio_medico,
        numero_convenio,
        hospital_conveniado,
        genero,
        alergia,
        observacao
    };

    // Adiciona o paciente ao mapa, agrupado pelo profissional_id
    if (!pacientes.has(profissional_id)) {
        pacientes.set(profissional_id, []);
    }
    pacientes.get(profissional_id)?.push(novoPaciente);

    res.status(201).json({ message: 'Paciente cadastrado com sucesso!', paciente: novoPaciente });
};

export const listarPacientesPorProfissional = (req: Request, res: Response) => {
    const { profissional_id } = req.params;

    // Validação do profissional_id
    if (!profissional_id) {
        res.status(400).json({ error: 'O profissional_id é obrigatório.' });
        return;
    }

    const id = parseInt(profissional_id, 10);

    if (isNaN(id)) {
        res.status(400).json({ error: 'O profissional_id deve ser um número válido.' });
        return;
    }

    // Busca os pacientes associados ao profissional_id
    const pacientesDoProfissional = pacientes.get(id);

    if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
        res.status(404).json({ error: 'Nenhum paciente encontrado para este profissional.' });
        return;
    }

    res.status(200).json({ pacientes: pacientesDoProfissional });
};

// Endpoints relacionados a atividades
// TODO: Mover para um controller especifico de atividades quando estiver com backend
export const cadastrarAtividade = (req: Request, res: Response) => {
    const { paciente_id, nome, data, horario, concluido } = req.body;

    // Validação básica dos campos
    if (!paciente_id || !data || !horario || !nome || typeof concluido !== 'boolean') {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
    }

    // Verifica se o paciente existe
    const pacienteExiste = Array.from(pacientes.values()).some((listaPacientes) =>
        listaPacientes.some((paciente) => paciente.id === paciente_id)
    );

    if (!pacienteExiste) {
        res.status(404).json({ error: 'Paciente não encontrado.' });
        return;
    }

    // Criação do objeto atividade
    const novaAtividade = {
        id: atividadeIdCounter++, // Gera um ID único para cada atividade
        nome,
        data,
        horario,
        concluido,
        paciente_id,
    };

    // Adiciona a atividade ao mapa, agrupada pelo paciente_id
    if (!atividades.has(paciente_id)) {
        atividades.set(paciente_id, []);
    }
    atividades.get(paciente_id)?.push(novaAtividade);

    res.status(201).json({ message: 'Atividade cadastrada com sucesso!', atividade: novaAtividade });
};

export const listarAtividadesNaoConcluidas = (req: Request, res: Response) => {
    const { profissional_id } = req.params;

    // Validação do profissional_id
    if (!profissional_id) {
        res.status(400).json({ error: 'O profissional_id é obrigatório.' });
        return;
    }

    const id = parseInt(profissional_id, 10);

    if (isNaN(id)) {
        res.status(400).json({ error: 'O profissional_id deve ser um número válido.' });
        return;
    }

    // Busca os pacientes associados ao profissional_id
    const pacientesDoProfissional = pacientes.get(id);

    if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
        res.status(404).json({ error: 'Nenhum paciente encontrado para este profissional.' });
        return;
    }

    // Busca todas as atividades não concluídas dos pacientes
    const atividadesNaoConcluidas = pacientesDoProfissional.flatMap((paciente) => {
        const atividadesDoPaciente = atividades.get(paciente.id) || [];
        return atividadesDoPaciente
            .filter((atividade) => !atividade.concluido) // Filtra atividades não concluídas
            .map((atividade) => ({
                atividade_id: atividade.id,
                nome_paciente: paciente.nome,
                nome_atividade: atividade.nome,
                horario: atividade.horario,
            }));
    });

    if (atividadesNaoConcluidas.length === 0) {
        res.status(404).json({ error: 'Nenhuma atividade não concluída encontrada para este profissional.' });
        return;
    }

    res.status(200).json({ atividades: atividadesNaoConcluidas });
};

export const marcarAtividadeComoConcluida = (req: Request, res: Response) => {
    const { profissional_id, atividade_id } = req.body;

    // Validação dos campos obrigatórios
    if (!profissional_id || !atividade_id) {
        res.status(400).json({ error: 'O profissional_id e o atividade_id são obrigatórios.' });
        return;
    }

    const profissionalId = parseInt(profissional_id, 10);
    const atividadeId = parseInt(atividade_id, 10);

    if (isNaN(profissionalId) || isNaN(atividadeId)) {
        res.status(400).json({ error: 'O profissional_id e o atividade_id devem ser números válidos.' });
        return;
    }

    // Busca os pacientes associados ao profissional_id
    const pacientesDoProfissional = pacientes.get(profissionalId);

    if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
        res.status(404).json({ error: 'Nenhum paciente encontrado para este profissional.' });
        return;
    }

    // Verifica se a atividade pertence a algum paciente do profissional
    let atividadeEncontrada = null;
    for (const paciente of pacientesDoProfissional) {
        const atividadesDoPaciente = atividades.get(paciente.id) || [];
        atividadeEncontrada = atividadesDoPaciente.find((atividade) => atividade.id === atividadeId);
        if (atividadeEncontrada) break;
    }

    if (!atividadeEncontrada) {
        res.status(404).json({ error: 'Atividade não encontrada ou não pertence a este profissional.' });
        return;
    }

    // Marca a atividade como concluída
    atividadeEncontrada.concluido = true;

    res.status(200).json({ message: 'Atividade marcada como concluída com sucesso!', atividade: atividadeEncontrada });
};