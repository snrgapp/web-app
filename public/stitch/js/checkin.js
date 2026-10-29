(function () {
  window.P_PAGINA = 'checkin';
  var POR_PAGINA = 5;
  var st = { evento: null, filtro: 'all', q: '', pagina: 1, detectado: null, puerta: null, cam: null, facing: 'environment' };

  function lista() {
    return P.asistentesDe(st.evento);
  }

  function puerta(a) {
    var e = P.estadoAsistente(a);
    if (e === 'checkin') return 'checked';
    if (e === 'pago_pendiente' || e === 'por_aprobar' || e === 'lista_espera' || e === 'rechazado') return 'pending-payment';
    return 'pending-gate';
  }

  function filtrados() {
    var q = st.q.toLowerCase();
    return lista().filter(function (a) {
      var p = puerta(a);
      if (st.filtro !== 'all' && p !== st.filtro) return false;
      if (q) {
        var txt = [P.nombre(a), a.correo, a.empresa, P.ticketId(a)].join(' ').toLowerCase();
        if (txt.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function pagados(a) {
    var e = P.estadoAsistente(a);
    return e === 'checkin' || e === 'confirmado';
  }

  function marcar(a, recargar) {
    if (!pagados(a)) {
      P.toast('Este pase no está autorizado: el pago sigue pendiente.', 'error');
      return Promise.resolve(false);
    }
    var req = st.puerta
      ? fetch('/api/puerta/' + encodeURIComponent(st.puerta), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asistente_id: a.id }),
        }).then(function (r) { return r.json(); })
      : P.editar('asistentes', a.id, { checked_in_at: new Date().toISOString() });
    return req.then(function (r) {
      if (!r.ok) {
        P.toast(r.error || 'No se pudo registrar el ingreso', 'error');
        return false;
      }
      a.checked_in_at = r.fila && r.fila.checked_in_at ? r.fila.checked_in_at : new Date().toISOString();
      P.toast('Check-in de ' + P.nombre(a));
      mostrarValidacion(a, true);
      if (recargar !== false) pintar();
      return true;
    });
  }

  function mostrarValidacion(a, ok) {
    var box = document.getElementById('validation-feedback');
    var nom = document.getElementById('feedback-name');
    var msg = document.getElementById('feedback-msg');
    if (!box) return;
    box.classList.remove('hidden');
    if (nom) nom.textContent = a ? P.nombre(a) : '';
    if (msg) {
      msg.textContent = ok && a
        ? '✓ Check-in exitoso • Ticket ' + P.ticketId(a) + ' validado a las ' +
          new Date(a.checked_in_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' }) + ' hrs'
        : 'No encontramos un pase autorizado con esa clave.';
    }
  }

  function buscarClave(clave) {
    var q = String(clave || '').trim().toLowerCase().replace(/^#/, '');
    if (!q) return null;
    var m = q.match(/\/pase\/([a-z0-9]+)/);
    if (m) q = m[1];
    var hits = lista().filter(function (a) {
      var tk = P.ticketId(a).toLowerCase().replace(/^#/, '');
      var token = String(a.ticket_token || '').toLowerCase();
      var txt = [P.nombre(a), a.correo, a.telefono, tk, token, String(a.id)].join(' ').toLowerCase();
      return txt.indexOf(q) !== -1 || (token && (q.indexOf(token) !== -1 || token.indexOf(q) !== -1));
    });
    return hits[0] || null;
  }

  function encabezado() {
    var e = P.evento(st.evento);
    var h1 = document.querySelector('main h1');
    if (h1) h1.textContent = e ? e.titulo : 'Sin evento';
    var desc = h1 && h1.nextElementSibling;
    if (desc && desc.tagName === 'P') desc.textContent = e && e.acerca_del_evento ? e.acerca_del_evento : 'Portal de staff para validar ingresos en puerta.';
    document.querySelectorAll('main span, main p').forEach(function (n) {
      if (n.children.length) return;
      var t = n.textContent.trim();
      if (t.indexOf('Octubre 18') === 0 || t.indexOf('calendar_today') !== -1) return;
    });
    var fechaNodo = null;
    document.querySelectorAll('main .material-symbols-outlined').forEach(function (ic) {
      if (ic.textContent.trim() === 'calendar_today') fechaNodo = ic.parentNode.querySelector('span:last-child') || ic.nextElementSibling;
      if (ic.textContent.trim() === 'location_on') {
        var loc = ic.parentNode.querySelector('span:last-child') || ic.nextElementSibling;
        if (loc && loc !== ic) loc.textContent = (e && (e.lugar || e.ciudad)) || 'Sede por confirmar';
      }
    });
    if (fechaNodo && e) fechaNodo.textContent = P.fechaLarga(e.fecha, e.hora_inicio);
    var email = (P.d.usuario && P.d.usuario.email) || '';
    document.querySelectorAll('main p, main span').forEach(function (n) {
      if (n.children.length === 0 && n.textContent.indexOf('Alex Rivera') !== -1) {
        n.textContent = n.textContent.replace('Alex Rivera', email.split('@')[0] || 'Anfitrión');
      }
    });
  }

  function countdown() {
    var e = P.evento(st.evento);
    var days = document.getElementById('count-days');
    var hours = document.getElementById('count-hours');
    var mins = document.getElementById('count-minutes');
    if (!days || !e || !e.fecha) {
      if (days) days.textContent = '—';
      if (hours) hours.textContent = '—';
      if (mins) mins.textContent = '—';
      return;
    }
    var iso = e.fecha + 'T' + (e.hora_inicio || '18:00') + ':00-05:00';
    var left = Math.max(0, new Date(iso).getTime() - Date.now());
    var d = Math.floor(left / 864e5);
    var h = Math.floor((left % 864e5) / 36e5);
    var m = Math.floor((left % 36e5) / 6e4);
    days.textContent = String(d).padStart(2, '0');
    hours.textContent = String(h).padStart(2, '0');
    mins.textContent = String(m).padStart(2, '0');
  }

  function metricas() {
    var l = lista();
    var check = l.filter(function (a) { return a.checked_in_at; }).length;
    var ok = l.filter(pagados).length;
    var pend = l.length - ok;
    var cap = Number((P.evento(st.evento) || {}).capacidad) || 0;
    var el = document.getElementById('metric-checkins');
    if (el) {
      el.textContent = check;
      var den = el.nextElementSibling;
      if (den) den.textContent = '/ ' + ok;
      var caja = el.parentNode.parentNode;
      var barra = caja.querySelector('.bg-primary');
      if (barra && barra.className.indexOf('h-1') !== -1) {
        barra.style.width = (ok ? Math.min(100, Math.round((check / ok) * 100)) : 0) + '%';
      }
      var spans = caja.querySelectorAll('span');
      spans.forEach(function (s) {
        if (/%/.test(s.textContent) && s !== den) s.textContent = (ok ? P.pct(check, ok) : 0) + '% concurrencia';
      });
    }
    document.querySelectorAll('main span, main p, main div').forEach(function (n) {
      if (n.children.length > 2) return;
      var t = n.textContent.trim();
      if (t.indexOf('78 butacas') !== -1 || t === '64.5%') {
        var libres = cap ? Math.max(0, cap - check) : Math.max(0, ok - check);
        if (t.indexOf('butacas') !== -1) n.textContent = libres + ' butacas libres';
        else n.textContent = (cap ? P.pct(check, cap) : (ok ? P.pct(check, ok) : 0)) + '%';
      }
      if (t === '200 Inscritos') n.textContent = l.length + ' Inscritos';
      if (t === '184 (92%)') n.textContent = ok + ' (' + P.pct(ok, l.length || 1) + '%)';
      if (t === '16 (8%)') n.textContent = pend + ' (' + P.pct(pend, l.length || 1) + '%)';
      if (t.indexOf('Aforo máximo') !== -1) n.textContent = 'Aforo máximo recinto: ' + (cap || 'sin límite') + (cap ? ' plazas' : '');
    });
  }

  function fila(a) {
    var p = puerta(a);
    var ini = P.iniciales(a.nombre, a.apellido);
    var vip = /vip/i.test(a.tipo_ticket || '');
    var ticketCls = vip
      ? 'bg-secondary-fixed text-on-secondary-fixed'
      : 'bg-surface-container text-on-surface';
    var pago = pagados(a)
      ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-on-tertiary-container/10 text-on-tertiary-container font-label-sm text-label-sm font-semibold"><span class="material-symbols-outlined text-[14px]">check</span>Pago Verificado</span>'
      : '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold"><span class="material-symbols-outlined text-[14px]">hourglass_empty</span>Comprobante Pendiente</span>';
    var puertaHtml;
    if (p === 'checked') {
      var h = new Date(a.checked_in_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' });
      puertaHtml = '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface"><span class="w-2 h-2 rounded-full bg-on-tertiary-container"></span>Ingresado ✓ (' + h + ')</span>';
    } else if (p === 'pending-payment') {
      puertaHtml = '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-outline font-label-sm text-label-sm cursor-not-allowed"><span class="material-symbols-outlined text-[14px]">block</span>No Autorizado</span>';
    } else {
      puertaHtml = '<button data-ci="' + a.id + '" class="h-8 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-sm text-label-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95"><span class="material-symbols-outlined text-[15px]">how_to_reg</span><span>Marcar Check-in</span></button>';
    }
    var avCls = p === 'checked' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface';
    return (
      '<tr class="hover:bg-surface-container-low/60 transition-colors' + (p === 'pending-payment' ? ' opacity-80' : '') + '" data-status="' + p + '">' +
      '<td class="py-3.5 px-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full ' + avCls + ' flex items-center justify-center font-label-md text-label-md">' + P.esc(ini) + '</div>' +
      '<div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(P.nombre(a)) + '</span>' +
      '<span class="font-body-sm text-body-sm text-on-surface-variant truncate">' + P.esc(a.correo || 'Sin correo') + '</span></div></div></td>' +
      '<td class="py-3.5 px-4"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full ' + ticketCls + ' font-label-sm text-label-sm font-medium">' + P.esc(a.tipo_ticket || 'General') + '</span></td>' +
      '<td class="py-3.5 px-4">' + pago + '</td>' +
      '<td class="py-3.5 px-4">' + puertaHtml + '</td>' +
      '<td class="py-3.5 px-4"><code class="font-label-sm text-label-sm font-mono text-on-surface bg-surface-container px-2 py-0.5 rounded">' + P.esc(P.ticketId(a)) + '</code></td></tr>'
    );
  }

  function tabla() {
    var rows = filtrados();
    var tbody = document.getElementById('attendees-table-body');
    if (!tbody) return;
    var ini = (st.pagina - 1) * POR_PAGINA;
    var page = rows.slice(ini, ini + POR_PAGINA);
    tbody.innerHTML = page.length
      ? page.map(fila).join('')
      : '<tr><td colspan="5">' + P.vacio('qr_code_scanner', 'Nadie en esta vista', 'Cambia el filtro o espera a que lleguen asistentes.') + '</td></tr>';
    tbody.querySelectorAll('[data-ci]').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = lista().find(function (x) { return x.id === b.getAttribute('data-ci'); });
        if (a) marcar(a);
      });
    });
    var l = lista();
    var c = { all: l.length, checked: 0, 'pending-gate': 0, 'pending-payment': 0 };
    l.forEach(function (a) { c[puerta(a)]++; });
    document.querySelectorAll('#filter-container .filter-btn').forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var labels = { all: 'Todos', checked: 'Ingresados', 'pending-gate': 'Por Ingresar', 'pending-payment': 'Pago Pendiente' };
      b.textContent = (labels[f] || f) + ' (' + (c[f] || 0) + ')';
      var on = st.filtro === f;
      b.className = 'filter-btn h-9 px-3.5 rounded-lg font-label-md text-label-md transition-all ' +
        (on ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container');
    });
    document.querySelectorAll('main span, main p').forEach(function (n) {
      if (n.children.length === 0 && n.textContent.indexOf('Mostrando') === 0) {
        n.textContent = rows.length
          ? 'Mostrando ' + page.length + ' de ' + rows.length + ' registros'
          : 'Sin registros en esta vista';
      }
    });
  }

  function bind() {
    document.querySelectorAll('#filter-container .filter-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        st.filtro = b.getAttribute('data-filter') || 'all';
        st.pagina = 1;
        tabla();
      });
    });
    var buscar = document.getElementById('table-search');
    if (buscar) buscar.addEventListener('input', function () { st.q = buscar.value; st.pagina = 1; tabla(); });
    var sim = document.getElementById('btn-simulate-scan');
    if (sim) sim.addEventListener('click', function () {
      if (st.cam) detenerCamara();
      else activarCamara();
    });
    document.querySelectorAll('main button').forEach(function (b) {
      var ic = b.querySelector('.material-symbols-outlined');
      if (ic && ic.textContent.trim() === 'flip_camera_ios') {
        b.addEventListener('click', function () {
          st.facing = st.facing === 'environment' ? 'user' : 'environment';
          if (!st.cam) return;
          detenerCamara().then(function () { activarCamara(); });
        });
      }
    });
    var val = document.getElementById('btn-validate-manual');
    if (val) val.addEventListener('click', function () {
      var inp = document.getElementById('manual-ticket-input');
      var a = st.detectado || buscarClave(inp && inp.value);
      st.detectado = null;
      if (!a) { P.toast('No hay un asistente con esa clave', 'error'); mostrarValidacion(null, false); return; }
      marcar(a);
    });
    document.querySelectorAll('main button').forEach(function (b) {
      if (b.textContent.trim() === 'chevron_left' || b.querySelector('.material-symbols-outlined') && b.textContent.trim() === 'chevron_left') {
        /* skip */
      }
    });
    var prev = P.boton('chevron_left', document.querySelector('main'));
    var next = P.boton('chevron_right', document.querySelector('main'));
    if (prev) P.on(prev, function () { if (st.pagina > 1) { st.pagina--; tabla(); } });
    if (next) P.on(next, function () {
      var max = Math.ceil(filtrados().length / POR_PAGINA) || 1;
      if (st.pagina < max) { st.pagina++; tabla(); }
    });
  }

  function pintar() {
    encabezado();
    countdown();
    metricas();
    tabla();
  }

  function etiquetaCamara(on) {
    document.documentElement.classList.toggle('p-cam-on', !!on);
    var sim = document.getElementById('btn-simulate-scan');
    if (sim) {
      var txt = sim.querySelector('span:last-child');
      if (txt) txt.textContent = on ? 'Detener cámara' : 'Activar cámara';
    }
    var chip = P.porTexto('Lector Óptico Listo') || P.porTexto('Cámara activa') || P.porTexto('Lector óptico listo');
    if (chip) chip.textContent = on ? 'Cámara activa' : 'Lector óptico listo';
    var ph = document.getElementById('qr-placeholder');
    var mira = document.getElementById('qr-reticle');
    if (ph) ph.classList.toggle('hidden', !!on);
    if (mira) mira.classList.toggle('hidden', !!on);
  }

  function prepararVideo() {
    var box = document.getElementById('qr-reader');
    if (!box) return;
    var videos = box.querySelectorAll('video');
    videos.forEach(function (video) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.muted = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    });
  }

  function detenerCamara() {
    var box = document.getElementById('qr-reader');
    var p = Promise.resolve();
    if (st.cam && st.cam.stop) p = st.cam.stop().catch(function () {});
    st.cam = null;
    etiquetaCamara(false);
    return p.then(function () {
      if (box) box.innerHTML = '';
    });
  }

  function onScan(texto) {
    var a = buscarClave(texto);
    if (!a) {
      P.toast('QR no reconocido', 'error');
      return;
    }
    if (st.detectado && st.detectado.id === a.id) return;
    st.detectado = a;
    var inp = document.getElementById('manual-ticket-input');
    if (inp) inp.value = P.ticketId(a);
    marcar(a);
  }

  function arrancarCamara(constraints) {
    var box = document.getElementById('qr-reader');
    if (!box || typeof Html5Qrcode === 'undefined') {
      return Promise.reject(new Error('sin lector'));
    }
    var cam = new Html5Qrcode('qr-reader', { verbose: false });
    st.cam = cam;
    return cam.start(constraints, { fps: 10 }, onScan).then(function () {
      prepararVideo();
      etiquetaCamara(true);
    });
  }

  function activarCamara() {
    if (typeof Html5Qrcode === 'undefined') {
      P.toast('No se pudo cargar el lector de cámara', 'error');
      return;
    }
    if (st.cam) {
      detenerCamara();
      return;
    }
    etiquetaCamara(true);
    var facing = st.facing || 'environment';
    arrancarCamara({ facingMode: { ideal: facing } }).catch(function () {
      return detenerCamara().then(function () {
        return arrancarCamara({ facingMode: { ideal: 'user' } });
      });
    }).catch(function (err) {
      st.cam = null;
      etiquetaCamara(false);
      console.warn(err);
      P.toast('Safari no mostró la cámara. En Ajustes → Safari → Cámara permite snrg.lat, o usa el ingreso manual.', 'error');
    });
  }

  function modoPuerta(token) {
    document.documentElement.classList.add('p-cargando');
    return fetch('/api/puerta/' + encodeURIComponent(token), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) throw new Error(j.error || 'Enlace de puerta inválido');
        P.d = {
          eventos: [j.evento],
          asistentes: j.asistentes || [],
          usuario: { email: j.staff && j.staff.email },
          miembros: [],
          campos: [],
          mensajes: [],
          pagos: [],
          ajustes: null,
          staff: [],
        };
        st.evento = j.evento.id;
        document.documentElement.classList.add('p-puerta');
        var aside = document.querySelector('aside');
        if (aside) aside.classList.add('hidden');
        var wrap = document.querySelector('.pl-64');
        if (wrap) wrap.classList.remove('pl-64');
        var btn = document.getElementById('p-menu-btn');
        if (btn) btn.style.display = 'none';
        document.documentElement.classList.remove('p-cargando');
        bind();
        pintar();
      })
      .catch(function (e) {
        document.documentElement.classList.remove('p-cargando');
        P.toast(e.message || 'No se pudo abrir la puerta', 'error');
      });
  }

  var puertaTok = new URLSearchParams(location.search).get('puerta');
  if (puertaTok) {
    st.puerta = puertaTok;
    modoPuerta(puertaTok);
  } else {
    P.iniciar(function () {
      st.evento = P.eventoActualId();
      P.pestaniasEvento(st.evento);
      bind();
      pintar();
    });
  }
})();
