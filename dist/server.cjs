"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express2 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/routes/routes.ts
var import_express = require("express");

// src/controllers/profissional_controller.ts
var profissionais = /* @__PURE__ */ new Map();
var profissionalIdCounter = 1;
var cadastrarProfissional = (req, res) => {
  const { nome, nascimento, telefone, email, profissao, numero_registro, senha } = req.body;
  if (!nome || !nascimento || !telefone || !email || !profissao || !numero_registro || !senha) {
    res.status(400).json({ error: "Todos os campos s\xE3o obrigat\xF3rios." });
    return;
  }
  if (profissionais.has(email)) {
    res.status(400).json({ error: "Email j\xE1 cadastrado." });
    return;
  }
  const novoProfissional = {
    profissional_id: profissionalIdCounter++,
    // Assign and increment the ID
    nome,
    nascimento,
    telefone,
    email,
    profissao,
    numero_registro,
    senha
    // TODO: Criptografar senha
  };
  profissionais.set(email, novoProfissional);
  res.status(201).json({ message: "Profissional cadastrado com sucesso!", profissional: novoProfissional });
};
var loginProfissional = (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    res.status(400).json({ error: "Email e senha s\xE3o obrigat\xF3rios." });
    return;
  }
  const profissional = profissionais.get(email);
  if (!profissional) {
    res.status(404).json({ error: "Profissional n\xE3o encontrado." });
    return;
  }
  if (profissional.senha !== senha) {
    res.status(401).json({ error: "Senha incorreta." });
    return;
  }
  res.status(200).json({ message: "Login realizado com sucesso!", profissional });
};

