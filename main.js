// Função para recuperar dados do localStorage ou criar estrutura inicial
function getAppData() {
  let data = localStorage.getItem("faturaSolarData");
  if (!data) {
    data = { 
      user: null, 
      leituras: [], 
      faturas: [], 
      chavePix: "", 
      inquilinos: [],
      leiturasInquilinos: {},
      taxaPadrao: ""
    };
    localStorage.setItem("faturaSolarData", JSON.stringify(data));
  } else {
    data = JSON.parse(data);
    // Garantir que todas as propriedades existam
    if (!data.hasOwnProperty('chavePix')) {
      data.chavePix = "";
    }
    if (!data.hasOwnProperty('inquilinos')) {
      data.inquilinos = [];
    }
    if (!data.hasOwnProperty('leiturasInquilinos')) {
      data.leiturasInquilinos = {};
    }
    if (!data.hasOwnProperty('taxaPadrao')) {
      data.taxaPadrao = "";
    }
    saveAppData(data);
  }
  return data;
}

// Função para salvar dados no localStorage
function saveAppData(data) {
  localStorage.setItem("faturaSolarData", JSON.stringify(data));
}

// Escapa HTML para evitar injeção ao renderizar dados de usuário
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Elemento de conteúdo
const appContent = document.getElementById("app-content");
const mainNav = document.getElementById("main-nav");

// Renderiza a navegação
function renderNav() {
  const data = getAppData();
  if (!data.user) return; // Não mostra navegação se não estiver logado
  
  mainNav.innerHTML = `
    <ul>
      <li><a href="#" id="nav-home"><i class="fas fa-home"></i> Início</a></li>
      <li><a href="#" id="nav-inquilinos"><i class="fas fa-users"></i> Inquilinos</a></li>
      <li><a href="#" id="nav-historico"><i class="fas fa-history"></i> Histórico</a></li>
      <li><a href="#" id="nav-config"><i class="fas fa-cog"></i> Config</a></li>
    </ul>
  `;
  
  // Adicionar event listeners
  document.getElementById("nav-home").addEventListener("click", (e) => {
    e.preventDefault();
    renderHome();
  });
  
  document.getElementById("nav-inquilinos").addEventListener("click", (e) => {
    e.preventDefault();
    renderInquilinosPage();
  });
  
  document.getElementById("nav-historico").addEventListener("click", (e) => {
    e.preventDefault();
    renderHistoricoPage();
  });
  
  document.getElementById("nav-config").addEventListener("click", (e) => {
    e.preventDefault();
    renderConfig();
  });
}

// Renderiza a tela de cadastro/login
function renderCadastro() {
  mainNav.innerHTML = ''; // Remove a navegação
  appContent.innerHTML = `
    <div class="card">
      <h2><i class="fas fa-user-plus"></i> Cadastro</h2>
      <form id="cadastro-form">
        <div class="input-group">
          <label for="nome"><i class="fas fa-user"></i> Seu nome</label>
          <input type="text" id="nome" placeholder="Digite seu nome completo" required>
        </div>
        <div class="input-group">
          <label for="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</label>
          <input type="tel" id="whatsapp" placeholder="Ex: 5511999999999 (com DDD e país)" required>
        </div>
        <div class="input-group">
          <label for="chave-pix"><i class="fas fa-key"></i> Sua Chave Pix</label>
          <input type="text" id="chave-pix" placeholder="CPF, e-mail, telefone ou chave aleatória">
        </div>
        <button type="submit"><i class="fas fa-check-circle"></i> Entrar</button>
      </form>
    </div>
  `;
  
  document.getElementById("cadastro-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const chavePix = document.getElementById("chave-pix").value.trim();
    
    if(nome && whatsapp) {
      let data = getAppData();
      data.user = { nome, whatsapp };
      data.chavePix = chavePix;
      saveAppData(data);
      renderNav();
      renderHome();
    }
  });
}

