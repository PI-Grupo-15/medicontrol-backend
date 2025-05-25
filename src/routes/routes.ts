import { Router } from 'express';
import { cadastrarProfissional, loginProfissional } from '../controllers/profissional_controller';
import { 
    cadastrarPaciente, 
    listarPacientesPorProfissional, 
    cadastrarAtividade, 
    listarAtividadesNaoConcluidas,
    marcarAtividadeComoConcluida
} from '../controllers/paciente_controller';

const router = Router();

// Cadastrar profissional
router.post("/profissional", cadastrarProfissional);

// Login profissional
router.post("/login", loginProfissional);

// Cadastrar paciente
router.post("/paciente", cadastrarPaciente);

// Listar pacientes por profissional
router.get("/profissional/:profissional_id/pacientes", listarPacientesPorProfissional);

// Cadastrar atividade para paciente
router.post("/atividade", cadastrarAtividade);

// Listar atividades não concluídas por profissional
router.get("/profissional/:profissional_id/atividades-nao-concluidas", listarAtividadesNaoConcluidas);

// Marcar atividade como concluída
router.patch("/atividade/concluir", marcarAtividadeComoConcluida);

export default router;
