"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/profissional_controller.ts
var profissional_controller_exports = {};
__export(profissional_controller_exports, {
  cadastrarProfissional: () => cadastrarProfissional,
  loginProfissional: () => loginProfissional
});
module.exports = __toCommonJS(profissional_controller_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cadastrarProfissional,
  loginProfissional
});