// Renderiza a tela de configurações
function renderConfig() {
  const data = getAppData();
  const userName = escapeHtml(data.user.nome);
  const userWhatsapp = escapeHtml(data.user.whatsapp);
  const chavePix = escapeHtml(data.chavePix || '');
  const taxaPadrao = escapeHtml(data.taxaPadrao || '');
  appContent.innerHTML = `
    <div class="card">
      <h2><i class="fas fa-cog"></i> Configurações</h2>
      <form id="config-form">
        <div class="input-group">
          <label for="config-nome"><i class="fas fa-user"></i> Seu nome</label>
          <input type="text" id="config-nome" value="${userName}" required>
        </div>
        <div class="input-group">
          <label for="config-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</label>
          <input type="tel" id="config-whatsapp" value="${userWhatsapp}" required>
        </div>
        <div class="input-group">
          <label for="config-chave-pix"><i class="fas fa-key"></i> Sua Chave Pix</label>
          <input type="text" id="config-chave-pix" value="${chavePix}">
        </div>
        <div class="input-group">
          <label for="config-taxa"><i class="fas fa-dollar-sign"></i> Taxa de Energia (R$/kWh)</label>
          <div class="rate-input-group">
            <input type="number" step="0.01" id="config-taxa" value="${taxaPadrao}" placeholder="Ex: 0.89" required>
            <span class="unit">R$/kWh</span>
          </div>
        </div>
        <button type="submit"><i class="fas fa-save"></i> Salvar</button>
      </form>
    </div>
  `;
  
  document.getElementById("config-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("config-nome").value.trim();
    const whatsapp = document.getElementById("config-whatsapp").value.trim();
    const chavePix = document.getElementById("config-chave-pix").value.trim();
    const taxaPadrao = document.getElementById("config-taxa").value.trim();
    
    if(nome && whatsapp && taxaPadrao) {
      let data = getAppData();
      data.user = { nome, whatsapp };
      data.chavePix = chavePix;
      data.taxaPadrao = taxaPadrao;
      saveAppData(data);
      showMessage("Configurações salvas com sucesso!", "success");
      renderHome();
    } else {
      showMessage("Por favor, preencha todos os campos obrigatórios.", "error");
    }
  });
}

// Renderiza a tela principal para inserção de leitura e exibição da fatura
function renderHome() {
  const data = getAppData();
  const userName = escapeHtml(data.user.nome);
  appContent.innerHTML = `
    <!-- Lista de Inquilinos -->
    <div class="card">
      <h2><i class="fas fa-users"></i> Meus Inquilinos</h2>
      <p>Olá, ${userName}! Selecione um inquilino para gerar uma fatura.</p>
      <div id="inquilinos-home-list" class="inquilinos-grid">
        ${data.inquilinos.length === 0 ? 
          '<p class="empty-state"><i class="fas fa-info-circle"></i> Nenhum inquilino cadastrado.</p>' : 
          '<!-- Lista de inquilinos será carregada aqui -->'}
      </div>
      <button id="ver-todos-inquilinos" class="secondary-btn mt-20">
        <i class="fas fa-users"></i> Gerenciar Inquilinos
      </button>
    </div>
    
    <div id="fatura-output"></div>
    
    <!-- Histórico Resumido -->
    <div id="historico">
      <h2><i class="fas fa-history"></i> Últimas Faturas</h2>
      <div id="historico-list"></div>
      <button id="ver-todas" class="secondary-btn"><i class="fas fa-list"></i> Ver Todas</button>
    </div>
  `;

  // Carregar lista de inquilinos na tela inicial
  if (data.inquilinos.length > 0) {
    renderInquilinosHomeList();
  }
  
  document.getElementById("ver-todas").addEventListener("click", () => {
    renderHistoricoPage();
  });
  
  document.getElementById("ver-todos-inquilinos").addEventListener("click", () => {
    renderInquilinosPage();
  });
  
  // Mostrar apenas as 3 últimas faturas na página inicial
  renderHistoricoResumido();
}

// Renderiza a lista de inquilinos na tela inicial
function renderInquilinosHomeList() {
  const data = getAppData();
  const inquilinosList = document.getElementById("inquilinos-home-list");
  inquilinosList.innerHTML = '';
  
  data.inquilinos.forEach((inquilino, index) => {
    const inquilinoNome = escapeHtml(inquilino.nome);
    const inquilinoUnidade = escapeHtml(inquilino.unidade);
    const card = document.createElement("div");
    card.className = "inquilino-home-card";
    card.innerHTML = `
      <div class="inquilino-home-info">
        <h3>${inquilinoNome}</h3>
        <p><i class="fas fa-home"></i> ${inquilinoUnidade}</p>
      </div>
      <button class="primary-btn gerar-fatura-btn" data-index="${index}">
        <i class="fas fa-file-invoice-dollar"></i> Gerar Fatura
      </button>
    `;
    inquilinosList.appendChild(card);
  });
  
  // Adicionar event listeners para os botões de gerar fatura
  document.querySelectorAll(".gerar-fatura-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      gerarFaturaInquilino(index, 'home');
    });
  });
}

