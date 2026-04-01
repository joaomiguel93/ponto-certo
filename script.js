// ============================================================
// © 2026 PontoCerto DP — João Miguel E Ferreira
// Desenvolvido com auxílio de inteligência artificial (Claude/Anthropic)
// https://github.com/joaomiguel93/dp-ponto-certo
// ============================================================

// Estado da sessão (perdido ao fechar o navegador — versão gratuita)
let state = {
  feriados: [
    { data:'2025-01-01', desc:'Confraternização Universal', tipo:'nacional' },
    { data:'2025-03-04', desc:'Carnaval',                   tipo:'nacional' },
    { data:'2025-04-18', desc:'Sexta-feira Santa',          tipo:'nacional' },
    { data:'2025-04-21', desc:'Tiradentes',                 tipo:'nacional' },
    { data:'2025-05-01', desc:'Dia do Trabalhador',         tipo:'nacional' },
    { data:'2025-06-19', desc:'Corpus Christi',             tipo:'nacional' },
    { data:'2025-09-07', desc:'Independência do Brasil',    tipo:'nacional' },
    { data:'2025-10-12', desc:'Nossa Sra. Aparecida',       tipo:'nacional' },
    { data:'2025-11-02', desc:'Finados',                    tipo:'nacional' },
    { data:'2025-11-15', desc:'Proclamação da República',   tipo:'nacional' },
    { data:'2025-11-20', desc:'Consciência Negra',          tipo:'nacional' },
    { data:'2025-12-25', desc:'Natal',                      tipo:'nacional' },
    { data:'2026-01-01', desc:'Confraternização Universal', tipo:'nacional' },
    { data:'2026-02-17', desc:'Carnaval',                   tipo:'nacional' },
    { data:'2026-04-03', desc:'Sexta-feira Santa',          tipo:'nacional' },
    { data:'2026-04-21', desc:'Tiradentes',                 tipo:'nacional' },
    { data:'2026-05-01', desc:'Dia do Trabalhador',         tipo:'nacional' },
    { data:'2026-09-07', desc:'Independência do Brasil',    tipo:'nacional' },
    { data:'2026-10-12', desc:'Nossa Sra. Aparecida',       tipo:'nacional' },
    { data:'2026-11-02', desc:'Finados',                    tipo:'nacional' },
    { data:'2026-11-15', desc:'Proclamação da República',   tipo:'nacional' },
    { data:'2026-11-20', desc:'Consciência Negra',          tipo:'nacional' },
    { data:'2026-12-25', desc:'Natal',                      tipo:'nacional' },
    // 2027 — datas fixas (Carnaval/Corpus Christi/Sexta Santa calculados manualmente)
    { data:'2027-01-01', desc:'Confraternização Universal', tipo:'nacional' },
    { data:'2027-02-09', desc:'Carnaval',                   tipo:'nacional' },
    { data:'2027-03-26', desc:'Sexta-feira Santa',          tipo:'nacional' },
    { data:'2027-04-21', desc:'Tiradentes',                 tipo:'nacional' },
    { data:'2027-05-01', desc:'Dia do Trabalhador',         tipo:'nacional' },
    { data:'2027-06-03', desc:'Corpus Christi',             tipo:'nacional' },
    { data:'2027-09-07', desc:'Independência do Brasil',    tipo:'nacional' },
    { data:'2027-10-12', desc:'Nossa Sra. Aparecida',       tipo:'nacional' },
    { data:'2027-11-02', desc:'Finados',                    tipo:'nacional' },
    { data:'2027-11-15', desc:'Proclamação da República',   tipo:'nacional' },
    { data:'2027-11-20', desc:'Consciência Negra',          tipo:'nacional' },
    { data:'2027-12-25', desc:'Natal',                      tipo:'nacional' },
    // 2028
    { data:'2028-01-01', desc:'Confraternização Universal', tipo:'nacional' },
    { data:'2028-02-29', desc:'Carnaval',                   tipo:'nacional' },
    { data:'2028-03-01', desc:'Quarta-feira de Cinzas',     tipo:'nacional' },
    { data:'2028-04-14', desc:'Sexta-feira Santa',          tipo:'nacional' },
    { data:'2028-04-21', desc:'Tiradentes',                 tipo:'nacional' },
    { data:'2028-05-01', desc:'Dia do Trabalhador',         tipo:'nacional' },
    { data:'2028-06-15', desc:'Corpus Christi',             tipo:'nacional' },
    { data:'2028-09-07', desc:'Independência do Brasil',    tipo:'nacional' },
    { data:'2028-10-12', desc:'Nossa Sra. Aparecida',       tipo:'nacional' },
    { data:'2028-11-02', desc:'Finados',                    tipo:'nacional' },
    { data:'2028-11-15', desc:'Proclamação da República',   tipo:'nacional' },
    { data:'2028-11-20', desc:'Consciência Negra',          tipo:'nacional' },
    { data:'2028-12-25', desc:'Natal',                      tipo:'nacional' },
  ],
  registros: {},        // ponto digitado: chave "mes_ano"
  tema: 'dark',
  sidebarCollapsed: false,
  funcionarios: {},     // { id: { nome, empresa, cargo, registros } }
  funcAtivo: null,      // id do funcionário selecionado
};

const DIAS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// =====================================================
// LOCALSTORAGE — PERSISTÊNCIA
// =====================================================
const LS_KEY = 'pontocerto_v5';

function salvarLS() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      funcionarios: state.funcionarios,
      funcAtivo:    state.funcAtivo,
      feriados:     state.feriados,
    }));
    mostrarSalvo();
  } catch(e) { console.warn('localStorage indisponível', e); }
}

function carregarLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.funcionarios) state.funcionarios = d.funcionarios;
    if (d.funcAtivo !== undefined) state.funcAtivo = d.funcAtivo;
    if (d.feriados && d.feriados.length) state.feriados = d.feriados;
  } catch(e) { console.warn('Erro ao carregar localStorage', e); }
}

let _saveTimer = null;
function agendarSalvo() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(salvarLS, 600);
}

function mostrarSalvo() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

// =====================================================
// FUNCIONÁRIOS
// =====================================================

/** Retorna o objeto do funcionário ativo, criando se não existir */
function getFuncAtivo() {
  if (state.funcAtivo === null || !state.funcionarios[state.funcAtivo]) return null;
  return state.funcionarios[state.funcAtivo];
}

/** Lê os campos do formulário e grava no funcionário ativo */
function syncFormParaFunc() {
  const f = getFuncAtivo();
  if (!f) return;
  f.nome    = document.getElementById('nomeFuncionario').value;
  f.empresa = document.getElementById('nomeEmpresa').value;
  f.cargo   = document.getElementById('nomeCargo').value;
  f.registros = state.registros;
}

/** Carrega dados do funcionário ativo nos campos do formulário */
function syncFuncParaForm() {
  const f = getFuncAtivo();
  if (!f) return;
  document.getElementById('nomeFuncionario').value = f.nome    || '';
  document.getElementById('nomeEmpresa').value     = f.empresa || '';
  document.getElementById('nomeCargo').value       = f.cargo   || '';
  state.registros = f.registros || {};
  document.getElementById('lblFuncAtivo').textContent = f.nome || 'Sem nome';
}

