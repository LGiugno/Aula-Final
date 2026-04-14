var tarefas = [];
var filtroAtual = 'todas';

var dadosSalvos = localStorage.getItem('taskflow_tarefas');
if (dadosSalvos != null) {
  tarefas = JSON.parse(dadosSalvos);
}

function salvarNoStorage() {
  var json = JSON.stringify(tarefas);
  localStorage.setItem('taskflow_tarefas', json);
}

function adicionarTarefa() {
  var campoTexto = document.getElementById('inputTarefa');
  var campoData = document.getElementById('inputData');
  var campoPrio = document.getElementById('inputPrioridade');

  var texto = campoTexto.value;
  texto = texto.trim();

  if (texto == '') {
    alert('Por favor, digite uma tarefa antes de adicionar.');
    campoTexto.focus();
    return;
  }

  var novaTarefa = {};
  novaTarefa.id = Date.now();
  novaTarefa.titulo = texto;
  novaTarefa.feita = false;
  novaTarefa.data = campoData.value;
  novaTarefa.prioridade = campoPrio.value;

  tarefas.unshift(novaTarefa);

  campoTexto.value = '';
  campoData.value = '';
  campoPrio.value = 'media';

  salvarNoStorage();
  renderizarLista();

  campoTexto.focus();
}

function marcarFeita(id) {
  var i = 0;
  while (i < tarefas.length) {
    if (tarefas[i].id == id) {
      if (tarefas[i].feita == false) {
        tarefas[i].feita = true;
      } else {
        tarefas[i].feita = false;
      }
      break;
    }
    i = i + 1;
  }
  salvarNoStorage();
  renderizarLista();
}

function excluirTarefa(id) {
  var confirma = confirm('Tem certeza que deseja excluir essa tarefa?');
  if (confirma == false) {
    return;
  }
  var novaLista = [];
  var i = 0;
  while (i < tarefas.length) {
    if (tarefas[i].id != id) {
      novaLista.push(tarefas[i]);
    }
    i = i + 1;
  }
  tarefas = novaLista;
  salvarNoStorage();
  renderizarLista();
}

function mudarFiltro(qual) {
  filtroAtual = qual;

  var btnTodas = document.getElementById('btn-todas');
  var btnPendentes = document.getElementById('btn-pendentes');
  var btnConcluidas = document.getElementById('btn-concluidas');

  btnTodas.className = '';
  btnPendentes.className = '';
  btnConcluidas.className = '';

  if (qual == 'todas') {
    btnTodas.className = 'ativo';
  }
  if (qual == 'pendentes') {
    btnPendentes.className = 'ativo';
  }
  if (qual == 'concluidas') {
    btnConcluidas.className = 'ativo';
  }

  renderizarLista();
}

function formatarData(str) {
  if (str == '' || str == null) {
    return '';
  }
  var partes = str.split('-');
  var ano = partes[0];
  var mes = partes[1];
  var dia = partes[2];
  return dia + '/' + mes + '/' + ano;
}

function escaparHtml(str) {
  var resultado = str;
  resultado = resultado.replace(/&/g, '&amp;');
  resultado = resultado.replace(/</g, '&lt;');
  resultado = resultado.replace(/>/g, '&gt;');
  resultado = resultado.replace(/"/g, '&quot;');
  return resultado;
}

function contarTotal() {
  return tarefas.length;
}

function contarPendentes() {
  var count = 0;
  var i = 0;
  while (i < tarefas.length) {
    if (tarefas[i].feita == false) {
      count = count + 1;
    }
    i = i + 1;
  }
  return count;
}

function contarFeitas() {
  var count = 0;
  var i = 0;
  while (i < tarefas.length) {
    if (tarefas[i].feita == true) {
      count = count + 1;
    }
    i = i + 1;
  }
  return count;
}

function getTarefasFiltradas() {
  var resultado = [];
  var i = 0;
  if (filtroAtual == 'todas') {
    while (i < tarefas.length) {
      resultado.push(tarefas[i]);
      i = i + 1;
    }
  }
  if (filtroAtual == 'pendentes') {
    while (i < tarefas.length) {
      if (tarefas[i].feita == false) {
        resultado.push(tarefas[i]);
      }
      i = i + 1;
    }
  }
  if (filtroAtual == 'concluidas') {
    while (i < tarefas.length) {
      if (tarefas[i].feita == true) {
        resultado.push(tarefas[i]);
      }
      i = i + 1;
    }
  }
  return resultado;
}

function renderizarLista() {
  var elTotal = document.getElementById('numTotal');
  var elPendentes = document.getElementById('numPendentes');
  var elFeitas = document.getElementById('numFeitas');

  elTotal.textContent = contarTotal();
  elPendentes.textContent = contarPendentes();
  elFeitas.textContent = contarFeitas();

  var lista = document.getElementById('listaTarefas');
  var tarefasVisiveis = getTarefasFiltradas();

  if (tarefasVisiveis.length == 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma tarefa aqui.</p>';
    return;
  }

  var html = '';
  var i = 0;
  while (i < tarefasVisiveis.length) {
    var t = tarefasVisiveis[i];

    var classeTarefa = 'tarefa';
    if (t.feita == true) {
      classeTarefa = 'tarefa feita';
    } else {
      if (t.prioridade == 'alta') {
        classeTarefa = 'tarefa alta';
      }
      if (t.prioridade == 'media') {
        classeTarefa = 'tarefa media';
      }
      if (t.prioridade == 'baixa') {
        classeTarefa = 'tarefa baixa';
      }
    }

    var classeBtn = 'btn-check';
    var textoBtn = '';
    if (t.feita == true) {
      classeBtn = 'btn-check marcado';
      textoBtn = 'v';
    }

    var badgeStatus = '';
    if (t.feita == true) {
      badgeStatus = '<span class="bdg bdg-feita">Concluida</span>';
    } else {
      badgeStatus = '<span class="bdg bdg-pendente">Pendente</span>';
    }

    var badgeData = '';
    if (t.data != '' && t.data != null) {
      badgeData = '<span class="bdg bdg-data"> ' + formatarData(t.data) + '</span>';
    }

    var badgePrio = '';
    if (t.feita == false) {
      if (t.prioridade == 'alta') {
        badgePrio = '<span class="bdg bdg-prio-alta">Alta</span>';
      }
      if (t.prioridade == 'media') {
        badgePrio = '<span class="bdg bdg-prio-media">Media</span>';
      }
      if (t.prioridade == 'baixa') {
        badgePrio = '<span class="bdg bdg-prio-baixa">Baixa</span>';
      }
    }

    html = html + '<div class="' + classeTarefa + '">';
    html = html + '<div class="lado-esquerdo">';
    html = html + '<button class="' + classeBtn + '" onclick="marcarFeita(' + t.id + ')">' + textoBtn + '</button>';
    html = html + '<div>';
    html = html + '<span class="titulo-tarefa">' + escaparHtml(t.titulo) + '</span>';
    html = html + '<span class="info-tarefa">' + badgeStatus + badgeData + badgePrio + '</span>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '<button class="btn-del" onclick="excluirTarefa(' + t.id + ')">X</button>';
    html = html + '</div>';

    i = i + 1;
  }

  lista.innerHTML = html;
}

document.getElementById('inputTarefa').addEventListener('keydown', function(evento) {
  if (evento.key == 'Enter') {
    adicionarTarefa();
  }
});

renderizarLista();