// Renderiza um resumo do histórico (últimas 3 faturas)
function renderHistoricoResumido() {
  const data = getAppData();
  const historicoList = document.getElementById("historico-list");
  if (!data.faturas.length) {
    historicoList.innerHTML = "<p class='empty-state'><i class='fas fa-info-circle'></i> Nenhuma fatura gerada.</p>";
    return;
  }
  
  historicoList.innerHTML = "";
  // Pegar apenas as 3 últimas faturas
  const ultimasFaturas = data.faturas.slice(-3).reverse();
  
  ultimasFaturas.forEach((fatura, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <div class="history-date"><i class="far fa-calendar-alt"></i> ${fatura.data.split(',')[0]}</div>
      <div class="history-details">
        <p><strong>Consumo:</strong> ${fatura.consumo} kWh</p>
        <p><strong>Valor:</strong> R$ ${fatura.valor.toFixed(2)}</p>
      </div>
      <button class="action-btn" onclick="reenviarFatura(${data.faturas.length - 3 + index})">
        <i class="fab fa-whatsapp"></i>
      </button>
    `;
    historicoList.appendChild(div);
  });
}

// Renderiza a página completa de histórico
function renderHistoricoPage() {
  const data = getAppData();
  appContent.innerHTML = `
    <div class="card">
      <h2><i class="fas fa-history"></i> Histórico de Faturas</h2>
      <div class="actions-bar">
        <button id="limpar-historico" class="danger-btn">
          <i class="fas fa-trash-alt"></i> Limpar Histórico
        </button>
      </div>
      <div id="historico-completo"></div>
      <button id="voltar-btn" class="secondary-btn mt-20">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
  `;
  
  const historicoCompleto = document.getElementById("historico-completo");
  if (!data.faturas.length) {
    historicoCompleto.innerHTML = "<p class='empty-state'><i class='fas fa-info-circle'></i> Nenhuma fatura gerada.</p>";
  } else {
    historicoCompleto.innerHTML = "";
    // Mostrar faturas em ordem reversa (mais recentes primeiro)
    [...data.faturas].reverse().forEach((fatura, index) => {
      const realIndex = data.faturas.length - 1 - index;
      const div = document.createElement("div");
      div.className = "history-item";
      
      // Informações do inquilino, se existirem
      const inquilinoInfo = fatura.inquilino ? `
        <p><strong>Inquilino:</strong> ${escapeHtml(fatura.inquilino.nome)} (${escapeHtml(fatura.inquilino.unidade)})</p>
      ` : '';
      
      div.innerHTML = `
        <div class="history-date"><i class="far fa-calendar-alt"></i> ${fatura.data}</div>
        <div class="history-details">
          ${inquilinoInfo}
          <p><strong>Leitura Anterior:</strong> ${fatura.leituraAnterior || 0} kWh</p>
          <p><strong>Leitura Atual:</strong> ${fatura.leituraAtual} kWh</p>
          <p><strong>Consumo:</strong> ${fatura.consumo} kWh</p>
          <p><strong>Taxa:</strong> R$ ${fatura.taxa.toFixed(2)}/kWh</p>
          <p><strong>Valor:</strong> R$ ${fatura.valor.toFixed(2)}</p>
        </div>
        <div class="history-actions">
          <button class="action-btn" onclick="reenviarFatura(${realIndex})">
            <i class="fab fa-whatsapp"></i> Enviar
          </button>
          <button class="action-btn" onclick="visualizarFatura(${realIndex})">
            <i class="fas fa-eye"></i> Visualizar
          </button>
        </div>
      `;
      historicoCompleto.appendChild(div);
    });
  }
  
  // Botão para limpar histórico
  // Botão para limpar histórico
  document.getElementById("limpar-historico").addEventListener("click", () => {
    showModal(
      '<i class="fas fa-trash-alt"></i> Limpar Histórico',
      '<p>Tem certeza que deseja limpar todo o histórico de faturas?</p><p>Esta ação não pode ser desfeita.</p>',
      [
        {
          id: 'confirm-clear',
          text: 'Sim, limpar tudo',
          icon: 'fa-trash-alt',
          class: 'danger-btn',
          onClick: () => {
            let data = getAppData();
            data.faturas = [];
            data.leituras = [];
            saveAppData(data);
            renderHistoricoPage();
            showMessage("Histórico de faturas limpo com sucesso!", "success");
          }
        },
        {
          id: 'cancel-clear',
          text: 'Cancelar',
          icon: 'fa-times',
          class: 'secondary-btn'
        }
      ]
    );
  });
  
  document.getElementById("voltar-btn").addEventListener("click", () => {
    renderHome();
  });
}

// Função para mostrar mensagens de feedback
function showMessage(message, type = 'info') {
  // Remover mensagens existentes
  const existingMsg = document.querySelector('.message-toast');
  if (existingMsg) {
    document.body.removeChild(existingMsg);
  }
  
  // Criar nova mensagem
  const msgElement = document.createElement('div');
  msgElement.className = `message-toast ${type}-msg`;
  msgElement.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
    <button class="close-msg"><i class="fas fa-times"></i></button>
  `;
  
  document.body.appendChild(msgElement);
  
  // Fechar mensagem ao clicar no botão
  msgElement.querySelector('.close-msg').addEventListener('click', () => {
    document.body.removeChild(msgElement);
  });
  
  // Fechar automaticamente após 5 segundos
  setTimeout(() => {
    if (document.body.contains(msgElement)) {
      document.body.removeChild(msgElement);
    }
  }, 5000);
}

// Inicializa o app
document.addEventListener("DOMContentLoaded", () => {
  const data = getAppData();
  
  // Adicionar event listeners para links do rodapé
  // Substituir alert no link "sobre"
  document.getElementById("sobre-link").addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      '<i class="fas fa-info-circle"></i> Sobre',
      `<p>Fatura Solar Web - Versão 1.0</p>
       <p>Um aplicativo para controle de faturas de energia solar.</p>`,
      [{
        id: 'close-about-modal',
        text: 'Fechar',
        icon: 'fa-times',
        class: 'primary-btn'
      }]
    );
  });
  
  // Substituir alert no link "contato"
  document.getElementById("contato-link").addEventListener("click", (e) => {
    e.preventDefault();
    showModal(
      '<i class="fas fa-envelope"></i> Contato',
      `<p>Entre em contato pelo e-mail: <a href="mailto:contato@faturasolar.com">contato@faturasolar.com</a></p>`,
      [{
        id: 'close-contact-modal',
        text: 'Fechar',
        icon: 'fa-times',
        class: 'primary-btn'
      }]
    );
  });
  
  if (!data.user) {
    renderCadastro();
  } else {
    renderNav();
    renderHome();
  }
});

