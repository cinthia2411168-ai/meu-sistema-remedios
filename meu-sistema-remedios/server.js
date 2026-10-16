const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================== ROTAS DE ESTOQUE (MEDICAMENTOS) ====================

// Listar todos os medicamentos
app.get('/api/medicamentos', async (req, res) => {
  const { data, error } = await supabase.from('medicamentos').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Cadastrar novo medicamento
app.post('/api/medicamentos', async (req, res) => {
  const { nome, quantidade, dosagem } = req.body;
  const { data, error } = await supabase
    .from('medicamentos')
    .insert([{ nome, quantidade, dosagem }])
    .select();
  
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar estoque
app.patch('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;
  const { data, error } = await supabase
    .from('medicamentos')
    .update({ quantidade })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// ==================== ROTAS DE AGENDA ====================

// Listar agendamentos
app.get('/api/agenda', async (req, res) => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*, medicamentos(nome, dosagem)');
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Criar novo agendamento
app.post('/api/agenda', async (req, res) => {
  const { medicamento_id, horario, data_agendada } = req.body;
  const { data, error } = await supabase
    .from('agenda')
    .insert([{ medicamento_id, horario, data_agendada }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Marcar remédio como tomado
app.patch('/api/agenda/:id/tomar', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('agenda')
    .update({ tomado: true })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});