function abrirModalFuncionarios() {
  renderFuncList();
  document.getElementById('modalFuncionarios').classList.add('open');
}

function renderFuncList() {
  const list = document.getElementById('funcList');
  const ids  = Object.keys(state.funcionarios);
  if (!ids.length) {
    list.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px 0">Nenhum funcionário salvo ainda.</div>';
    return;
  }
  list.innerHTML = ids.map(id => {
    const f = state.funcionarios[id];
    const ativo = id === state.funcAtivo ? ' active' : '';
    return `<div class="func-item${ativo}" onclick="selecionarFuncionario('${id}')">
      <div class="func-item-info">
        <div class="func-item-name">${f.nome || '(sem nome)'}</div>
        <div class="func-item-sub">${f.empresa || '—'} ${f.cargo ? '· '+f.cargo : ''}</div>
      </div>
      <button class="func-item-del" onclick="excluirFuncionario(event,'${id}')" title="Excluir">🗑</button>
    </div>`;
  }).join('');
}

function selecionarFuncionario(id) {
  // Salva estado atual antes de trocar
  syncFormParaFunc();
  state.funcAtivo = id;
  syncFuncParaForm();
  closeModal('modalFuncionarios');
  agendarSalvo();
  // Regera tabela se já estava aberta
  if (document.getElementById('tabelaContainer').style.display !== 'none') gerarTabela();
}

function criarFuncionario() {
  const nome = document.getElementById('novoFuncNome').value.trim();
  const emp  = document.getElementById('novoFuncEmp').value.trim();
  if (!nome) { document.getElementById('novoFuncNome').focus(); return; }
  // Salva estado atual
  syncFormParaFunc();
  const id = 'f_' + Date.now();
  state.funcionarios[id] = { nome, empresa: emp, cargo: '', registros: {} };
  state.funcAtivo = id;
  syncFuncParaForm();
  document.getElementById('novoFuncNome').value = '';
  document.getElementById('novoFuncEmp').value  = '';
  renderFuncList();
  closeModal('modalFuncionarios');
  agendarSalvo();
}

function excluirFuncionario(e, id) {
  e.stopPropagation();
  const f = state.funcionarios[id];
  if (!confirm(`Excluir funcionário "${f?.nome || id}"?\nTodos os registros serão perdidos.`)) return;
  delete state.funcionarios[id];
  if (state.funcAtivo === id) {
    const resto = Object.keys(state.funcionarios);
    state.funcAtivo = resto.length ? resto[0] : null;
    if (state.funcAtivo) syncFuncParaForm();
    else {
      state.registros = {};
      document.getElementById('lblFuncAtivo').textContent = 'Novo';
    }
  }
  renderFuncList();
  agendarSalvo();
}

// Intercepta mudanças nos campos de identificação para auto-sync
function onIdentChange() {
  const f = getFuncAtivo();
  if (f) {
    f.nome    = document.getElementById('nomeFuncionario').value;
    f.empresa = document.getElementById('nomeEmpresa').value;
    f.cargo   = document.getElementById('nomeCargo').value;
    document.getElementById('lblFuncAtivo').textContent = f.nome || 'Sem nome';
  }
  agendarSalvo();
}

// =====================================================
// INIT
// =====================================================
function init() {
  carregarLS();

  const now = new Date();
  document.getElementById('selMes').value = now.getMonth() + 1;
  const sa = document.getElementById('selAno');
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    if (y === now.getFullYear()) o.selected = true;
    sa.appendChild(o);
  }

  // Se tinha funcionário ativo salvo, carrega no formulário
  if (state.funcAtivo && state.funcionarios[state.funcAtivo]) {
    syncFuncParaForm();
  }

  // Listeners de auto-sync nos campos de identificação
  ['nomeFuncionario','nomeEmpresa','nomeCargo'].forEach(id => {
    document.getElementById(id).addEventListener('input', onIdentChange);
  });

  renderFeriados();
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });
  document.addEventListener('keydown', handleKeyboard);
}


// =====================================================
// RESUMO VISUAL DA CARGA HORÁRIA
// =====================================================
function renderCargaHoraria() {
  const tbody = document.getElementById('tbodyCargaResumo');
  if (!tbody) return;

  const e   = document.getElementById('cfgEntrada').value;
  const si  = document.getElementById('cfgSaidaInt').value;
  const ri  = document.getElementById('cfgRetInt').value;
  const s   = document.getElementById('cfgSaida').value;
  const sabEn  = parseInt(document.getElementById('cfgSabado').value) >= 1;
  const sabE   = document.getElementById('cfgSabEntrada').value;
  const sabS   = document.getElementById('cfgSabSaida').value;

  // Jornada diária em horas
  const jDia = (t2m(si) - t2m(e) + t2m(s) - t2m(ri)) / 60;
  const jSab = sabEn ? (t2m(sabS) - t2m(sabE)) / 60 : 0;

  const fmt = (h) => h > 0 ? `${String(Math.floor(h)).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}` : '—';

  const dias = [
    { label: 'Segunda', val: fmt(jDia), destaque: false },
    { label: 'Terça',   val: fmt(jDia), destaque: false },
    { label: 'Quarta',  val: fmt(jDia), destaque: false },
    { label: 'Quinta',  val: fmt(jDia), destaque: false },
    { label: 'Sexta',   val: fmt(jDia), destaque: false },
    { label: 'Sábado',  val: sabEn ? fmt(jSab) : '—', destaque: sabEn },
    { label: 'Domingo', val: '—', destaque: false },
    { label: 'Feriados',val: '—', destaque: false },
  ];

  tbody.innerHTML = dias.map(d =>
    `<tr${d.destaque ? ' class="ch-destaque"' : ''}>
      <td>${d.label}</td><td>${d.val}</td>
    </tr>`
  ).join('');
}

// Chama renderCargaHoraria ao mudar qualquer campo de horário de configuração
function fecharPopup() {
  document.getElementById('popupInicial').style.display = 'none';
}

// =====================================================
// SIDEBAR
// =====================================================
function toggleSidebar() {
  const sb  = document.getElementById('sidebar');
  const btn = document.getElementById('btnCollapse');
  const txt = document.getElementById('sbLogoTxt');
  state.sidebarCollapsed = !state.sidebarCollapsed;
  sb.classList.toggle('collapsed', state.sidebarCollapsed);
  btn.textContent = state.sidebarCollapsed ? '▶' : '◀';
  txt.style.display = state.sidebarCollapsed ? 'none' : '';
}

// =====================================================
// TEMA
// =====================================================
function toggleTema() {
  document.body.classList.toggle('light');
  const il = document.body.classList.contains('light');
  state.tema = il ? 'light' : 'dark';
  document.getElementById('btnTema').textContent = il ? '🌕 Escuro' : '🔆 Claro';
}

// =====================================================
// NAVEGAÇÃO
// =====================================================
const NAV_LABELS = { apuracao:'Apuração de Ponto', resumo:'Resumo Mensal', config:'Parâmetros CLT', feriados:'Feriados' };

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if ((n.getAttribute('onclick') || '').includes("'" + name + "'")) n.classList.add('active');
  });
  document.getElementById('topbarTitle').textContent = NAV_LABELS[name] || name;
  if (name === 'resumo')   renderResumo();
  if (name === 'feriados') renderFeriados();
}