// Renderiza a página de inquilinos
function renderInquilinosPage() {
  const data = getAppData();
  appContent.innerHTML = `
    <div class="card">
      <h2><i class="fas fa-users"></i> Meus Inquilinos</h2>
      <p>Gerencie seus inquilinos para controle de faturas.</p>
      
      <button id="add-inquilino-btn" class="action-btn"><i class="fas fa-plus"></i> Adicionar Inquilino</button>
      
      <div id="inquilinos-list" class="mt-20">
        ${data.inquilinos.length === 0 ? 
          '<p class="empty-state"><i class="fas fa-info-circle"></i> Nenhum inquilino cadastrado.</p>' : 
          '<!-- Lista de inquilinos será carregada aqui -->'}
      </div>
    </div>
  `;
  
  // Botão para adicionar novo inquilino
  document.getElementById("add-inquilino-btn").addEventListener("click", () => {
    showInquilinoForm();
  });
  
  // Carregar lista de inquilinos
  if (data.inquilinos.length > 0) {
    renderInquilinosList();
  }
}

// Renderiza a lista de inquilinos
function renderInquilinosList() {
  const data = getAppData();
  const inquilinosList = document.getElementById("inquilinos-list");
  inquilinosList.innerHTML = '';
  
  data.inquilinos.forEach((inquilino, index) => {
    const inquilinoNome = escapeHtml(inquilino.nome);
    const inquilinoUnidade = escapeHtml(inquilino.unidade);
    const inquilinoWhatsapp = escapeHtml(inquilino.whatsapp);
    const inquilinoTaxa = escapeHtml(inquilino.taxa);
    const card = document.createElement("div");
    card.className = "inquilino-card";
    card.innerHTML = `
      <div class="inquilino-info">
        <h3>${inquilinoNome}</h3>
        <p><i class="fas fa-home"></i> ${inquilinoUnidade}</p>
        <p><i class="fab fa-whatsapp"></i> ${inquilinoWhatsapp}</p>
        ${inquilino.taxa ? `<p><i class="fas fa-dollar-sign"></i> Taxa: R$ ${inquilinoTaxa}/kWh</p>` : ''}
      </div>
      <div class="inquilino-actions">
        <button class="icon-btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
        <button class="icon-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        <button class="icon-btn fatura-btn" data-index="${index}"><i class="fas fa-file-invoice-dollar"></i></button>
      </div>
    `;
    inquilinosList.appendChild(card);
  });
  
  // Adicionar event listeners para os botões
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      showInquilinoForm(index);
    });
  });
  
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      deleteInquilino(index);
    });
  });
  
  document.querySelectorAll(".fatura-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      gerarFaturaInquilino(index);
    });
  });
}

