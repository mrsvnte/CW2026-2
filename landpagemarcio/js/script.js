// ===== Menu: fecha no celular ao clicar em um link =====
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});

// ===== Formulário de contato (só existe em contato.html) =====
const form = document.getElementById('form-contato');
if (form) {
  const $ = id => document.getElementById(id);

  // Pré-seleciona o plano vindo da página de serviços (contato.html?plano=...)
  const plano = new URLSearchParams(location.search).get('plano');
  if (plano && $('servico').querySelector(`option[value="${plano}"]`)) $('servico').value = plano;

  // CPF ou CNPJ conforme o tipo de pessoa
  document.querySelectorAll('input[name="tipo_pessoa"]').forEach(r => r.addEventListener('change', () => {
    const pj = document.querySelector('input[name="tipo_pessoa"]:checked').value === 'juridica';
    $('label-documento').textContent = pj ? 'CNPJ (opcional)' : 'CPF (opcional)';
    $('documento').placeholder = pj ? '00.000.000/0000-00' : '000.000.000-00';
  }));

  // Valor do orçamento e contador de caracteres
  $('orcamento').addEventListener('input', e => { $('orcamento-valor').textContent = Number(e.target.value).toLocaleString('pt-BR'); });
  $('descricao').addEventListener('input', e => { $('contador').textContent = e.target.value.length; });

  function erro(campo, msg) {
    const bloco = campo.closest('.campo');
    bloco.classList.toggle('invalido', !!msg);
    const span = bloco.querySelector('.erro-msg');
    if (span) span.textContent = msg || '';
    return !msg;
  }

  function validar() {
    let ok = true;
    ok &= erro($('nome'), $('nome').value.trim().split(/\s+/).length < 2 ? 'Digite nome e sobrenome.' : '');
    ok &= erro($('telefone'), $('telefone').value.replace(/\D/g, '').length < 10 ? 'Digite o telefone com DDD. Ex.: (27) 99999-9999' : '');
    ok &= erro($('email'), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('email').value) ? '' : 'E-mail inválido. Ex.: nome@email.com');
    ok &= erro($('servico'), $('servico').value ? '' : 'Escolha o tipo de serviço.');
    ok &= erro($('descricao'), $('descricao').value.trim().length >= 15 ? '' : 'Conte um pouco mais (mínimo 15 caracteres).');
    ok &= erro($('aceite'), $('aceite').checked ? '' : 'Marque a autorização para eu poder responder.');
    const temHorario = document.querySelectorAll('input[name="horario"]:checked').length > 0;
    $('erro-horario').textContent = temHorario ? '' : 'Escolha pelo menos um horário.';
    return ok && temHorario;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const sucesso = $('sucesso');
    if (!validar()) {
      sucesso.classList.remove('mostrar');
      form.querySelector('.invalido input, .invalido select, .invalido textarea')?.focus();
      return;
    }
    const primeiroNome = $('nome').value.trim().split(' ')[0];
    sucesso.textContent = `Obrigado, ${primeiroNome}! Recebi seu pedido e vou enviar a proposta no horário escolhido.`;
    sucesso.classList.add('mostrar');
    form.reset();
    $('contador').textContent = '0';
    $('orcamento-valor').textContent = '1.500';
  });

  form.addEventListener('reset', () => {
    form.querySelectorAll('.campo').forEach(c => c.classList.remove('invalido'));
    form.querySelectorAll('.erro-msg').forEach(s => (s.textContent = ''));
  });
}