// src/controllers/paciente_controller.ts
var pacientes = /* @__PURE__ */ new Map();
var atividades = /* @__PURE__ */ new Map();
var atividadeIdCounter = 1;
var pacienteIdCounter = 1;
var cadastrarPaciente = (req, res) => {
  var _a;
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
  if (!profissional_id || !nome || !data_nascimento || !contato_emergencia || !convenio_medico || !numero_convenio || !hospital_conveniado || !genero) {
    res.status(400).json({ error: "Todos os campos obrigat\xF3rios devem ser preenchidos." });
    return;
  }
  const generosValidos = ["feminino", "masculino", "outro"];
  if (!generosValidos.includes(genero)) {
    res.status(400).json({ error: "G\xEAnero inv\xE1lido. Valores permitidos: feminino, masculino, outro." });
    return;
  }
  const novoPaciente = {
    id: pacienteIdCounter++,
    // Gera um ID simples
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
  if (!pacientes.has(profissional_id)) {
    pacientes.set(profissional_id, []);
  }
  (_a = pacientes.get(profissional_id)) == null ? void 0 : _a.push(novoPaciente);
  res.status(201).json({ message: "Paciente cadastrado com sucesso!", paciente: novoPaciente });
};
var listarPacientesPorProfissional = (req, res) => {
  const { profissional_id } = req.params;
  if (!profissional_id) {
    res.status(400).json({ error: "O profissional_id \xE9 obrigat\xF3rio." });
    return;
  }
  const id = parseInt(profissional_id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "O profissional_id deve ser um n\xFAmero v\xE1lido." });
    return;
  }
  const pacientesDoProfissional = pacientes.get(id);
  if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
    res.status(404).json({ error: "Nenhum paciente encontrado para este profissional." });
    return;
  }
  res.status(200).json({ pacientes: pacientesDoProfissional });
};
var cadastrarAtividade = (req, res) => {
  var _a;
  const { paciente_id, nome, data, horario, concluido } = req.body;
  if (!paciente_id || !data || !horario || !nome || typeof concluido !== "boolean") {
    res.status(400).json({ error: "Todos os campos obrigat\xF3rios devem ser preenchidos." });
    return;
  }
  const pacienteExiste = Array.from(pacientes.values()).some(
    (listaPacientes) => listaPacientes.some((paciente) => paciente.id === paciente_id)
  );
  if (!pacienteExiste) {
    res.status(404).json({ error: "Paciente n\xE3o encontrado." });
    return;
  }
  const novaAtividade = {
    id: atividadeIdCounter++,
    // Gera um ID único para cada atividade
    nome,
    data,
    horario,
    concluido,
    paciente_id
  };
  if (!atividades.has(paciente_id)) {
    atividades.set(paciente_id, []);
  }
  (_a = atividades.get(paciente_id)) == null ? void 0 : _a.push(novaAtividade);
  res.status(201).json({ message: "Atividade cadastrada com sucesso!", atividade: novaAtividade });
};
var listarAtividadesNaoConcluidas = (req, res) => {
  const { profissional_id } = req.params;
  if (!profissional_id) {
    res.status(400).json({ error: "O profissional_id \xE9 obrigat\xF3rio." });
    return;
  }
  const id = parseInt(profissional_id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "O profissional_id deve ser um n\xFAmero v\xE1lido." });
    return;
  }
  const pacientesDoProfissional = pacientes.get(id);
  if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
    res.status(404).json({ error: "Nenhum paciente encontrado para este profissional." });
    return;
  }
  const atividadesNaoConcluidas = pacientesDoProfissional.flatMap((paciente) => {
    const atividadesDoPaciente = atividades.get(paciente.id) || [];
    return atividadesDoPaciente.filter((atividade) => !atividade.concluido).map((atividade) => ({
      atividade_id: atividade.id,
      nome_paciente: paciente.nome,
      nome_atividade: atividade.nome,
      data: atividade.data,
      horario: atividade.horario
    }));
  });
  if (atividadesNaoConcluidas.length === 0) {
    res.status(404).json({ error: "Nenhuma atividade n\xE3o conclu\xEDda encontrada para este profissional." });
    return;
  }
  res.status(200).json({ atividades: atividadesNaoConcluidas });
};
var marcarAtividadeComoConcluida = (req, res) => {
  const { profissional_id, atividade_id } = req.body;
  if (!profissional_id || !atividade_id) {
    res.status(400).json({ error: "O profissional_id e o atividade_id s\xE3o obrigat\xF3rios." });
    return;
  }
  const profissionalId = parseInt(profissional_id, 10);
  const atividadeId = parseInt(atividade_id, 10);
  if (isNaN(profissionalId) || isNaN(atividadeId)) {
    res.status(400).json({ error: "O profissional_id e o atividade_id devem ser n\xFAmeros v\xE1lidos." });
    return;
  }
  const pacientesDoProfissional = pacientes.get(profissionalId);
  if (!pacientesDoProfissional || pacientesDoProfissional.length === 0) {
    res.status(404).json({ error: "Nenhum paciente encontrado para este profissional." });
    return;
  }
  let atividadeEncontrada = null;
  for (const paciente of pacientesDoProfissional) {
    const atividadesDoPaciente = atividades.get(paciente.id) || [];
    atividadeEncontrada = atividadesDoPaciente.find((atividade) => atividade.id === atividadeId);
    if (atividadeEncontrada) break;
  }
  if (!atividadeEncontrada) {
    res.status(404).json({ error: "Atividade n\xE3o encontrada ou n\xE3o pertence a este profissional." });
    return;
  }
  atividadeEncontrada.concluido = true;
  res.status(200).json({ message: "Atividade marcada como conclu\xEDda com sucesso!", atividade: atividadeEncontrada });
};

// src/routes/routes.ts
var router = (0, import_express.Router)();
router.post("/profissional", cadastrarProfissional);
router.post("/login", loginProfissional);
router.post("/paciente", cadastrarPaciente);
router.get("/profissional/:profissional_id/pacientes", listarPacientesPorProfissional);
router.post("/atividade", cadastrarAtividade);
router.get("/profissional/:profissional_id/atividades-nao-concluidas", listarAtividadesNaoConcluidas);
router.patch("/atividade/concluir", marcarAtividadeComoConcluida);
var routes_default = router;

// src/app.ts
function createApp() {
  const app2 = (0, import_express2.default)();
  app2.use((0, import_cors.default)());
  app2.use(import_express2.default.json());
  app2.use("/", routes_default);
  return app2;
}
var app_default = createApp;

// src/server.ts
var app = app_default();
var port = 3333;
app.listen(port, () => {
  console.log(`Tudo certo!
A aplica\xE7\xE3o MediControl  est\xE1 rodando na porta http://localhost:${port}\u26A1`);
});