// Exibe formulário para adicionar/editar inquilino
function showInquilinoForm(index = null) {
  const data = getAppData();
  const inquilino = index !== null ? data.inquilinos[index] : { 
    nome: '', 
    unidade: '', 
    whatsapp: '',
    taxa: '' // Default empty rate
  };
  
  const modal = document.createElement("div");
  modal.className = "modal";
  const inquilinoNome = escapeHtml(inquilino.nome);
  const inquilinoUnidade = escapeHtml(inquilino.unidade);
  const inquilinoWhatsapp = escapeHtml(inquilino.whatsapp);
  const inquilinoTaxa = escapeHtml(inquilino.taxa);
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${index !== null ? 'Editar' : 'Adicionar'} Inquilino</h2>
        <button class="close-btn"><i class="fas fa-times"></i></button>
      </div>
      <form id="inquilino-form">
        <div class="input-group">
          <label for="inquilino-nome"><i class="fas fa-user"></i> Nome do Inquilino</label>
          <input type="text" id="inquilino-nome" value="${inquilinoNome}" placeholder="Nome completo" required>
        </div>
        <div class="input-group">
          <label for="inquilino-unidade"><i class="fas fa-home"></i> Unidade/Apartamento</label>
          <input type="text" id="inquilino-unidade" value="${inquilinoUnidade}" placeholder="Ex: Apto 101" required>
        </div>
        <div class="input-group">
          <label for="inquilino-whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</label>
          <input type="tel" id="inquilino-whatsapp" value="${inquilinoWhatsapp}" placeholder="Ex: 5511999999999" required>
        </div>
        <div class="input-group">
          <label for="inquilino-taxa"><i class="fas fa-dollar-sign"></i> Taxa de Energia (R$/kWh)</label>
          <div class="rate-input-group">
            <input type="number" step="0.01" id="inquilino-taxa" value="${inquilinoTaxa}" placeholder="Ex: 0.89">
            <span class="unit">R$/kWh</span>
          </div>
        </div>
        <button type="submit" class="primary-btn">
          <i class="fas fa-save"></i> ${index !== null ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fechar modal
  modal.querySelector(".close-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
  
  // Salvar inquilino
  document.getElementById("inquilino-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("inquilino-nome").value.trim();
    const unidade = document.getElementById("inquilino-unidade").value.trim();
    const whatsapp = document.getElementById("inquilino-whatsapp").value.trim();
    const taxa = document.getElementById("inquilino-taxa").value.trim();
    
    if (nome && unidade && whatsapp) {
      let data = getAppData();
      
      if (index !== null) {
        // Atualizar inquilino existente
        data.inquilinos[index] = { nome, unidade, whatsapp, taxa };
      } else {
        // Adicionar novo inquilino
        data.inquilinos.push({ nome, unidade, whatsapp, taxa });
      }
      
      saveAppData(data);
      document.body.removeChild(modal);
      renderInquilinosPage();
      
      // Mostrar mensagem de sucesso
      showMessage(
        `Inquilino ${index !== null ? 'atualizado' : 'cadastrado'} com sucesso!`, 
        'success'
      );
    }
  });
}

// Excluir inquilino
function deleteInquilino(index) {
  const data = getAppData();
  const inquilino = data.inquilinos[index];
  const inquilinoNome = escapeHtml(inquilino.nome);
  
  showModal(
    '<i class="fas fa-trash"></i> Excluir Inquilino',
    `<p>Tem certeza que deseja excluir o inquilino <strong>${inquilinoNome}</strong>?</p>
     <p>Esta ação não pode ser desfeita.</p>`,
    [
      {
        id: 'confirm-delete',
        text: 'Sim, excluir',
        icon: 'fa-trash',
        class: 'danger-btn',
        onClick: () => {
          data.inquilinos.splice(index, 1);
          saveAppData(data);
          renderInquilinosPage();
          showMessage('Inquilino excluído com sucesso!', 'success');
        }
      },
      {
        id: 'cancel-delete',
        text: 'Cancelar',
        icon: 'fa-times',
        class: 'secondary-btn'
      }
    ]
  );
}

// Gerar fatura para inquilino específico
function gerarFaturaInquilino(index, origem = 'inquilinos') {
  const data = getAppData();
  const inquilino = data.inquilinos[index];
  const inquilinoNome = escapeHtml(inquilino.nome);
  const inquilinoUnidade = escapeHtml(inquilino.unidade);
  const taxaExibida = escapeHtml(inquilino.taxa || data.taxaPadrao || 'Não configurada');
  
  appContent.innerHTML = `
    <div class="card">
      <h2><i class="fas fa-file-invoice-dollar"></i> Gerar Fatura para Inquilino</h2>
      <p><strong>Inquilino:</strong> ${inquilinoNome} (${inquilinoUnidade})</p>
      
      <form id="fatura-inquilino-form">
        <div class="input-group">
          <label for="leitura-atual"><i class="fas fa-plug"></i> Leitura atual (kWh)</label>
          <input type="number" id="leitura-atual" placeholder="Digite o valor do medidor" required>
        </div>
        <p class="taxa-info"><i class="fas fa-info-circle"></i> Taxa atual: R$ ${taxaExibida}/kWh</p>
        <button type="submit"><i class="fas fa-file-invoice-dollar"></i> Gerar Fatura</button>
      </form>
      
      <button id="voltar-inquilinos" class="secondary-btn mt-20">
        <i class="fas fa-arrow-left"></i> Voltar
      </button>
    </div>
    <div id="fatura-output"></div>
  `;
  
  document.getElementById("fatura-inquilino-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const leituraAtual = parseFloat(document.getElementById("leitura-atual").value);
    
    // Usar a taxa do inquilino se disponível, senão usar a taxa padrão
    let taxa;
    if (inquilino.taxa) {
      taxa = parseFloat(inquilino.taxa);
    } else if (data.taxaPadrao) {
      taxa = parseFloat(data.taxaPadrao);
    } else {
      showMessage("Por favor, configure uma taxa para este inquilino ou defina uma taxa padrão nas configurações.", "error");
      return;
    }
    
    // Gerar fatura com dados do inquilino
    gerarFatura(leituraAtual, taxa, inquilino);
  });
  
  document.getElementById("voltar-inquilinos").addEventListener("click", () => {
    if (origem === 'home') {
      renderHome();
    } else {
      renderInquilinosPage();
    }
  });
}