// =====================================================
// TOGGLES DE CONFIGURAÇÃO
// =====================================================

/** Mostrar/ocultar campos de horário do sábado */
function toggleSabCfg() {
  const v = parseInt(document.getElementById('cfgSabado').value);
  document.getElementById('grpSabE').style.display = v >= 1 ? '' : 'none';
  document.getElementById('grpSabS').style.display = v >= 1 ? '' : 'none';
}

/** Mostrar/ocultar campos de HE personalizada */
function toggleHECustom() {
  const v = document.getElementById('cfgHECustom').value;
  const g = document.getElementById('grpHECustom');
  g.style.display = v === '1' ? 'flex' : 'none';
}

// =====================================================
// FERIADOS
// =====================================================
function renderFeriados() {
  const div = document.getElementById('feriadosList');
  if (!div) return;
  if (!state.feriados.length) { div.innerHTML = '<p style="color:var(--text3);font-size:12px">Nenhum feriado.</p>'; return; }
  const s = [...state.feriados].sort((a,b) => a.data.localeCompare(b.data));
  div.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead><tr>
      <th style="text-align:left;padding:6px;background:var(--surface2);color:var(--text3);font-size:10px;text-transform:uppercase;border-bottom:1px solid var(--border)">Data</th>
      <th style="text-align:left;padding:6px;background:var(--surface2);color:var(--text3);font-size:10px;text-transform:uppercase;border-bottom:1px solid var(--border)">Descrição</th>
      <th style="text-align:left;padding:6px;background:var(--surface2);color:var(--text3);font-size:10px;text-transform:uppercase;border-bottom:1px solid var(--border)">Tipo</th>
      <th style="padding:6px;background:var(--surface2);border-bottom:1px solid var(--border)"></th>
    </tr></thead>
    <tbody>${s.map(f=>`<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:6px;font-family:'DM Mono',monospace">${fmtData(f.data)}</td>
      <td style="padding:6px">${f.desc}</td>
      <td style="padding:6px"><span class="badge b-fer">${f.tipo}</span></td>
      <td style="padding:6px;text-align:right"><button class="btn btn-danger btn-sm" onclick="excluirFeriado('${f.data}')">🗑</button></td>
    </tr>`).join('')}</tbody></table>`;
}

function fmtData(s) {
  if (!s) return ''; const [y,m,d]=s.split('-'); return `${d}/${m}/${y}`;
}

function openModalFeriado() { document.getElementById('modalFeriado').classList.add('open'); }

function salvarFeriado() {
  const data = document.getElementById('fer_data').value;
  const desc = document.getElementById('fer_desc').value.trim();
  if (!data||!desc) { alert('Informe data e descrição.'); return; }
  if (state.feriados.find(f=>f.data===data)) { alert('Data já cadastrada.'); return; }
  state.feriados.push({ data, desc, tipo: document.getElementById('fer_tipo').value });
  closeModal('modalFeriado');
  renderFeriados();
}

function excluirFeriado(data) {
  if (!confirm('Remover este feriado?')) return;
  state.feriados = state.feriados.filter(f=>f.data!==data);
  renderFeriados();
}

/** Retorna o objeto feriado para uma data ou null */
function isFeriado(ano, mes, dia) {
  const s = `${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  return state.feriados.find(f=>f.data===s) || null;
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// =====================================================
// HELPERS DE TEMPO
// =====================================================

/** Converte "HH:MM" em minutos desde meia-noite. "00:00" = 0, "23:59" = 1439. */
function t2m(t) {
  if (!t || !t.includes(':')) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Converte minutos em "HH:MM" (sem limite de 24h, para totais acumulados). */
function m2t(m) {
  if (m === null || m === undefined) return '--:--';
  const h = Math.floor(Math.abs(m) / 60), mn = Math.abs(m) % 60;
  return (m < 0 ? '-' : '') + String(h).padStart(2,'0') + ':' + String(mn).padStart(2,'0');
}

/** Igual a m2t mas retorna "00:00" para nulo — usado em células da tabela. */
function m2s(m) {
  if (m === null || m === undefined || isNaN(m)) return '00:00';
  const h = Math.floor(Math.abs(m) / 60), mn = Math.abs(m) % 60;
  return (m < 0 ? '-' : '') + String(h).padStart(2,'0') + ':' + String(mn).padStart(2,'0');
}

/**
 * Calcula a diferença entre dois momentos em minutos, tratando virada de meia-noite.
 * Ex: início=23:00 (1380), fim=00:00 (0) → 60 minutos corretos.
 * Regra: se fim < início, assume que cruzou meia-noite (adiciona 1440).
 * Não suporta turnos maiores que 24h (não é necessário para DP).
 */
function diffMin(inicioMin, fimMin) {
  if (inicioMin === null || fimMin === null) return 0;
  if (fimMin < inicioMin) return fimMin + 1440 - inicioMin; // virou meia-noite
  return fimMin - inicioMin;
}

// =====================================================
// INTERVALO MÍNIMO CLT (Art. 71)
// =====================================================

/**
 * Retorna o intervalo mínimo obrigatório em minutos conforme Art. 71 CLT.
 * ≤ 4h → 0; 4h01–6h → 15min; > 6h → 60min
 */
function intervaloMinimoMinutos(jornadaBrutaMin) {
  if (jornadaBrutaMin <= 240) return 0;     // até 4h
  if (jornadaBrutaMin <= 360) return 15;    // 4h01 a 6h
  return 60;                                 // acima de 6h
}

/**
 * Calcula os dados de intrajornada para exibir na coluna:
 * retorna { registrado, minimo, status: 'ok'|'violacao'|'sem' }
 */
/**
 * Calcula dados de intrajornada para a coluna da tabela.
 * Usa diffMin para suportar virada de meia-noite.
 * A jornada bruta é calculada SEM descontar intervalo (tempo total na empresa).
 */
function calcIntrajornada(row) {
  const e  = t2m(row.entrada),  s  = t2m(row.saida);
  const si = t2m(row.saidaInt), ri = t2m(row.retInt);
  // Precisa ao menos de entrada para calcular
  if (e === null) return { registrado: null, minimo: null, status: 'sem' };
  // Se não tem saída final mas tem saída do intervalo, usa ela como saída parcial
  const saidaRef = s !== null ? s : (si !== null ? si : null);
  if (saidaRef === null) return { registrado: null, minimo: null, status: 'sem' };
  const jornadaBruta = diffMin(e, saidaRef);
  const minCLT = intervaloMinimoMinutos(jornadaBruta);
  if (minCLT === 0) return { registrado: 0, minimo: 0, status: 'ok' };
  const registrado = (si !== null && ri !== null) ? diffMin(si, ri) : null;
  const status = registrado === null ? 'sem' : registrado >= minCLT ? 'ok' : 'violacao';
  return { registrado, minimo: minCLT, status };
}

// =====================================================
// CÁLCULO CLT — HORAS EXTRAS COM FAIXAS PERSONALIZADAS
// =====================================================

/**
 * Calcula as horas extras.
 * Modo clássico: 50% dias úteis (incl. sábado) / 100% domingos e feriados trabalhados
 * Sábado "Não": tratado como dia normal (HE 50% ou custom)
 * Sábado "Sim": tem jornada configurada; excedente = HE 50% ou custom
 * @returns { heA: min, heB: min, pctA: %, pctB: % }
 */
function calcHE(heExtraMin, isDom, isFer) {
  const custom = document.getElementById('cfgHECustom').value === '1';

  if (!custom) {
    // Modo clássico: dom/feriado = 100%, resto = 50%
    if (isDom || isFer) return { heA: 0, heB: heExtraMin, pctA: 50, pctB: 100 };
    return { heA: heExtraMin, heB: 0, pctA: 50, pctB: 0 };
  }

  // Modo custom: dom/feriado sempre 100%
  if (isDom || isFer) return { heA: heExtraMin, heB: 0, pctA: 100, pctB: 0 };

  const faixaMin = Math.round(parseFloat(document.getElementById('cfgHEFaixa').value || 2) * 60);
  const pctA     = parseFloat(document.getElementById('cfgHEP1').value || 65);
  const pctB     = parseFloat(document.getElementById('cfgHEP2').value || 85);

  if (heExtraMin <= faixaMin) return { heA: heExtraMin, heB: 0, pctA, pctB };
  return { heA: faixaMin, heB: heExtraMin - faixaMin, pctA, pctB };
}

// =====================================================
// CÁLCULO DIÁRIO
// =====================================================

/**
 * Calcula todos os indicadores de um dia conforme CLT.
 * @param {object}  row      Registro do dia
 * @param {boolean} isDom    É domingo
 * @param {boolean} isSab    É sábado
 * @param {boolean} isFer    É feriado
 * @returns {object} trabalhado, heA, heB, pctA, pctB, atraso, noturno, intrajornada, status
 */
/**
 * Calcula todos os indicadores de um dia conforme CLT.
 *
 * REGRAS IMPLEMENTADAS:
 * - Se apenas entrada + saidaInt preenchidos (sem retorno/saída):
 *   conta o tempo até a saída do intervalo como trabalhado,
 *   e o restante da jornada como atraso/falta parcial.
 * - Virada de meia-noite: tratada via diffMin (ex: 23:00–01:00 = 2h).
 * - Sábado: só gera HE se ultrapassar a carga configurada para o sábado.
 * - Intervalo: só é descontado se AMBOS saidaInt e retInt estiverem preenchidos.
 *   Se nenhum estiver, não desconta nada (ex: jornada sem pausa).
 *
 * @param {object}  row   - Registro do dia
 * @param {boolean} isDom - É domingo
 * @param {boolean} isSab - É sábado
 * @param {boolean} isFer - É feriado
 */
function calcDia(row, isDom, isSab, isFer) {
  const entrada  = t2m(row.entrada);
  const saidaInt = t2m(row.saidaInt);
  const retInt   = t2m(row.retInt);
  const saida    = t2m(row.saida);
  const tol      = parseInt(document.getElementById('cfgTol').value) || 10;

  // Jornada de referência (configurada no painel)
  const cfgE  = t2m(document.getElementById('cfgEntrada').value);
  const cfgSI = t2m(document.getElementById('cfgSaidaInt').value);
  const cfgRI = t2m(document.getElementById('cfgRetInt').value);
  const cfgS  = t2m(document.getElementById('cfgSaida').value);
  // Jornada padrão = manhã + tarde (descontando o intervalo configurado)
  const jornadaRef = diffMin(cfgE, cfgSI) + diffMin(cfgRI, cfgS);

  // Jornada por tipo de dia
  const sabMode = parseInt(document.getElementById('cfgSabado').value); // 0=Não, 1=Sim
  const sabEnable = sabMode >= 1;
  let jornadaDia = jornadaRef;
  if (isDom) {
    jornadaDia = 0; // domingo: todo tempo trabalhado = HE 100%
  } else if (isSab) {
    if (sabEnable) {
      // Sábado "Sim": tem jornada configurada
      const sE = t2m(document.getElementById('cfgSabEntrada').value);
      const sS = t2m(document.getElementById('cfgSabSaida').value);
      jornadaDia = diffMin(sE, sS);
    } else {
      // Sábado "Não": sem jornada, todo tempo trabalhado = HE (percentual padrão)
      jornadaDia = 0;
    }
  }

  // --- OCORRÊNCIAS ESPECIAIS ---
  if (row.ocorrencia === 'falta')    return { trabalhado:0, atraso:jornadaDia, heA:0, heB:0, pctA:50, pctB:0, noturno:0, intra:null, status:'falta' };
  if (row.ocorrencia === 'atestado') return { trabalhado:jornadaDia, atraso:0,  heA:0, heB:0, pctA:50, pctB:0, noturno:0, intra:null, status:'atestado' };
  if (row.ocorrencia === 'feriado')  return { trabalhado:0, atraso:0,           heA:0, heB:0, pctA:0,  pctB:0, noturno:0, intra:null, status:'feriado' };

  // Sem nenhum horário digitado
  if (entrada === null && saida === null && saidaInt === null)
    return { trabalhado:0, atraso:0, heA:0, heB:0, pctA:0, pctB:0, noturno:0, intra:null, status:'vazio' };

  // --- CÁLCULO DO TEMPO TRABALHADO ---
  let trabalhado = 0, atraso = 0;
  let saidaEfetiva = saida; // saída que será usada nos cálculos (pode ser saidaInt p/ meio-período)

  if (entrada !== null) {
    // CASO A: entrada + saída final preenchidas (jornada completa ou com intervalo)
    if (saida !== null) {
      let intervalo = 0;
      if (saidaInt !== null && retInt !== null) {
        // Intervalo explicitamente registrado
        intervalo = diffMin(saidaInt, retInt);
      }
      // ⚠️ Se saidaInt preenchido mas retInt não: funcionário saiu pro intervalo e não voltou.
      // Não desconta intervalo pois ele não retornou — a saída final é a saída do intervalo
      // (esse caso cai no CASO B abaixo, pois saida seria null nesse cenário)
      trabalhado = diffMin(entrada, saida) - intervalo;
      if (trabalhado < 0) trabalhado = 0;
    }
    // CASO B: só entrada + saída do intervalo (não retornou após almoço)
    // Conta apenas o período trabalhado até a saída do intervalo.
    // O restante da jornada aparece como atraso/falta parcial.
    else if (saidaInt !== null && retInt === null) {
      trabalhado   = diffMin(entrada, saidaInt);
      saidaEfetiva = saidaInt; // para cálculos de atraso e noturno
      if (trabalhado < 0) trabalhado = 0;
    }
    // CASO C: só entrada (está trabalhando agora ou digitação incompleta)
    // Mostra como incompleto, sem calcular nada
  }

  // --- ATRASO (somente dias úteis normais) ---
  if (!isDom && !(isSab && sabEnable) && entrada !== null) {
    // Atraso na entrada
    let aE = entrada > cfgE ? entrada - cfgE : 0;
    if (aE <= tol) aE = 0;

    // Saída antecipada: compara com a saída de referência
    let saidaCompar = saidaEfetiva;
    if (saidaCompar !== null) {
      let aS = saidaCompar < cfgS ? cfgS - saidaCompar : 0;
      if (aS <= tol) aS = 0;
      atraso = aE + aS;
    } else {
      atraso = aE;
    }
  }

  // --- HORAS EXTRAS ---
  // Feriado trabalhado (sem ocorrência "feriado"): todo tempo = HE 100%
  const heExtra = trabalhado - jornadaDia;
  let heA = 0, heB = 0, pctA = 50, pctB = 0;
  if (isFer && trabalhado > 0) {
    const r = calcHE(trabalhado, false, true);
    heA = r.heA; heB = r.heB; pctA = r.pctA; pctB = r.pctB;
  } else if (heExtra > 0) {
    const r = calcHE(heExtra, isDom, false);
    heA = r.heA; heB = r.heB; pctA = r.pctA; pctB = r.pctB;
  }

  // --- ADICIONAL NOTURNO (22h–05h) — Art. 73 CLT ---
  // Teste: 23:00–00:00 → 60 min → com hora reduzida: round(60 * 60/52.5) = 69 min (1h09)
  let noturno = 0;
  const saidaN = saidaEfetiva; // usa a saída efetiva (meio-período ou saída final)
  if (parseInt(document.getElementById('cfgNoturno').value) && entrada !== null && saidaN !== null) {
    let n = 0;
    // Período noturno: 22h (1320 min) até 05h (300 min)
    // Trata virada de meia-noite expandindo o range para 24h+
    const eN = entrada; // entrada em min
    let sN = saidaN;
    if (sN <= eN) sN += 1440; // virou meia-noite: adiciona 24h ao fim

    // Para cada minuto do turno, verifica se está no período noturno
    // (mais preciso que cálculo de intervalos para casos com virada)
    for (let t = eN; t < sN; t++) {
      const h = t % 1440; // normaliza para 0–1439
      if (h >= 1320 || h < 300) n++; // 22h–05h
    }
    // Hora reduzida: 52min30s = 1h → cada 52,5 min noturnos = 1h paga
    if (parseInt(document.getElementById('cfgHoraReduz').value)) n = Math.round(n * (60 / 52.5));
    noturno = n;
  }

  // Intrajornada
  const intra = calcIntrajornada(row);

  // --- STATUS DA LINHA ---
  let status = 'normal';
  if (entrada !== null && saida === null && saidaInt === null) status = 'incompleto';
  if (atraso > 0) status = 'atraso';
  if (heExtra > 0) status = 'extra';
  // Meio-período ainda conta como atraso (faltou o segundo turno)
  if (trabalhado > 0 && trabalhado < jornadaDia && heExtra <= 0) status = 'atraso';

  return { trabalhado, heA, heB, pctA, pctB, atraso, noturno, intra, status };
}

// =====================================================
// GERAR TABELA
// =====================================================

/** Gera a tabela mensal de ponto com todos os dias do mês */
function gerarTabela() {
  const mes   = parseInt(document.getElementById('selMes').value);
  const ano   = parseInt(document.getElementById('selAno').value);
  const chave = `${mes}_${ano}`;

  const nFunc = document.getElementById('nomeFuncionario').value.trim() || 'Funcionário';
  const nEmp  = document.getElementById('nomeEmpresa').value.trim() || '';
  const cargo = document.getElementById('nomeCargo').value.trim() || '';
  const custom = document.getElementById('cfgHECustom').value === '1';

  // Títulos
  document.getElementById('tabelaTitulo').textContent = nFunc + ' · ' + MESES[mes-1] + '/' + ano;
  document.getElementById('tabelaSubtitulo').textContent = [nEmp, cargo].filter(Boolean).join(' · ');
  document.getElementById('chipJornada').textContent =
    document.getElementById('cfgEntrada').value + ' – ' + document.getElementById('cfgSaida').value;

  // Legenda dinâmica das colunas HE A / HE B
  const thHEA = document.querySelector('#tabelaPonto thead th:nth-child(9)');
  const thHEB = document.querySelector('#tabelaPonto thead th:nth-child(10)');
  if (custom) {
    const p1 = document.getElementById('cfgHEP1').value;
    const p2 = document.getElementById('cfgHEP2').value;
    const fh = document.getElementById('cfgHEFaixa').value;
    if (thHEA) thHEA.textContent = `HE ${p1}% (até ${fh}h)`;
    if (thHEB) thHEB.textContent = `HE ${p2}%`;
  } else {
    if (thHEA) thHEA.textContent = 'HE 50%';
    if (thHEB) thHEB.textContent = 'HE 100%';
  }

  // Cabeçalho de impressão
  document.getElementById('phTitulo').textContent = 'Cartão Ponto — ' + MESES[mes-1] + '/' + ano;
  document.getElementById('phSub').textContent    = nFunc + (cargo ? ' · ' + cargo : '');
  document.getElementById('phGrid').innerHTML = [
    nEmp  ? `<div>Empresa: <span>${nEmp}</span></div>` : '',
    `<div>Jornada: <span>${document.getElementById('cfgEntrada').value}–${document.getElementById('cfgSaida').value}</span></div>`,
    `<div>Tolerância: <span>${document.getElementById('cfgTol').value}min</span></div>`,
  ].join('');

  const diasNoMes = new Date(ano, mes, 0).getDate();
  const tbody     = document.getElementById('tbodyPonto');
  tbody.innerHTML = '';
  const oldFoot = document.querySelector('#tabelaPonto tfoot');
  if (oldFoot) oldFoot.remove();

  if (!state.registros[chave]) state.registros[chave] = {};

  let totTrab=0, totAtr=0, totHEA=0, totHEB=0, totNot=0;

  for (let d = 1; d <= diasNoMes; d++) {
    const data   = new Date(ano, mes-1, d);
    const diaSem = data.getDay();
    const isDom  = diaSem === 0;
    const isSab  = diaSem === 6;
    const ferObj = isFeriado(ano, mes, d);
    const isFer  = !!ferObj;
    const sabEn  = parseInt(document.getElementById('cfgSabado').value) >= 1;

    // FDS: fim de semana normal (desativado se sábado habilitado)
    const eFDS = isDom || (isSab && !sabEn);

    const saved = state.registros[chave][d] || {};
    if (isFer && !saved.ocorrencia) saved.ocorrencia = 'feriado';

    const tr = document.createElement('tr');
    tr.dataset.d   = d;
    tr.dataset.dom = isDom ? '1' : '0';
    tr.dataset.sab = isSab ? '1' : '0';
    tr.dataset.fer = isFer ? '1' : '0';
    if (eFDS) tr.classList.add('row-fds');

    // Valores padrão de horário
    let dE, dSI, dRI, dS;
    if (isDom) {
      dE = dSI = dRI = dS = '';  // domingo: vazio mas editável
    } else if (isSab && sabEn) {
      dE  = saved.entrada  ?? document.getElementById('cfgSabEntrada').value;
      dSI = saved.saidaInt ?? '';
      dRI = saved.retInt   ?? '';
      dS  = saved.saida    ?? document.getElementById('cfgSabSaida').value;
    } else if (isSab && !sabEn) {
      dE = dSI = dRI = dS = '';
    } else {
      dE  = saved.entrada  ?? document.getElementById('cfgEntrada').value;
      dSI = saved.saidaInt ?? document.getElementById('cfgSaidaInt').value;
      dRI = saved.retInt   ?? document.getElementById('cfgRetInt').value;
      dS  = saved.saida    ?? document.getElementById('cfgSaida').value;
    }

    const ocOpts = [
      {v:'',l:'—'},{v:'falta',l:'Falta'},{v:'atestado',l:'Atestado'},{v:'feriado',l:'Feriado'}
    ].map(o=>`<option value="${o.v}"${saved.ocorrencia===o.v?' selected':''}>${o.l}</option>`).join('');

    // Badge feriado: só mostra se não tiver ocorrência já marcada como feriado
    const badge = (isFer && saved.ocorrencia !== 'feriado') ? `<span class="badge b-fer" title="${ferObj.desc}">FER</span>` : '';

    tr.innerHTML = `
      <td><span class="day-lbl">${String(d).padStart(2,'0')}/${String(mes).padStart(2,'0')}</span>
          <span class="day-nm">${DIAS[diaSem]}</span>${badge}</td>
      <td><input type="time" value="${dE}"  onchange="recalcRow(this,${d},'entrada','${chave}')"></td>
      <td><input type="time" value="${dSI}" onchange="recalcRow(this,${d},'saidaInt','${chave}')"></td>
      <td><input type="time" value="${dRI}" onchange="recalcRow(this,${d},'retInt','${chave}')"></td>
      <td><input type="time" value="${dS}"  onchange="recalcRow(this,${d},'saida','${chave}')"></td>
      <td class="cc" id="intra_${d}">—</td>
      <td class="cc" id="trab_${d}">—</td>
      <td class="cc" id="atr_${d}">—</td>
      <td class="cc" id="hea_${d}">—</td>
      <td class="cc" id="heb_${d}">—</td>
      <td class="cc not" id="not_${d}">—</td>
      <td><select class="sel-oc" onchange="recalcRow(this,${d},'ocorrencia','${chave}')">${ocOpts}</select><span class="oc-print" style="display:none;font-size:8pt">${saved.ocorrencia||''}</span></td>
    `;
    tbody.appendChild(tr);

    // Salvar estado inicial
    if (!state.registros[chave][d]) {
      state.registros[chave][d] = { entrada:dE, saidaInt:dSI, retInt:dRI, saida:dS, ocorrencia:saved.ocorrencia||(isFer?'feriado':'') };
    }

    const r = renderLinha(d, chave, tr);
    if (r) { totTrab+=r.trabalhado; totAtr+=r.atraso; totHEA+=r.heA; totHEB+=r.heB; totNot+=r.noturno; }
  }

  // Tfoot — linha de totais alinhada com as colunas
  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `<tr>
    <td colspan="6" style="text-align:right;padding-right:8px">Totais do mês</td>
    <td id="totTrab">${m2s(totTrab)}</td>
    <td id="totAtr">${m2s(totAtr)}</td>
    <td id="totHEA">${m2s(totHEA)}</td>
    <td id="totHEB">${m2s(totHEB)}</td>
    <td id="totNot">${m2s(totNot)}</td>
    <td></td>
  </tr>`;
  document.getElementById('tabelaPonto').appendChild(tfoot);

  document.getElementById('tabelaContainer').style.display = 'block';
  document.getElementById('tabelaContainer').scrollIntoView({ behavior:'smooth' });
}

/** Atualiza o estado ao editar um campo e recalcula a linha */
function recalcRow(input, d, field, chave) {
  if (!state.registros[chave]) state.registros[chave] = {};
  if (!state.registros[chave][d]) state.registros[chave][d] = {};
  state.registros[chave][d][field] = input.value;
  const tr = input.closest('tr');
  renderLinha(d, chave, tr);
  atualizarTotais(chave);
  // Sincroniza registros no funcionário ativo e agenda salvamento
  const f = getFuncAtivo();
  if (f) f.registros = state.registros;
  agendarSalvo();
}

/**
 * Calcula e atualiza os campos calculados de uma linha da tabela.
 * @returns {object|null} resultado do cálculo
 */
function renderLinha(d, chave, tr) {
  const row    = state.registros[chave][d] || {};
  const isDom  = tr.dataset.dom === '1';
  const isSab  = tr.dataset.sab === '1';
  const isFer  = tr.dataset.fer === '1';
  const r      = calcDia(row, isDom, isSab, isFer);

  const g = id => document.getElementById(id + '_' + d);
  const trabEl  = g('trab'), atrEl = g('atr');
  const heaEl   = g('hea'),  hebEl = g('heb');
  const notEl   = g('not'),  intraEl = g('intra');
  if (!trabEl) return null;

  // Atualiza label de ocorrência para impressão
  const ocPrint = tr.querySelector('.oc-print');
  if (ocPrint) ocPrint.textContent = row.ocorrencia || '';

  // Atualiza badge FER: ocultar quando ocorrência = feriado
  const ferBadge = tr.querySelector('.badge.b-fer');
  if (ferBadge) ferBadge.style.display = (row.ocorrencia === 'feriado') ? 'none' : '';

  // Trabalhado
  trabEl.textContent = r.trabalhado ? m2s(r.trabalhado) : '—';
  trabEl.className   = 'cc' + (r.status==='falta'?' neg' : r.trabalhado>0?' pos':'');

  // Atraso
  atrEl.textContent = r.atraso > 0 ? m2s(r.atraso) : '—';
  atrEl.className   = 'cc' + (r.atraso > 0 ? ' wrn' : '');

  // HE A (50% ou 1ª faixa custom)
  heaEl.textContent = r.heA > 0 ? m2s(r.heA) : '—';
  heaEl.className   = 'cc' + (r.heA > 0 ? ' pos' : '');

  // HE B (100% dom/fer ou 2ª faixa custom)
  hebEl.textContent = r.heB > 0 ? m2s(r.heB) : '—';
  hebEl.className   = 'cc' + (r.heB > 0 ? ' pos' : '');

  // Noturno
  notEl.textContent = r.noturno > 0 ? m2s(r.noturno) : '—';
  notEl.className   = 'cc not';

  // Intrajornada — mostra registrado / mínimo CLT
  if (r.intra && r.intra.status !== 'sem') {
    if (r.intra.minimo === 0) {
      intraEl.textContent = '—';
      intraEl.className   = 'cc';
    } else if (r.intra.status === 'violacao') {
      intraEl.textContent = m2s(r.intra.registrado) + ' ⚠';
      intraEl.className   = 'cc wrn';
      intraEl.title       = `Mín. CLT: ${m2s(r.intra.minimo)}`;
    } else {
      intraEl.textContent = m2s(r.intra.registrado);
      intraEl.className   = 'cc';
      intraEl.title       = `Mín. CLT: ${m2s(r.intra.minimo)}`;
    }
  } else {
    intraEl.textContent = '—'; intraEl.className = 'cc';
  }

  // Destaque de linha
  tr.classList.remove('row-falta','row-atraso','row-extra','row-atestado','row-feriado');
  const mp = { falta:'row-falta', extra:'row-extra', atraso:'row-atraso', atestado:'row-atestado', feriado:'row-feriado' };
  if (mp[r.status]) tr.classList.add(mp[r.status]);

  return r;
}

/** Recalcula e atualiza a linha de totais */
function atualizarTotais(chave) {
  const [mes, ano] = chave.split('_').map(Number);
  const diasNoMes  = new Date(ano, mes, 0).getDate();
  const sabEn      = parseInt(document.getElementById('cfgSabado').value) >= 1;
  let totTrab=0, totAtr=0, totHEA=0, totHEB=0, totNot=0;

  for (let d = 1; d <= diasNoMes; d++) {
    const data   = new Date(ano, mes-1, d);
    const diaSem = data.getDay();
    const isDom  = diaSem === 0;
    const isSab  = diaSem === 6;
    const isFer  = !!isFeriado(ano, mes, d);
    // Pula sábado não habilitado. Domingo é incluído (pode ter HE 100%)
    if (isSab && !sabEn) continue;
    const row = (state.registros[chave] && state.registros[chave][d]) || {};
    const r   = calcDia(row, isDom, isSab, isFer);
    totTrab += r.trabalhado; totAtr  += r.atraso;
    totHEA  += r.heA;        totHEB  += r.heB; totNot += r.noturno;
  }
  const u = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=m2s(v); };
  u('totTrab',totTrab); u('totAtr',totAtr);
  u('totHEA',totHEA);   u('totHEB',totHEB); u('totNot',totNot);
}

/** Preenche todos os dias úteis com a jornada padrão */
function preencherPadrao() {
  const mes  = parseInt(document.getElementById('selMes').value);
  const ano  = parseInt(document.getElementById('selAno').value);
  const chave = `${mes}_${ano}`;
  const sabEn = parseInt(document.getElementById('cfgSabado').value) >= 1;
  const nDias = new Date(ano, mes, 0).getDate();

  for (let d = 1; d <= nDias; d++) {
    const data   = new Date(ano, mes-1, d);
    const diaSem = data.getDay();
    const isDom  = diaSem === 0;
    const isSab  = diaSem === 6;
    if (isDom) continue;
    if (isSab && !sabEn) continue;
    if (!state.registros[chave]) state.registros[chave] = {};
    const ferObj = isFeriado(ano, mes, d);
    state.registros[chave][d] = isSab && sabEn ? {
      entrada: document.getElementById('cfgSabEntrada').value,
      saidaInt:'', retInt:'',
      saida: document.getElementById('cfgSabSaida').value,
      ocorrencia: ferObj ? 'feriado' : '',
    } : {
      entrada:  document.getElementById('cfgEntrada').value,
      saidaInt: document.getElementById('cfgSaidaInt').value,
      retInt:   document.getElementById('cfgRetInt').value,
      saida:    document.getElementById('cfgSaida').value,
      ocorrencia: ferObj ? 'feriado' : '',
    };
  }
  const f = getFuncAtivo(); if (f) f.registros = state.registros;
  agendarSalvo();
  gerarTabela();
}

/** Limpa todos os registros do mês após confirmação */
function limparTabela() {
  if (!confirm('Limpar todos os registros deste mês?')) return;
  const mes = parseInt(document.getElementById('selMes').value);
  const ano = parseInt(document.getElementById('selAno').value);
  state.registros[`${mes}_${ano}`] = {};
  const f = getFuncAtivo(); if (f) f.registros = state.registros;
  agendarSalvo();
  gerarTabela();
}

// =====================================================
// TOTAIS PARA RESUMO E EXPORTAÇÃO
// =====================================================
function calcTotais(chave, mes, ano) {
  const sabEn   = parseInt(document.getElementById('cfgSabado').value) >= 1;
  const nDias   = new Date(ano, mes, 0).getDate();
  let tT=0, tA=0, tHA=0, tHB=0, tN=0, tF=0, tAt=0, tDU=0, tIntraViol=0;
  const datasFaltas=[], datasAtestados=[];

  for (let d = 1; d <= nDias; d++) {
    const data   = new Date(ano, mes-1, d);
    const diaSem = data.getDay();
    const isDom  = diaSem === 0;
    const isSab  = diaSem === 6;
    const isFer  = !!isFeriado(ano, mes, d);
    // Pula sábado não habilitado. Domingo é incluído (pode ter HE 100%)
    if (isSab && !sabEn) continue;
    const row = (state.registros[chave] && state.registros[chave][d]) || {};
    const r   = calcDia(row, isDom, isSab, isFer);
    tT += r.trabalhado; tA  += r.atraso;
    tHA += r.heA;       tHB += r.heB; tN += r.noturno;
    if (isDom) continue; // domingo não conta dias úteis nem faltas/atestados
    tDU++;
    if (r.status === 'falta')    { tF++;  datasFaltas.push(`${String(d).padStart(2,'0')}/${String(mes).padStart(2,'0')}`); }
    if (r.status === 'atestado') { tAt++; datasAtestados.push(`${String(d).padStart(2,'0')}/${String(mes).padStart(2,'0')}`); }
    if (r.intra && r.intra.status === 'violacao') tIntraViol++;
  }
  return { tT, tA, tHA, tHB, tN, tF, tAt, tDU, tIntraViol, datasFaltas, datasAtestados };
}

// =====================================================
// RESUMO MENSAL
// =====================================================
function renderResumo() {
  const mes   = parseInt(document.getElementById('selMes').value);
  const ano   = parseInt(document.getElementById('selAno').value);
  const chave = `${mes}_${ano}`;
  const t     = calcTotais(chave, mes, ano);
  const custom = document.getElementById('cfgHECustom').value === '1';

  const jDia = (t2m(document.getElementById('cfgSaidaInt').value) - t2m(document.getElementById('cfgEntrada').value))
             + (t2m(document.getElementById('cfgSaida').value) - t2m(document.getElementById('cfgRetInt').value));
  const jEsp = t.tDU * jDia;
  const nF   = document.getElementById('nomeFuncionario').value.trim() || 'Funcionário';
  const nE   = document.getElementById('nomeEmpresa').value.trim();

  const lblHA = custom
    ? `HE ${document.getElementById('cfgHEP1').value}% (1ª faixa)`
    : 'Horas extras 50%';
  const lblHB = custom
    ? `HE ${document.getElementById('cfgHEP2').value}% (2ª faixa)`
    : 'Horas extras 100%';

  document.getElementById('resumoContent').innerHTML = `
    <div style="margin-bottom:12px">
      <div style="font-size:16px;font-weight:600">${nF} · ${MESES[mes-1]}/${ano}</div>
      <div style="font-size:11px;color:var(--text3);margin-top:2px">${nE ? nE+' · ' : ''}${t.tDU} dias úteis</div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-lbl">Horas Trabalhadas</div>
        <div class="stat-val c-blue">${m2s(t.tT)}</div>
        <div class="stat-sub">Esperado: ${m2s(jEsp)}</div></div>
      <div class="stat-card"><div class="stat-lbl">${lblHA}</div>
        <div class="stat-val c-green">${m2s(t.tHA)}</div></div>
      <div class="stat-card"><div class="stat-lbl">${lblHB}</div>
        <div class="stat-val c-green">${m2s(t.tHB)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Ad. Noturno</div>
        <div class="stat-val c-purple">${m2s(t.tN)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Total Atrasos</div>
        <div class="stat-val c-yellow">${m2s(t.tA)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Faltas</div>
        <div class="stat-val c-red">${t.tF}</div>
        <div class="stat-sub">${t.tAt} atestado(s)</div></div>
      <div class="stat-card"><div class="stat-lbl">Intrajornada ⚠</div>
        <div class="stat-val ${t.tIntraViol > 0 ? 'c-yellow' : ''}">${t.tIntraViol}</div>
        <div class="stat-sub">violação(ões) CLT art.71</div></div>
    </div>
    <div class="card">
      <div class="card-title"><span class="dot"></span>Resumo para Folha de Pagamento</div>
      <table class="sum-table" style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden">
        <thead><tr><th>Item</th><th style="text-align:center">Horas / Dias</th></tr></thead>
        <tbody>
          <tr><td>Horas normais trabalhadas</td><td>${m2s(t.tT)}</td></tr>
          <tr><td>${lblHA}</td><td style="color:var(--green)">${m2s(t.tHA)}</td></tr>
          <tr><td>${lblHB}</td><td style="color:var(--green)">${m2s(t.tHB)}</td></tr>
          <tr><td>Adicional noturno</td><td style="color:var(--purple)">${m2s(t.tN)}</td></tr>
          <tr><td>Total de atrasos</td><td style="color:var(--yellow)">${m2s(t.tA)}</td></tr>
          <tr><td>Faltas injustificadas</td><td style="color:var(--red)">${t.tF} dia(s)${t.datasFaltas.length ? '<br><span style="font-size:10px;color:var(--text2)">' + t.datasFaltas.join(', ') + '</span>' : ''}</td></tr>
          <tr><td>Atestados médicos</td><td style="color:var(--purple)">${t.tAt} dia(s)${t.datasAtestados.length ? '<br><span style="font-size:10px;color:var(--text2)">' + t.datasAtestados.join(', ') + '</span>' : ''}</td></tr>
          <tr><td>Violações de intrajornada (CLT art. 71)</td><td style="color:var(--yellow)">${t.tIntraViol} dia(s)</td></tr>
        </tbody>
      </table>
    </div>
    <div style="font-size:10.5px;color:var(--text3);margin-top:4px">
      ⚖️ CLT arts. 58, 59, 66, 71, 73, 131, 476 · Súmulas TST 23, 60, 291, 437
    </div>`;
}

// =====================================================
// EXPORTAÇÃO CSV
// =====================================================
function exportCSV() {
  const mes   = parseInt(document.getElementById('selMes').value);
  const ano   = parseInt(document.getElementById('selAno').value);
  const chave = `${mes}_${ano}`;
  const nDias = new Date(ano, mes, 0).getDate();
  const DFULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const nF    = document.getElementById('nomeFuncionario').value.trim() || 'Funcionario';
  const nE    = document.getElementById('nomeEmpresa').value.trim() || '';
  const sabEn = parseInt(document.getElementById('cfgSabado').value) >= 1;

  let csv = `Cartão Ponto — ${nF} — ${MESES[mes-1]}/${ano}\n`;
  if (nE) csv += `Empresa: ${nE}\n`;
  csv += `Gerado: ${new Date().toLocaleString('pt-BR')}\n\n`;
  csv += 'Dia;DiaSemana;Entrada;SaidaInt.;Ret.Int.;Saída;Intrajornada;Trabalhado;Atraso;HE_A;HE_B;Ad.Not.;Ocorrência\n';

  for (let d = 1; d <= nDias; d++) {
    const data   = new Date(ano, mes-1, d);
    const diaSem = data.getDay();
    const isDom  = diaSem === 0;
    const isSab  = diaSem === 6;
    const isFer  = !!isFeriado(ano, mes, d);
    const row    = (state.registros[chave] && state.registros[chave][d]) || {};
    const r      = calcDia(row, isDom, isSab, isFer);
    const intraStr = r.intra && r.intra.registrado !== null ? m2s(r.intra.registrado) : '';
    csv += [
      `${String(d).padStart(2,'0')}/${String(mes).padStart(2,'0')}/${ano}`,
      DFULL[diaSem], row.entrada||'', row.saidaInt||'', row.retInt||'', row.saida||'',
      intraStr, m2s(r.trabalhado), m2s(r.atraso),
      m2s(r.heA), m2s(r.heB), m2s(r.noturno), row.ocorrencia||''
    ].join(';') + '\n';
  }
  const t = calcTotais(chave, mes, ano);
  csv += `\nTOTAIS;;;;;;;${m2s(t.tT)};${m2s(t.tA)};${m2s(t.tHA)};${m2s(t.tHB)};${m2s(t.tN)}\n`;

  const blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8;'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `ponto_${nF.replace(/ /g,'_')}_${mes}_${ano}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// =====================================================
// IMPRESSÃO / PDF
// =====================================================
function imprimirPDF() {
  if (document.getElementById('tabelaContainer').style.display === 'none') {
    alert('Gere a tabela primeiro.'); return;
  }
  // Define título do documento para nome do arquivo no "Salvar como PDF"
  const mes   = parseInt(document.getElementById('selMes').value);
  const ano   = parseInt(document.getElementById('selAno').value);
  const nFunc = document.getElementById('nomeFuncionario').value.trim() || 'Funcionario';
  const nEmp  = document.getElementById('nomeEmpresa').value.trim();
  const tituloOriginal = document.title;
  document.title = `Ponto_${nFunc.replace(/ /g,'_')}${nEmp ? '_'+nEmp.replace(/ /g,'_') : ''}_${String(mes).padStart(2,'0')}_${ano}`;
  showView('apuracao');
  setTimeout(() => {
    window.print();
    setTimeout(() => { document.title = tituloOriginal; }, 500);
  }, 200);
}

// =====================================================
// TECLADO — Enter/Tab nos horários + atalhos de ocorrência
// =====================================================
function handleKeyboard(e) {
  const el = document.activeElement;
  if (!el) return;

  // ── Atalhos de ocorrência: F / A / E nas células de ocorrência ──
  // Funciona quando o foco está em qualquer célula da linha da tabela
  if (['f','a','e','r'].includes(e.key.toLowerCase()) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const td = el.closest('td');
    const tr = el.closest('tr[data-d]');
    if (tr) {
      const sel = tr.querySelector('select.sel-oc');
      if (sel) {
        const map = { f:'falta', a:'atestado', e:'feriado', r:'' };
        const val = map[e.key.toLowerCase()];
        if (val !== undefined) {
          e.preventDefault();
          sel.value = val;
          sel.dispatchEvent(new Event('change'));
          return;
        }
      }
    }
  }

  // ── Enter/Tab nos inputs de hora ──
  if (el.type !== 'time') return;
  if (e.key !== 'Enter' && e.key !== 'Tab') return;
  e.preventDefault();
  const inputs = Array.from(document.querySelectorAll('input[type="time"]:not([disabled])'));
  const idx = inputs.indexOf(el);
  if (idx >= 0 && idx < inputs.length - 1) {
    inputs[idx + 1].focus();
  }
}

init();
