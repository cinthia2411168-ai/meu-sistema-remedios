const API_URL = 'http://localhost:3000/api';

// Elementos do DOM
const formMedicamento = document.getElementById('form-medicamento');
const formAgenda = document.getElementById('form-agenda');
const listaMedicamentos = document.getElementById('lista-medicamentos');
const listaAgenda = document.getElementById('lista-agenda');
const selectMedicamento = document.getElementById('agenda-med');

// ==================== REQUISIÇÕES ====================

// Carregar Medicamentos e preencher a lista e o select
async function carregarMedicamentos() {
  try {
    const res = await fetch(`${API_URL}/medicamentos`);
    const medicamentos = await res.json();

    // Limpa os elementos
    listaMedicamentos.innerHTML = '';
    selectMedicamento.innerHTML = '<option value="">Selecione o medicamento</option>';

    medicamentos.forEach(med => {
      // Preenche a lista de estoque
      const li = document.createElement('li');
      li.textContent = `${med.nome} (${med.dosagem || 'Sem dosagem'}) - Qtd: ${med.quantidade}`;
      listaMedicamentos.appendChild(li);

      // Preenche o select do formulário de agenda
      const option = document.createElement('option');
      option.value = med.id;
      option.textContent = `${med.nome} (${med.dosagem || ''})`;
      selectMedicamento.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar medicamentos:', error);
  }
}

// Cadastrar novo medicamento
formMedicamento.addEventListener('submit', async (e) => {
  e.preventDefault();

  const novoMed = {
    nome: document.getElementById('med-nome').value,
    quantidade: parseInt(document.getElementById('med-qtd').value),
    dosagem: document.getElementById('med-dosagem').value
  };

  try {
    const res = await fetch(`${API_URL}/medicamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoMed)
    });

    if (res.ok) {
      formMedicamento.reset();
      carregarMedicamentos();
    }
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
  }
});

// Carregar Lista de Agendamentos
async function carregarAgenda() {
  try {
    const res = await fetch(`${API_URL}/agenda`);
    const agendamentos = await res.json();

    listaAgenda.innerHTML = '';

    agendamentos.forEach(item => {
      const li = document.createElement('li');
      if (item.tomado) li.classList.add('tomado');

      const nomeMed = item.medicamentos ? item.medicamentos.nome : 'Remédio';
      const dosagemMed = item.medicamentos ? item.medicamentos.dosagem : '';

      li.innerHTML = `
        <span>${nomeMed} ${dosagemMed} - Data: ${item.data_agendada} às ${item.horario}</span>
        ${!item.tomado ? `<button class="btn-tomado" onclick="marcarComoTomado('${item.id}')">Marcar Tomado</button>` : '<span>✓ Tomado</span>'}
      `;

      listaAgenda.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar agenda:', error);
  }
}

// Cadastrar novo agendamento
formAgenda.addEventListener('submit', async (e) => {
  e.preventDefault();

  const novoAgendamento = {
    medicamento_id: selectMedicamento.value,
    data_agendada: document.getElementById('agenda-data').value,
    horario: document.getElementById('agenda-horario').value
  };

  try {
    const res = await fetch(`${API_URL}/agenda`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAgendamento)
    });

    if (res.ok) {
      formAgenda.reset();
      carregarAgenda();
    }
  } catch (error) {
    console.error('Erro ao cadastrar agendamento:', error);
  }
});

// Marcar dose como tomada
async function marcarComoTomado(id) {
  try {
    const res = await fetch(`${API_URL}/agenda/${id}/tomar`, {
      method: 'PATCH'
    });

    if (res.ok) {
      carregarAgenda();
    }
  } catch (error) {
    console.error('Erro ao marcar agendamento como tomado:', error);
  }
}

// Inicializar os dados ao carregar a página
carregarMedicamentos();
carregarAgenda();