// Função para visualizar uma fatura específica
function visualizarFatura(index) {
  const data = getAppData();
  const fatura = data.faturas[index];
  
  // Primeiro, vamos garantir que estamos na página inicial ou criar um elemento para a fatura
  if (!document.getElementById("fatura-output")) {
    // Se não estamos na página inicial, vamos criar um container para a fatura
    appContent.innerHTML = `
      <div class="card">
        <h2><i class="fas fa-file-invoice-dollar"></i> Visualização de Fatura</h2>
        <button id="voltar-historico" class="secondary-btn">
          <i class="fas fa-arrow-left"></i> Voltar para Histórico
        </button>
      </div>
      <div id="fatura-output"></div>
    `;
    
    // Adicionar event listener para o botão voltar
    document.getElementById("voltar-historico").addEventListener("click", () => {
      renderHistoricoPage();
    });
  }
  
  // Agora podemos renderizar a fatura
  renderFatura(fatura);
  
  // Scroll para a fatura
  document.getElementById("fatura-output").scrollIntoView({ behavior: 'smooth' });
}

// Função para reenviar fatura do histórico via WhatsApp
function reenviarFatura(index) {
  const data = getAppData();
  const fatura = data.faturas[index];
  
  // Se a fatura tem inquilino, usar o WhatsApp dele, senão usar o do usuário
  const telefone = fatura.inquilino ? fatura.inquilino.whatsapp : data.user.whatsapp;
  enviarFaturaWhatsApp(fatura, telefone);
}

