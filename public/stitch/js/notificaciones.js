(function () {
  window.P_PAGINA = 'notificaciones';
  var st = { evento: null, seg: 'todos', q: '', canalEditor: 'sms' };

  var DISP = {
    inmediato: ['bolt', 'Al registrarse', 0],
    't-48h': ['schedule', 'T-48h antes', -48],
    't-24h': ['schedule', 'T-24h antes', -24],
    't-2h': ['sms', 'T-2h antes', -2],
    post: ['reviews', 'Post-evento (+12h)', 12],
    manual: ['send', 'Envío manual', null],
  };
  var CANAL = { sms: 'Canal SMS', email: 'Solo Email', email_sms: 'Email + SMS' };
  var VARS = '{Nombre}, {primer_nombre}, {Tipo_Ticket}, {Fecha_Evento}, {Ubicacion_Mapa}, {Link_QR}';

  function ev() { return P.evento(st.evento); }
  function mensajes() { return P.d.mensajes.filter(function (m) { return !st.evento || m.evento_id === st.evento; }); }
  function secuencia() {
    var orden = Object.keys(DISP);
    return mensajes().filter(function (m) { return m.tipo === 'secuencia'; }).sort(function (a, b) { return orden.indexOf(a.disparador) - orden.indexOf(b.disparador); });
  }
  function enviados() { return mensajes().filter(function (m) { return m.enviado_at; }); }

  function momento(m) {
    var e = ev();
    var d = DISP[m.disparador];
    if (m.programado_at) return new Date(m.programado_at);
    if (!e || !e.fecha || !d || d[2] == null || m.disparador === 'inmediato') return null;
    var base = new Date(e.fecha + 'T' + (e.hora_inicio || '18:00') + ':00-05:00');
    return new Date(base.getTime() + d[2] * 36e5);
  }

  function destinatarios(canal) {
    return P.asistentesDe(st.evento).filter(function (a) {
      var tel = String(a.telefono || '').replace(/\D/g, '').length >= 10;
      var mail = String(a.correo || '').indexOf('@') !== -1;
      return canal === 'sms' ? tel : canal === 'email' ? mail : tel || mail;
    });
  }

  /* ---------- Cabecera y KPIs ---------- */

  function cabecera() {
    var e = ev();
    var btn = document.getElementById('p-evento-btn');
    if (btn) {
      btn.querySelector('.truncate').textContent = e ? e.titulo : 'Todos los eventos';
      btn.querySelector('.rounded-full').textContent = P.asistentesDe(st.evento).length;
    }
    var gw = P.porTexto('US-EAST (SMS/DKIM)');
    if (gw) gw.textContent = 'Inalambria SMS · Bird Email';
    var desc = P.porTexto('Monitoreo de tasa de entrega, apertura y rebote de correos, gestión de SMS transaccionales y programación de recordatorios automáticos según la fecha del evento.');
    if (desc) desc.textContent = 'Envía SMS por Inalambria y correos por Bird a los asistentes del evento, con plantillas por disparador y trazabilidad de cada envío.';
  }

  function kpis() {
    var env = enviados();
    var ok = env.reduce(function (s, m) { return s + (m.enviados || 0); }, 0);
    var mal = env.reduce(function (s, m) { return s + (m.fallidos || 0); }, 0);
    var total = ok + mal;
    var tarjetas = document.querySelectorAll('main .grid.mb-10 > div');

    function set(card, grande, chip, sub, etiqueta) {
      if (!card) return;
      if (etiqueta) card.querySelector('.uppercase').textContent = etiqueta;
      var g = card.querySelector('.text-headline-xl');
      g.textContent = grande;
      var c = g.nextElementSibling;
      if (c) c.innerHTML = chip;
      card.querySelector('p').textContent = sub;
    }

    set(tarjetas[0], total ? P.pct(ok, total) + '%' : '—', total ? 'Inalambria + Bird' : 'Sin envíos', P.num(ok) + ' de ' + P.num(total) + ' envíos completados');
    var emails = env.filter(function (m) { return m.canal !== 'sms'; });
    set(tarjetas[1], P.num(emails.reduce(function (s, m) { return s + (m.enviados || 0); }, 0)), emails.length + (emails.length === 1 ? ' campaña' : ' campañas'), 'Correos entregados a Bird para envío', 'Emails Enviados');
    set(tarjetas[2], total ? P.pct(mal, total) + '%' : '0%', mal ? 'Revisar' : 'Bajo control', P.num(mal) + ' envíos fallidos en total');
    var sms = env.filter(function (m) { return m.canal !== 'email'; });
    var smsOk = sms.reduce(function (s, m) { return s + (m.enviados || 0); }, 0);
    var conTel = destinatarios('sms').length;
    set(tarjetas[3], P.num(smsOk) + ' / ' + P.num(conTel), conTel ? Math.round(P.pct(smsOk, conTel * Math.max(1, sms.length))) + '%' : '—', conTel + ' asistentes con celular válido', 'SMS Enviados');
  }

  /* ---------- Secuencia ---------- */

  function interruptor(m) {
    return '<button data-m="toggle" class="relative inline-flex items-center cursor-pointer shrink-0" title="' + (m.activo ? 'Desactivar' : 'Activar') + '">' +
      '<div class="w-9 h-5 rounded-full transition-colors ' + (m.activo ? 'bg-secondary' : 'bg-surface-container-highest') + ' relative"><div class="absolute top-[2px] ' + (m.activo ? 'left-[18px]' : 'left-[2px]') + ' bg-on-primary rounded-full h-4 w-4 transition-all"></div></div></button>';
  }

  function tarjetaSecuencia(m, i) {
    var d = DISP[m.disparador] || DISP.manual;
    var cuando = momento(m);
    var falta = cuando ? cuando.getTime() - Date.now() : null;
    var faltaTxt = falta == null ? null : falta > 0
      ? (falta > 864e5 ? Math.floor(falta / 864e5) + ' días y ' + Math.floor((falta % 864e5) / 36e5) + ' horas' : Math.max(1, Math.floor(falta / 36e5)) + ' horas')
      : null;
    var chipFecha = cuando ? P.fechaHora(cuando.toISOString()).replace(', ', ' • ') : d[1];
    var principal = i === 0;
    var cuerpo = m.canal === 'sms'
      ? '<p class="font-body-sm text-body-sm text-on-surface-variant font-mono text-[12px] bg-surface-container/60 p-2 rounded-lg mt-2 leading-relaxed">"' + P.esc(m.cuerpo) + '"</p>'
      : '<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">' + P.esc(m.asunto || (m.cuerpo || '').slice(0, 140)) + '</p>';
    var tira = m.enviado_at
      ? '<div class="bg-surface-container-low/70 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant"><div class="flex items-center gap-6">' +
        '<div><span class="font-label-sm text-[10px] uppercase tracking-wider block text-on-surface-variant/80">Enviados</span><span class="font-label-md text-label-md font-semibold text-on-surface">' + (m.enviados || 0) + '</span></div>' +
        '<div><span class="font-label-sm text-[10px] uppercase tracking-wider block text-on-surface-variant/80">Último envío</span><span class="font-label-md text-label-md font-semibold text-on-surface">' + P.hace(m.enviado_at) + '</span></div>' +
        '<div><span class="font-label-sm text-[10px] uppercase tracking-wider block text-on-surface-variant/80">Fallidos</span><span class="font-label-md text-label-md font-semibold text-on-surface">' + (m.fallidos || 0) + '</span></div></div>'
      : '<div class="bg-surface-container-low/70 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant"><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-[16px] text-secondary">hourglass_top</span><span class="font-body-sm text-body-sm">' +
        (faltaTxt ? 'Disparo en <strong class="text-on-surface">' + faltaTxt + '</strong> · ' + destinatarios(m.canal).length + ' destinatarios.' : 'Listo para enviar a <strong class="text-on-surface">' + destinatarios(m.canal).length + ' destinatarios</strong>.') + '</span></div>';
    tira += '<div class="flex items-center gap-2">' +
      '<button data-m="enviar" class="px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">send</span>Enviar ahora</button>' +
      '<button data-m="editar" class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">edit_note</span>Editar Plantilla</button></div></div>';

    return (
      '<div data-id="' + m.id + '" class="bg-surface-container-lowest rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative z-10 flex flex-col gap-4' + (m.activo ? '' : ' opacity-70') + '">' +
      '<div class="flex items-start justify-between gap-4"><div class="flex items-start gap-3.5 min-w-0">' +
      '<div class="w-9 h-9 rounded-xl ' + (principal ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface') + ' flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[19px]">' + d[0] + '</span></div>' +
      '<div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="font-label-md text-label-md font-bold text-on-surface">' + P.esc(m.titulo || 'Notificación') + '</span>' +
      '<span class="font-label-sm text-[11px] px-2 py-0.5 rounded-full ' + (m.canal === 'email' ? 'bg-surface-container-high text-on-surface-variant font-medium' : 'bg-secondary-fixed text-on-secondary-fixed font-semibold') + '">' + CANAL[m.canal || 'sms'] + '</span>' +
      '<span class="font-label-sm text-[11px] px-2 py-0.5 rounded-full ' + (m.disparador === 'inmediato' ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold' : 'bg-secondary-fixed-dim/40 text-secondary font-semibold') + '">' + P.esc(m.disparador === 'inmediato' ? 'Tiempo Real' : chipFecha) + '</span></div>' +
      cuerpo + '</div></div>' + interruptor(m) + '</div>' + tira + '</div>'
    );
  }

  function pintarSecuencia() {
    var cont = P.porTexto('Secuencia Automática de Evento').closest('section');
    var pista = cont.querySelector('.flex.flex-col.gap-3\\.5.relative');
    var sec = secuencia();
    cont.querySelector('p').textContent = sec.length
      ? sec.filter(function (m) { return m.activo; }).length + ' de ' + sec.length + ' disparadores activos. El envío se hace con “Enviar ahora”.'
      : 'Aún no hay disparadores. Crea la confirmación, recordatorios y el agradecimiento post-evento.';
    pista.innerHTML = '<div class="absolute left-6 top-8 bottom-8 w-0.5 bg-surface-container -z-0"></div>' +
      (sec.length ? sec.map(tarjetaSecuencia).join('') : '<div class="bg-surface-container-lowest rounded-xl shadow-sm relative z-10">' + P.vacio('bolt', 'Sin disparadores', 'Usa “Agregar disparador” para crear el primero.') + '</div>');
    pista.querySelectorAll('[data-id]').forEach(function (card) {
      var m = P.d.mensajes.find(function (x) { return x.id === card.dataset.id; });
      card.querySelectorAll('[data-m]').forEach(function (b) {
        b.addEventListener('click', function () { accion(b.dataset.m, m); });
      });
    });
  }

  /* ---------- Historial ---------- */

  function pill(m) {
    if (m.estado === 'error') return '<span class="font-label-sm text-label-sm text-error bg-error-container/60 px-2 py-0.5 rounded-full font-semibold">Falló el envío</span>';
    if (m.estado === 'parcial') return '<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full font-medium">Entrega parcial</span>';
    if (m.enviado_at) return '<span class="font-label-sm text-label-sm text-on-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Entregado</span>';
    return '<span class="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full font-medium">' + (m.activo === false ? 'Desactivado' : 'Sin enviar') + '</span>';
  }

  function filaLog(m) {
    var e = P.evento(m.evento_id);
    var error = m.estado === 'error';
    return (
      '<div data-id="' + m.id + '" class="p-4 ' + (error ? 'bg-error-container/10 hover:bg-error-container/20' : 'hover:bg-surface-container-low/40') + ' transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container/50">' +
      '<div class="flex items-center gap-3 min-w-0"><div class="w-9 h-9 rounded-full ' + (error ? 'bg-error-container text-error' : m.enviado_at ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface') + ' flex items-center justify-center font-bold text-xs shrink-0">' + P.iniciales(m.titulo || 'N') + '</div>' +
      '<div class="min-w-0"><div class="flex items-center gap-2"><p class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(m.titulo || 'Notificación') + '</p><span class="text-on-surface-variant/40 text-xs">•</span><span class="font-body-sm text-[12px] ' + (error ? 'text-error font-medium' : 'text-on-surface-variant') + ' truncate">' + P.esc(e ? e.titulo : 'Sin evento') + '</span></div>' +
      '<div class="flex items-center gap-2 mt-0.5"><span class="font-body-sm text-body-sm text-on-surface truncate">' + P.esc(m.asunto || (m.cuerpo || '').slice(0, 60)) + '</span><span class="font-label-sm text-[10px] bg-surface-container px-1.5 py-0.2 rounded text-on-surface-variant shrink-0">' + CANAL[m.canal || 'sms'] + '</span></div></div></div>' +
      '<div class="flex items-center gap-4 shrink-0 sm:self-center"><div class="flex flex-col sm:items-end">' + pill(m) +
      '<span class="font-body-sm text-[11px] text-on-surface-variant mt-0.5">' + (m.enviado_at ? (m.enviados || 0) + ' enviados' + (m.fallidos ? ' · ' + m.fallidos + ' fallidos' : '') + ' • ' + P.hace(m.enviado_at).toLowerCase() : 'Creado ' + P.hace(m.created_at).toLowerCase()) + '</span></div>' +
      '<button data-m="ver" class="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">' + (error ? 'forward_to_inbox' : 'visibility') + '</span></button></div></div>'
    );
  }

  function historial() {
    var q = st.q.toLowerCase();
    var base = mensajes();
    var lista = base.filter(function (m) {
      if (st.seg === 'enviados' && !m.enviado_at) return false;
      if (st.seg === 'pendientes' && m.enviado_at) return false;
      if (st.seg === 'fallos' && !(m.fallidos > 0 || m.estado === 'error')) return false;
      if (st.seg === 'sms' && m.canal === 'email') return false;
      if (q && [m.titulo, m.asunto, m.cuerpo].join(' ').toLowerCase().indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) { return String(b.enviado_at || b.created_at).localeCompare(String(a.enviado_at || a.created_at)); });

    var segs = P.porTexto('Historial & Registro de Envíos').closest('section').querySelectorAll('.overflow-x-auto.p-1 > button');
    var cuentas = {
      todos: base.length,
      enviados: base.filter(function (m) { return m.enviado_at; }).length,
      pendientes: base.filter(function (m) { return !m.enviado_at; }).length,
      fallos: base.filter(function (m) { return m.fallidos > 0 || m.estado === 'error'; }).length,
      sms: base.filter(function (m) { return m.canal !== 'email'; }).length,
    };
    var nombres = [['todos', 'Todos'], ['enviados', 'Enviados'], ['pendientes', 'Sin enviar'], ['fallos', 'Con fallos'], ['sms', 'SMS']];
    segs.forEach(function (b, i) {
      var k = nombres[i][0];
      b.textContent = nombres[i][1] + ' (' + cuentas[k] + ')';
      var on = st.seg === k;
      b.className = 'px-3 py-1.5 rounded-lg font-label-sm text-label-sm ' + (on ? 'bg-primary text-on-primary font-semibold' : 'hover:bg-surface-container-low ' + (k === 'fallos' ? 'text-error' : 'text-on-surface-variant'));
      b.onclick = function () { st.seg = k; historial(); };
    });

    var cont = P.porTexto('Historial & Registro de Envíos').closest('section').lastElementChild;
    cont.innerHTML = lista.length ? lista.map(filaLog).join('') : P.vacio('outbox', 'No hay envíos en esta vista', 'Cuando envíes una notificación aparecerá aquí con su resultado.');
    cont.querySelectorAll('[data-id]').forEach(function (fila) {
      var m = P.d.mensajes.find(function (x) { return x.id === fila.dataset.id; });
      fila.querySelector('[data-m=ver]').addEventListener('click', function () { detalle(m); });
    });
  }

  function detalle(m) {
    P.modal({
      titulo: m.titulo || 'Notificación',
      subtitulo: CANAL[m.canal || 'sms'] + (m.enviado_at ? ' · enviado ' + P.fechaHora(m.enviado_at) : ' · sin enviar'),
      texto: (m.asunto ? 'Asunto: ' + m.asunto + '\n' : '') + (m.cuerpo || '') + (m.error ? '  —  Error: ' + m.error : ''),
      campos: [],
      textoGuardar: m.enviado_at ? 'Reenviar' : 'Enviar ahora',
      onGuardar: function () { enviar(m); return true; },
      onEliminar: function () { return borrar(m); },
    });
  }

  /* ---------- Acciones ---------- */

  function formMensaje(m, tipo) {
    var eventos = P.d.eventos.map(function (e) { return { v: e.id, l: e.titulo }; });
    P.modal({
      titulo: m ? 'Editar Plantilla' : tipo === 'secuencia' ? 'Agregar disparador' : 'Crear Notificación',
      subtitulo: 'Variables: ' + VARS,
      campos: [
        { nombre: 'titulo', etiqueta: 'Nombre interno', requerido: true, placeholder: 'Ej. Recordatorio T-2h con QR' },
        { nombre: 'evento_id', etiqueta: 'Evento', tipo: 'select', opciones: eventos, mitad: true },
        { nombre: 'canal', etiqueta: 'Canal', tipo: 'select', mitad: true, opciones: [{ v: 'sms', l: 'SMS (Inalambria)' }, { v: 'email', l: 'Email (Bird)' }, { v: 'email_sms', l: 'Email + SMS' }] },
        { nombre: 'tipo', etiqueta: 'Tipo', tipo: 'select', mitad: true, opciones: [{ v: 'secuencia', l: 'Disparador de la secuencia' }, { v: 'envio', l: 'Envío único' }] },
        { nombre: 'disparador', etiqueta: 'Cuándo', tipo: 'select', mitad: true, opciones: Object.keys(DISP).map(function (k) { return { v: k, l: DISP[k][1] }; }) },
        { nombre: 'asunto', etiqueta: 'Asunto del correo', placeholder: 'Solo para email' },
        { nombre: 'cuerpo', etiqueta: 'Mensaje', tipo: 'textarea', filas: 5, requerido: true, defecto: 'Hola {primer_nombre}, ' },
        { nombre: 'activo', etiqueta: 'Activo', tipo: 'checkbox', defecto: true },
      ],
      valores: m || { evento_id: st.evento || P.eventoActualId(), canal: 'sms', tipo: tipo || 'envio', disparador: tipo === 'secuencia' ? 't-2h' : 'manual', activo: true },
      textoGuardar: m ? 'Guardar plantilla' : 'Crear',
      onGuardar: function (v) {
        if (!m) v.estado = 'borrador';
        var req = m ? P.editar('evento_mensajes', m.id, v) : P.crear('evento_mensajes', v);
        return req.then(function (r) {
          if (!r.ok) return false;
          P.toast(m ? 'Plantilla guardada' : 'Notificación creada');
          recargar();
          return true;
        });
      },
      onEliminar: m ? function () { return borrar(m); } : null,
    });
  }

  function borrar(m) {
    return P.confirmar('Eliminar notificación', '“' + (m.titulo || 'Notificación') + '” se borrará junto con su registro de envío.', 'Eliminar').then(function (ok) {
      if (!ok) return false;
      return P.eliminar('evento_mensajes', m.id).then(function (r) { if (r.ok) { P.toast('Notificación eliminada'); recargar(); } return r.ok; });
    });
  }

  function enviar(m) {
    var st0 = st.evento;
    st.evento = m.evento_id;
    var n = destinatarios(m.canal || 'sms').length;
    st.evento = st0;
    if (!m.evento_id) return P.toast('Asigna un evento a la notificación', 'error');
    if (!n) return P.toast('No hay asistentes con datos de contacto para este canal', 'error');
    var costo = m.canal !== 'email' ? ' Cada SMS descuenta saldo de Inalambria.' : '';
    P.confirmar('Enviar ahora', 'Se enviará “' + (m.titulo || 'la notificación') + '” a ' + n + ' asistentes.' + costo, 'Enviar a ' + n).then(function (ok) {
      if (!ok) return;
      P.toast('Enviando… no cierres la página');
      P.op({ op: 'enviar_mensaje', id: m.id }).then(function (r) {
        if (r.enviados != null) P.toast(r.enviados + ' enviados' + (r.fallidos ? ', ' + r.fallidos + ' fallidos' : ''), r.ok ? null : 'error');
        recargar();
      });
    });
  }

  function accion(acc, m) {
    if (acc === 'editar') return formMensaje(m);
    if (acc === 'enviar') return enviar(m);
    if (acc === 'toggle') {
      P.editar('evento_mensajes', m.id, { activo: !m.activo }).then(function (r) { if (r.ok) { P.toast(m.activo ? 'Disparador desactivado' : 'Disparador activado'); recargar(); } });
    }
  }

  /* ---------- Editor rápido y SMS de prueba ---------- */

  function editor() {
    var card = P.tarjeta('Editor Rápido de Plantilla');
    if (!card || card.dataset.p) return;
    card.dataset.p = '1';
    var burbuja = card.querySelector('.bg-secondary-fixed\\/30');
    var contador = P.porTexto('142 / 160 caracteres (1 segmento)', card);
    var plantilla = secuencia().find(function (m) { return m.canal !== 'email'; });
    var e = ev();
    var texto = plantilla ? plantilla.cuerpo : 'Hola {Nombre}, tu acceso a ' + (e ? e.titulo : 'nuestro evento') + ' está confirmado. Tu código de ingreso: {Link_QR}';
    burbuja.innerHTML = '<span class="font-semibold block mb-0.5 text-secondary">Synergy:</span><textarea id="p-sms" rows="5" class="w-full bg-transparent outline-none resize-none text-[13px] leading-relaxed text-on-secondary-fixed"></textarea>';
    var ta = burbuja.querySelector('textarea');
    ta.value = texto;
    function contar() {
      var n = ta.value.length;
      var seg = n <= 160 ? 1 : Math.ceil(n / 153);
      if (contador) contador.textContent = n + ' / ' + (seg * (seg > 1 ? 153 : 160)) + ' caracteres (' + seg + (seg === 1 ? ' segmento)' : ' segmentos)');
    }
    ta.addEventListener('input', contar);
    contar();
    var rem = P.porTexto('Remitente: 88201', card);
    if (rem) rem.textContent = 'Remitente: Inalambria';
    var hora = P.porTexto('Hoy 16:02', card);
    if (hora) hora.textContent = 'Hoy ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

    card.querySelectorAll('button.font-mono').forEach(function (b) {
      b.addEventListener('click', function () { ta.setRangeText(b.textContent.trim(), ta.selectionStart, ta.selectionEnd, 'end'); ta.focus(); contar(); });
    });
    var tog = card.querySelectorAll('.bg-surface-container-low.p-1 > button');
    tog.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.textContent.trim() === 'Email') return formMensaje(null, 'envio');
      });
    });

    var tel = card.querySelector('input[type=text]');
    tel.placeholder = '300 123 4567';
    P.on(P.boton('Probar Test SMS', card), function () {
      var muestra = (P.asistentesDe(st.evento)[0]) || { nombre: 'Prueba' };
      var e2 = ev() || {};
      var final = ta.value
        .split('{Nombre}').join(muestra.nombre || 'Prueba')
        .split('{primer_nombre}').join(String(muestra.nombre || 'Prueba').split(' ')[0])
        .split('{Tipo_Ticket}').join('General')
        .split('{Fecha_Evento}').join(e2.fecha || '')
        .split('{Ubicacion_Mapa}').join(e2.lugar || e2.ciudad || '')
        .split('{Link_QR}').join(e2.checkin_slug ? 'snrg.lat/checkin?event=' + e2.checkin_slug : 'snrg.lat');
      P.op({ op: 'sms_prueba', telefono: tel.value, texto: final }).then(function (r) { if (r.ok) P.toast('SMS de prueba enviado'); });
    });
    var guardar = document.createElement('button');
    guardar.className = 'w-full h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors';
    guardar.innerHTML = '<span class="material-symbols-outlined text-[16px]">save</span>Guardar como disparador SMS';
    card.appendChild(guardar);
    guardar.addEventListener('click', function () {
      formMensaje(null, 'secuencia');
      setTimeout(function () {
        var f = document.querySelector('form [name=cuerpo]');
        if (f) f.value = ta.value;
      }, 0);
    });
  }

  function consejo() {
    var t = P.porTexto('Recomendación para Alta Apertura');
    if (!t) return;
    t.textContent = 'Recomendación para la puerta';
    t.nextElementSibling.innerHTML = 'Un <strong>SMS T-2h con el enlace de check-in</strong> reduce la fila de acreditación: el asistente llega con su código listo y en puerta solo se valida.';
  }

  function pintar() {
    cabecera();
    kpis();
    pintarSecuencia();
    historial();
    editor();
  }

  function recargar() { P.cargar().then(pintar); }

  function controles() {
    var main = document.querySelector('main');
    var evBtn = P.porTexto('Evento Activo');
    evBtn = evBtn ? evBtn.closest('button') : null;
    if (evBtn) {
      evBtn = P.on(evBtn, function (e, el) {
        P.elegirEvento(el, function (id) { st.evento = id; pintar(); }, { todos: true, actual: st.evento });
      });
      evBtn.id = 'p-evento-btn';
    }
    var dkim = P.on(P.boton('Configuración DKIM', main), function () {
      document.getElementById('sms-status').closest('.rounded-xl').scrollIntoView({ behavior: 'smooth' });
    });
    dkim.querySelectorAll('span')[1].textContent = 'Saldo SMS';
    dkim.querySelector('.material-symbols-outlined').textContent = 'account_balance_wallet';
    P.on(P.boton('Crear Notificación', main), function () { formMensaje(null, 'envio'); });
    var reord = P.on(P.boton('Reordenar Flujos', main), function () { formMensaje(null, 'secuencia'); });
    reord.querySelector('span').textContent = 'Agregar disparador';
    reord.querySelector('.material-symbols-outlined').textContent = 'add';
    P.on(P.boton('Exportar CSV', main), function () {
      P.csv('notificaciones-synergy.csv', mensajes().map(function (m) {
        var e = P.evento(m.evento_id);
        return { titulo: m.titulo, evento: e ? e.titulo : '', canal: m.canal, tipo: m.tipo, disparador: m.disparador, estado: m.estado, enviados: m.enviados, fallidos: m.fallidos, enviado_at: m.enviado_at || '', mensaje: m.cuerpo };
      }));
    });
    var buscar = main.querySelector('input[placeholder^="Buscar por destinatario"]');
    buscar.placeholder = 'Buscar por nombre, asunto o mensaje...';
    buscar.addEventListener('input', function () { st.q = buscar.value; historial(); });
    consejo();
  }

  controles();
  P.iniciar(function () {
    st.evento = P.eventoActualId();
    pintar();
  });
})();
