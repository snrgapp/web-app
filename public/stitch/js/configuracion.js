(function () {
  window.P_PAGINA = 'configuracion';
  var st = { evento: null, dirty: false };

  function ev() { return P.evento(st.evento); }

  function marcarDirty(on) {
    st.dirty = on !== false;
    document.querySelectorAll('main span, main p').forEach(function (n) {
      if (n.children.length === 0 && n.textContent.indexOf('Tienes cambios') !== -1) {
        n.textContent = st.dirty ? 'Tienes cambios pendientes sin guardar' : 'Todos los cambios están guardados';
      }
    });
  }

  function guardar(valores, msg) {
    var e = ev();
    if (!e) return Promise.resolve(false);
    return P.editar('eventos', e.id, valores).then(function (r) {
      if (!r.ok) return false;
      Object.assign(e, r.fila || valores);
      marcarDirty(false);
      if (msg) P.toast(msg);
      pintar();
      return true;
    });
  }

  function slugInput() {
    var box = document.getElementById('visibilidad');
    return box ? box.querySelector('input[type=text]') : null;
  }

  function capInput() {
    var box = document.getElementById('aforo');
    return box ? box.querySelector('input[type=number]') : null;
  }

  function estadoSelect() {
    var box = document.getElementById('visibilidad');
    return box ? box.querySelector('select') : null;
  }

  function deEstado(e) {
    if (!e) return 'draft';
    if (e.estado === 'borrador') return 'draft';
    if (e.estado === 'archivado' || e.estado === 'cancelado') return 'cancelled';
    if (e.estado === 'oculto') return 'hidden';
    return 'published';
  }

  function aEstado(v) {
    return { published: 'activo', hidden: 'oculto', draft: 'borrador', cancelled: 'archivado' }[v] || 'activo';
  }

  function portada() {
    var e = ev();
    var card = document.getElementById('portada');
    if (!card || !e) return;
    var img = card.querySelector('img');
    if (img && e.image_url) img.src = e.image_url;
    card.querySelectorAll('span, p').forEach(function (n) {
      if (n.children.length) return;
      if (n.textContent.indexOf('Tech Founders') !== -1) n.textContent = e.titulo;
    });
  }

  function visibilidad() {
    var e = ev();
    if (!e) return;
    var tog = document.getElementById('publicToggle');
    if (tog) tog.checked = e.estado === 'activo' && e.inscripcion_abierta !== false;
    var sel = estadoSelect();
    if (sel) sel.value = deEstado(e);
    var slug = slugInput();
    if (slug) slug.value = e.checkin_slug || '';
    document.querySelectorAll('#visibilidad span, #visibilidad p').forEach(function (n) {
      if (n.children.length) return;
      if (n.textContent.indexOf('Activo en línea') !== -1) n.textContent = e.estado === 'activo' ? 'Activo en línea' : 'No publicado';
      if (n.textContent.indexOf('Abierto a la comunidad') !== -1) {
        n.textContent = tog && tog.checked ? 'Abierto a la comunidad' : 'Solo con enlace directo';
      }
    });
  }

  function aforo() {
    var e = ev();
    if (!e) return;
    var n = P.asistentesDe(st.evento).length;
    var cap = Number(e.capacidad) || 0;
    var inp = capInput();
    if (inp && document.activeElement !== inp) inp.value = cap || n || '';
    document.querySelectorAll('#aforo span, #aforo p').forEach(function (nodo) {
      if (nodo.children.length) return;
      if (nodo.textContent.indexOf('ya emitidas') !== -1) {
        nodo.textContent = n + ' ya emitidas' + (cap ? ' (' + P.pct(n, cap) + '% lleno)' : '');
      }
    });
    var waits = document.querySelectorAll('#aforo input.sr-only.peer');
    if (waits.length) {
      var last = waits[waits.length - 1];
      last.checked = !!e.lista_espera;
    }
  }

  function staffDelEvento() {
    return (P.d.staff || []).filter(function (s) { return s.evento_id === st.evento; });
  }

  function filaStaff(s) {
    var roles = {
      cohost: ['how_to_reg', 'bg-secondary-fixed text-on-secondary-fixed', 'Co-Host / Acceso Check-in & Edición'],
      puerta: ['qr_code_scanner', 'bg-surface-container-high text-on-surface', 'Staff de Puerta / Solo Escaneo QR'],
      viewer: ['visibility', 'bg-surface-container text-on-surface', 'Solo Lectura / Reportes'],
    };
    var r = roles[s.rol] || roles.puerta;
    var ini = P.iniciales(s.nombre || s.email, '');
    return (
      '<div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
      '<div class="flex items-center gap-3 min-w-0"><div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-label-md text-label-md text-on-secondary font-bold shrink-0">' + P.esc(ini) + '</div>' +
      '<div class="min-w-0"><p class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(s.nombre || s.email) + '</p>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant truncate">' + P.esc(s.email) + '</p></div></div>' +
      '<div class="flex items-center justify-between sm:justify-end gap-3">' +
      '<span class="font-label-sm text-label-sm px-2.5 py-1 rounded-full ' + r[1] + ' font-medium flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">' + r[0] + '</span>' + r[2] + '</span>' +
      '<button data-rm="' + s.id + '" class="w-8 h-8 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 flex items-center justify-center transition-colors" title="Revocar acceso"><span class="material-symbols-outlined text-[18px]">person_remove</span></button>' +
      '</div></div>'
    );
  }

  function staff() {
    var lista = document.getElementById('p-staff-lista');
    if (!lista) return;
    var email = (P.d.usuario && P.d.usuario.email) || '';
    var yo =
      '<div class="p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
      '<div class="flex items-center gap-3 min-w-0"><div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-label-md text-label-md text-on-primary font-bold shrink-0">' +
      P.esc(P.iniciales(email.split('@')[0], '')) + '</div><div class="min-w-0"><div class="flex items-center gap-2">' +
      '<p class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(email.split('@')[0] || 'Tú') + '</p>' +
      '<span class="font-label-sm text-label-sm bg-primary text-on-primary px-2 py-0.2 rounded-full">Tú</span></div>' +
      '<p class="font-body-sm text-body-sm text-on-surface-variant truncate">' + P.esc(email) + '</p></div></div>' +
      '<span class="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px]">shield_person</span>Creador / Administrador Principal</span></div>';
    var otros = staffDelEvento();
    lista.innerHTML = yo + otros.map(filaStaff).join('');
    lista.querySelectorAll('[data-rm]').forEach(function (b) {
      b.addEventListener('click', function () {
        P.eliminar('evento_staff', b.getAttribute('data-rm')).then(function (r) {
          if (!r.ok) return;
          P.d.staff = (P.d.staff || []).filter(function (s) { return s.id !== b.getAttribute('data-rm'); });
          P.toast('Acceso revocado');
          staff();
        });
      });
    });
    document.querySelectorAll('#cohosts span').forEach(function (s) {
      if (/^\d+$/.test(s.textContent.trim()) && s.previousElementSibling && /Staff/.test(s.previousElementSibling.textContent || '')) {
        s.textContent = String(1 + otros.length);
      }
    });
  }

  function hero() {
    var e = ev();
    var h1 = document.querySelector('main h1');
    if (h1) h1.textContent = e ? e.titulo : 'Sin evento';
    document.querySelectorAll('main span').forEach(function (s) {
      if (s.children.length) return;
      if (s.textContent.indexOf('EVT-') === 0) s.textContent = e && e.checkin_slug ? e.checkin_slug : 'sin-slug';
      if (s.textContent.trim() === 'Publicado' || s.textContent.trim() === 'Borrador') {
        var map = { activo: 'Publicado', borrador: 'Borrador', archivado: 'Archivado', oculto: 'Oculto', cancelado: 'Cancelado' };
        s.textContent = map[e && e.estado] || 'Borrador';
      }
    });
  }

  function leerForm() {
    var e = ev() || {};
    var sel = estadoSelect();
    var slug = slugInput();
    var cap = capInput();
    var pub = document.getElementById('publicToggle');
    var out = {
      estado: aEstado(sel ? sel.value : deEstado(e)),
      checkin_slug: slug ? slug.value.trim() : e.checkin_slug,
      capacidad: cap && cap.value !== '' ? Number(cap.value) : null,
      inscripcion_abierta: pub ? pub.checked && (sel ? sel.value === 'published' : true) : e.inscripcion_abierta,
    };
    var waits = document.querySelectorAll('#aforo input.sr-only.peer');
    if (waits.length) out.lista_espera = waits[waits.length - 1].checked;
    return out;
  }

  function bind() {
    ['saveTopBtn', 'saveBottomBtn'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', function () { guardar(leerForm(), 'Configuración guardada'); });
    });
    var copy = document.getElementById('copyUrlBtn');
    if (copy) copy.addEventListener('click', function () {
      var e = ev();
      var url = location.origin + '/evento/' + encodeURIComponent((e && e.checkin_slug) || '');
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      var t = document.getElementById('copyUrlText');
      if (t) t.textContent = 'Copiado';
      setTimeout(function () { if (t) t.textContent = 'Copiar Enlace'; }, 1600);
      P.toast('Enlace copiado');
    });
    P.on(P.boton('Vista Previa Pública'), function () {
      var e = ev();
      if (e) window.open('/evento/' + encodeURIComponent(e.checkin_slug || ''), '_blank');
    });
    P.on(P.boton('Probar'), function () {
      var e = ev();
      if (e) window.open('/evento/' + encodeURIComponent(e.checkin_slug || ''), '_blank');
    });
    P.on(P.boton('Subir Nueva Foto'), function () {
      var e = ev();
      if (!e) return;
      P.modal({
        titulo: 'Imagen de portada',
        campos: [{ nombre: 'image_url', etiqueta: 'URL de la imagen', placeholder: 'https://…', ayuda: 'Pega el enlace público (16:9).' }],
        valores: e,
        onGuardar: function (v) { return guardar(v, 'Portada actualizada'); },
      });
    });
    var quitar = P.boton('Quitar', document.getElementById('portada'));
    if (quitar) P.on(quitar, function () { guardar({ image_url: '' }, 'Portada eliminada'); });
    P.on(P.boton('Duplicar Configuración'), function () {
      var e = ev();
      if (!e) return;
      P.op({ op: 'duplicar_evento', id: e.id }).then(function (r) {
        if (!r.ok) return;
        P.toast('Evento duplicado como borrador');
        if (r.fila && r.fila.id) {
          localStorage.setItem('snrg_evento', r.fila.id);
          location.reload();
        }
      });
    });
    P.on(P.boton('Pausar Admisiones'), function () {
      guardar({ inscripcion_abierta: false }, 'Inscripciones pausadas');
    });
    P.on(P.boton('Eliminar Evento'), function () {
      var e = ev();
      if (!e) return;
      P.borrarEvento(e, function () { location.href = '/stitch/dashboard.html'; });
    });
    P.on(P.boton('Descartar'), function () { pintar(); marcarDirty(false); P.toast('Cambios descartados'); });
    P.on(P.boton('Invitar Staff'), function () {
      var form = document.getElementById('inlineInviteForm');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var inp = document.getElementById('p-invite-email');
      if (inp) inp.focus();
    });
    var enviarStaff = document.querySelector('#inlineInviteForm button');
    if (enviarStaff) enviarStaff.addEventListener('click', function () {
      var email = (document.getElementById('p-invite-email') || {}).value;
      var rol = (document.getElementById('p-invite-rol') || {}).value || 'puerta';
      if (!email || String(email).indexOf('@') === -1) { P.toast('Escribe un correo válido', 'error'); return; }
      P.crear('evento_staff', { evento_id: st.evento, email: email, rol: rol }).then(function (r) {
        if (!r.ok) return;
        P.d.staff = (P.d.staff || []).filter(function (s) { return s.id !== r.fila.id; }).concat([r.fila]);
        document.getElementById('p-invite-email').value = '';
        staff();
        if (r.convite && r.convite.ok === false) P.toast('Guardado, pero el correo no salió: ' + (r.convite.error || ''), 'error');
        else P.toast('Invitación enviada a ' + email);
      });
    });
    var chk24 = document.getElementById('p-chk-pase-24h');
    if (chk24) {
      chk24.checked = ev() ? ev().pase_recordatorio !== false : true;
      chk24.addEventListener('change', function () {
        guardar({ pase_recordatorio: chk24.checked }, chk24.checked ? 'El QR se enviará el día anterior' : 'Recordatorio de QR desactivado');
      });
    }
    var ntf = document.getElementById('notificaciones');
    if (ntf && !document.getElementById('p-enviar-pases')) {
      var bar = document.createElement('div');
      bar.className = 'flex items-center justify-between gap-3 pt-1';
      bar.innerHTML = '<p class="font-body-sm text-body-sm text-on-surface-variant">El cron envía el pase QR el día anterior. También puedes dispararlo ahora.</p>' +
        '<button id="p-enviar-pases" type="button" class="h-9 px-3.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shrink-0">Enviar pases ahora</button>';
      ntf.appendChild(bar);
      document.getElementById('p-enviar-pases').addEventListener('click', function () {
        P.op({ op: 'enviar_pases', id: st.evento }).then(function (r) {
          if (!r.ok && !r.enviados) { P.toast(r.error || 'No se enviaron pases', 'error'); return; }
          P.toast('Pases enviados: ' + (r.enviados || 0) + (r.fallidos ? ' · fallidos ' + r.fallidos : ''));
        });
      });
    }
    var form = document.getElementById('visibilidad');
    if (form) form.addEventListener('change', function () { marcarDirty(true); });
    var aforoBox = document.getElementById('aforo');
    if (aforoBox) aforoBox.addEventListener('change', function () { marcarDirty(true); });
    var slug = slugInput();
    if (slug) slug.addEventListener('input', function () { marcarDirty(true); });
  }

  function pintar() {
    hero();
    portada();
    visibilidad();
    aforo();
    staff();
  }

  P.iniciar(function () {
    st.evento = P.eventoActualId();
    P.pestaniasEvento(st.evento);
    bind();
    pintar();
    marcarDirty(false);
  });
})();