// Função para gerar a fatura
function gerarFatura(leituraAtual, taxa, inquilino = null) {
  let data = getAppData();
  const agora = new Date().toLocaleString("pt-BR");
  let consumo = 0;
  let leituraAnterior = 0;

  // Se for para um inquilino específico, verificar leituras anteriores desse inquilino
  if (inquilino) {
    // Inicializar o array de leituras do inquilino se não existir
    if (!data.leiturasInquilinos) {
      data.leiturasInquilinos = {};
    }
    
    // Inicializar o array para este inquilino específico se não existir
    const inquilinoId = `${inquilino.nome}-${inquilino.unidade}`.replace(/\s+/g, '_');
    if (!data.leiturasInquilinos[inquilinoId]) {
      data.leiturasInquilinos[inquilinoId] = [];
    }
    
    // Verificar leitura anterior deste inquilino
    const leiturasInquilino = data.leiturasInquilinos[inquilinoId];
    if (leiturasInquilino.length > 0) {
      leituraAnterior = leiturasInquilino[leiturasInquilino.length - 1].valor;
      consumo = leituraAtual - leituraAnterior;
      
      // Dentro da função gerarFatura, substituir os alerts
      // Para o caso de inquilino específico
      if(consumo < 0) {
        showModal(
          '<i class="fas fa-exclamation-triangle"></i> Erro na Leitura',
          '<p>A nova leitura deve ser maior que a anterior!</p>',
          [{
            id: 'close-error-modal',
            text: 'Entendi',
            icon: 'fa-check',
            class: 'primary-btn'
          }]
        );
        return;
      }
      
      // E também para o caso de leitura geral
      if(consumo < 0) {
        showModal(
          '<i class="fas fa-exclamation-triangle"></i> Erro na Leitura',
          '<p>A nova leitura deve ser maior que a anterior!</p>',
          [{
            id: 'close-error-modal',
            text: 'Entendi',
            icon: 'fa-check',
            class: 'primary-btn'
          }]
        );
        return;
      }
    } else {
      // Primeira leitura deste inquilino
      consumo = leituraAtual;
    }
    
    // Salvar a nova leitura para este inquilino
    data.leiturasInquilinos[inquilinoId].push({ data: agora, valor: leituraAtual });
  } else {
    // Leitura geral (não específica para inquilino)
    if (data.leituras.length > 0) {
      leituraAnterior = data.leituras[data.leituras.length - 1].valor;
      consumo = leituraAtual - leituraAnterior;
      
      if(consumo < 0) {
        alert("A nova leitura deve ser maior que a anterior!");
        return;
      }
    } else {
      // Primeira leitura geral
      consumo = leituraAtual;
    }
    
    // Salvar a nova leitura geral
    data.leituras.push({ data: agora, valor: leituraAtual });
  }

  const valorTotal = consumo * taxa;

  // Cria objeto fatura e salva no histórico
  const fatura = {
    data: agora,
    leituraAnterior: leituraAnterior,
    leituraAtual,
    consumo,
    taxa,
    valor: valorTotal,
    inquilino: inquilino ? {
      nome: inquilino.nome,
      unidade: inquilino.unidade,
      whatsapp: inquilino.whatsapp
    } : null
  };

  data.faturas.push(fatura);
  saveAppData(data);

  renderFatura(fatura);
  
  // Se estiver na página inicial, atualizar o histórico resumido
  if (document.getElementById("historico-list")) {
    renderHistoricoResumido();
  }
}

// Renderiza a fatura na tela
function renderFatura(fatura) {
  const data = getAppData();
  const faturaOutput = document.getElementById("fatura-output");
  
  // Informações do inquilino, se existirem
  const inquilinoInfo = fatura.inquilino ? `
    <div class="inquilino-fatura-info">
      <h3><i class="fas fa-user"></i> Dados do Inquilino</h3>
      <p><strong>Nome:</strong> ${escapeHtml(fatura.inquilino.nome)}</p>
      <p><strong>Unidade:</strong> ${escapeHtml(fatura.inquilino.unidade)}</p>
    </div>
  ` : '';
  
  faturaOutput.innerHTML = `
    <div class="card fatura-card">
      <h2><i class="fas fa-file-invoice-dollar"></i> Fatura Gerada</h2>
      ${inquilinoInfo}
      <div class="fatura-info">
        <p><i class="far fa-calendar-alt"></i> <strong>Data:</strong> ${fatura.data}</p>
        <p><i class="fas fa-tachometer-alt"></i> <strong>Leitura Anterior:</strong> ${fatura.leituraAnterior} kWh</p>
        <p><i class="fas fa-tachometer-alt"></i> <strong>Leitura Atual:</strong> ${fatura.leituraAtual} kWh</p>
        <p><i class="fas fa-bolt"></i> <strong>Consumo:</strong> ${fatura.consumo} kWh</p>
        <p><i class="fas fa-dollar-sign"></i> <strong>Taxa:</strong> R$ ${fatura.taxa.toFixed(2)} /kWh</p>
        <p class="valor-total"><i class="fas fa-money-bill-wave"></i> <strong>Valor Total:</strong> R$ ${fatura.valor.toFixed(2)}</p>
      </div>
      <div id="qrcode" class="qrcode-container"></div>
      <div class="fatura-actions">
        <button class="copy-btn" id="copy-btn"><i class="fas fa-copy"></i> Copiar Código Pix</button>
        <button id="whatsapp-btn"><i class="fab fa-whatsapp"></i> Enviar via WhatsApp</button>
      </div>
    </div>
  `;

  // Gera QR Code com a chave Pix do usuário
  const chavePix = data.chavePix || "Chave Pix não configurada";
  new QRCode(document.getElementById("qrcode"), {
    text: chavePix,
    width: 150,
    height: 150,
  });

  // Copiar código Pix
  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(chavePix);
    showMessage("Código Pix copiado!", "success");
  });

  // Enviar via WhatsApp
  document.getElementById("whatsapp-btn").addEventListener("click", () => {
    // Se a fatura tem inquilino, usar o WhatsApp dele, senão usar o do usuário
    const telefone = fatura.inquilino ? fatura.inquilino.whatsapp : data.user.whatsapp;
    enviarFaturaWhatsApp(fatura, telefone);
  });
  
  // Scroll para a fatura
  faturaOutput.scrollIntoView({ behavior: 'smooth' });
}

// Função para enviar fatura via WhatsApp
function enviarFaturaWhatsApp(fatura, telefone) {
  const data = getAppData();
  const chavePix = data.chavePix || "Chave Pix não configurada";
  
  // Adicionar informações do inquilino na mensagem, se existirem
  const inquilinoInfo = fatura.inquilino ? 
    `*Inquilino:* ${fatura.inquilino.nome}\n*Unidade:* ${fatura.inquilino.unidade}\n` : '';
  
  const mensagem = encodeURIComponent(
    `*Fatura de Energia Solar*\n\n` +
    `${inquilinoInfo}` +
    `*Data:* ${fatura.data}\n` +
    `*Consumo:* ${fatura.consumo} kWh\n` +
    `*Valor:* R$ ${fatura.valor.toFixed(2)}\n` +
    `*Chave Pix:* ${chavePix}`
  );
  
  // Abre o WhatsApp com a mensagem pré-preenchida
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");
}

// Função para criar e exibir um modal interativo
function showModal(title, content, buttons = []) {
  // Remover modal existente se houver
  const existingModal = document.querySelector('.modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  const modal = document.createElement("div");
  modal.className = "modal";
  
  let buttonsHTML = '';
  if (buttons.length > 0) {
    buttonsHTML = `
      <div class="modal-footer">
        ${buttons.map((btn, index) => `
          <button class="${btn.class || 'secondary-btn'}" id="modal-btn-${index}" data-action="${btn.id}">
            ${btn.icon ? `<i class="fas fa-${btn.icon}"></i> ` : ''}${btn.text}
          </button>
        `).join('')}
      </div>
    `;
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="close-btn" id="modal-close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${buttonsHTML}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fechar modal ao clicar no X
  const closeBtn = document.getElementById("modal-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  }
  
  // Fechar modal ao clicar fora do conteúdo
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Adicionar event listeners para os botões
  buttons.forEach((btn, index) => {
    const buttonElement = document.getElementById(`modal-btn-${index}`);
    if (buttonElement) {
      buttonElement.addEventListener("click", () => {
        if (btn.onClick) {
          btn.onClick();
        }
        // Sempre fechar o modal ao clicar em qualquer botão, a menos que especificado o contrário
        if (btn.closeOnClick !== false) {
          document.body.removeChild(modal);
        }
      });
    }
  });
  
  return modal;
}
  
