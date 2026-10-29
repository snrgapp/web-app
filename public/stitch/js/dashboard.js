(function () {
  window.P_PAGINA = 'dashboard';
  var estado = { tab: 'all', tipo: 'all', q: '' };

  function pagosAprobados(eventoId) {
    return P.d.pagos.filter(function (p) {
      return p.estado === 'aprobado' && (!eventoId || p.evento_id === eventoId);
    });
  }

  function ingresos(eventoId) {
    return pagosAprobados(eventoId).reduce(function (s, p) { return s + (Number(p.monto_cop) || 0); }, 0);
  }

  function kpis() {
    var hoy = P.hoy();
    var ev = P.d.eventos;
    var prox = ev.filter(function (e) { return P.grupoEvento(e) === 'upcoming'; });
    var pasados = ev.filter(function (e) { return P.grupoEvento(e) === 'past'; });
    var enVivo = ev.filter(function (e) { return e.fecha === hoy && e.estado !== 'borrador'; }).length;

    var k1 = P.tarjeta('Eventos Activos');
    if (k1) {
      var big = k1.querySelector('.text-\\[42px\\]');
      big.textContent = prox.length;
      big.nextElementSibling.textContent = enVivo + ' en vivo hoy';
      k1.querySelector('.pt-2 .font-body-sm').textContent = pasados.length + ' pasados concluidos';
    }

    var mes = hoy.slice(0, 7);
    var d = new Date(hoy + 'T12:00:00');
    d.setMonth(d.getMonth() - 1);
    var mesPrev = d.toISOString().slice(0, 7);
    var nMes = P.d.asistentes.filter(function (a) { return (a.created_at || '').slice(0, 7) === mes; }).length;
    var nPrev = P.d.asistentes.filter(function (a) { return (a.created_at || '').slice(0, 7) === mesPrev; }).length;
    var k2 = P.tarjeta('Total Asistentes');
    if (k2) {
      k2.querySelector('.text-\\[42px\\]').textContent = P.num(P.d.asistentes.length);
      var delta = nPrev ? Math.round(((nMes - nPrev) / nPrev) * 1000) / 10 : nMes ? 100 : 0;
      var badge = k2.querySelector('.my-3 > div');
      badge.querySelector('span:last-child').textContent = (delta >= 0 ? '+' : '') + delta + '%';
      badge.querySelector('.material-symbols-outlined').textContent = delta >= 0 ? 'trending_up' : 'trending_down';
      k2.querySelector('.pt-2 .font-body-sm').textContent = nMes + ' este mes vs. ' + nPrev + ' mes anterior';
    }

    var k3 = P.tarjeta('Ingresos Netos');
    if (k3) {
      k3.querySelector('.text-\\[42px\\]').textContent = P.cop(ingresos());
      k3.querySelector('.text-\\[42px\\]').nextElementSibling.textContent = 'COP';
      var pill = P.porTexto('Mercado Pago Activo', k3);
      if (pill) pill.textContent = P.d.ajustes && P.d.ajustes.whatsapp_pagos ? 'Cobro por WhatsApp' : 'WhatsApp sin configurar';
    }

    var conCheck = P.d.asistentes.filter(function (a) { return a.checked_in_at; }).length;
    var tasa = Math.round(P.pct(conCheck, P.d.asistentes.length));
    var k4 = P.tarjeta('Asistencia Promedio');
    if (k4) {
      k4.querySelector('.text-\\[42px\\]').textContent = tasa + '%';
      k4.querySelector('.bg-primary.h-full').style.width = tasa + '%';
      k4.querySelector('.pt-2 > span').textContent = P.num(conCheck) + ' ingresaron';
    }
  }

  function tabs() {
    var c = { all: 0, upcoming: 0, past: 0, draft: 0 };
    P.d.eventos.forEach(function (e) {
      var g = P.grupoEvento(e);
      if (g !== 'archived') c.all++;
      if (c[g] != null) c[g]++;
    });
    var orden = ['all', 'upcoming', 'past', 'draft'];
    document.querySelectorAll('.event-tab').forEach(function (b, i) {
      var k = orden[i];
      b.querySelector('span').textContent = c[k];
      b.removeAttribute('onclick');
      b.onclick = function () {
        estado.tab = k;
        document.querySelectorAll('.event-tab').forEach(function (x) {
          x.classList.remove('bg-surface-container', 'text-on-surface');
          x.classList.add('text-on-surface-variant');
        });
        b.classList.add('bg-surface-container', 'text-on-surface');
        b.classList.remove('text-on-surface-variant');
        lista();
      };
    });
    var archivados = P.d.eventos.filter(function (e) { return e.estado === 'archivado'; }).length;
    var cont = document.getElementById('tabs-container');
    var extra = document.getElementById('tab-archivados');
    if (archivados && !extra) {
      extra = document.createElement('button');
      extra.id = 'tab-archivados';
      extra.className = 'event-tab px-3.5 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md whitespace-nowrap transition-colors';
      cont.appendChild(extra);
      extra.onclick = function () {
        estado.tab = 'archived';
        document.querySelectorAll('.event-tab').forEach(function (x) {
          x.classList.remove('bg-surface-container', 'text-on-surface');
          x.classList.add('text-on-surface-variant');
        });
        extra.classList.add('bg-surface-container', 'text-on-surface');
        lista();
      };
    }
    if (extra) extra.innerHTML = 'Archivados <span class="ml-1 opacity-60">' + archivados + '</span>';
  }

  function portada(e) {
    var etiqueta = P.esc(e.lugar || e.ciudad || P.formatoLabel(e.formato));
    var img = e.image_url
      ? '<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="' + P.esc(e.image_url) + '" alt="">'
      : '<div class="w-full h-full bg-gradient-to-br from-secondary-container via-secondary to-primary-container flex items-center justify-center"><img src="/logowhite.png" alt="Synergy" style="height:26px;width:auto;opacity:.9"></div>';
    return (
      '<div class="sm:col-span-4 h-28 rounded-lg overflow-hidden relative shadow-inner">' + img +
      '<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>' +
      '<span class="absolute bottom-2 left-2 font-label-sm text-[10px] text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">' + etiqueta + '</span></div>'
    );
  }

  function avatares(lista) {
    var tonos = ['bg-surface-container-high', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-tertiary-fixed-dim text-on-tertiary-fixed'];
    return lista.slice(0, 3).map(function (a, i) {
      return '<div class="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest ' + tonos[i] + ' flex items-center justify-center font-label-sm text-[10px]">' + P.iniciales(a.nombre, a.apellido) + '</div>';
    }).join('');
  }

  function fichaBorrador(e) {
    var faltan = [];
    if (!e.fecha) faltan.push('fecha');
    if (!e.lugar) faltan.push('ubicación');
    if (!e.capacidad) faltan.push('cupo máximo');
    var campos = P.d.campos.filter(function (c) { return c.evento_id === e.id; }).length;
    var listo = Math.round(((5 - faltan.length - (campos ? 0 : 1) - (e.acerca_del_evento ? 0 : 1)) / 5) * 100);
    listo = Math.max(10, Math.min(100, listo));
    return (
      '<article class="event-card bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 relative overflow-hidden group">' +
      '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-3">' +
      '<div class="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0 opacity-60"><span class="material-symbols-outlined text-on-surface-variant text-[22px]">drafts</span></div>' +
      '<div class="flex flex-col"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container-high text-on-surface-variant font-semibold">Borrador</span>' +
      '<span class="font-label-sm text-label-sm text-on-surface-variant">' + (e.inscripcion_abierta ? 'Inscripción abierta' : 'Inscripción cerrada') + '</span></div>' +
      '<h2 class="font-headline-md text-headline-md font-bold text-on-surface mt-1 group-hover:text-secondary transition-colors">' + P.esc(e.titulo) + '</h2></div></div>' +
      '<div class="flex items-center gap-1.5 text-on-surface-variant">' +
      (e.precio_cop ? '<span class="font-headline-md text-headline-md font-bold text-on-surface">' + P.cop(e.precio_cop) + '</span><span class="font-label-sm text-label-sm">COP</span>' : '<span class="font-label-sm text-label-sm italic">Sin precio publicado</span>') +
      '</div></div>' +
      (e.acerca_del_evento ? '<p class="font-body-md text-body-md text-on-surface-variant">' + P.esc(e.acerca_del_evento) + '</p>' : '') +
      '<div class="bg-surface-container-low rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"><div class="flex items-center gap-2.5"><span class="material-symbols-outlined text-secondary text-[20px]">info</span><div class="flex flex-col">' +
      '<p class="font-label-md text-label-md text-on-surface">' + (faltan.length ? 'Falta definir ' + faltan.join(', ') : 'Listo para publicar') + '</p>' +
      '<p class="font-label-sm text-label-sm text-on-surface-variant">El formulario de registro tiene ' + campos + (campos === 1 ? ' pregunta' : ' preguntas') + ' · ' + listo + '% completado.</p></div></div>' +
      '<div class="w-24 bg-surface-container-highest rounded-full h-1.5 shrink-0 overflow-hidden"><div class="bg-secondary h-full rounded-full" style="width:' + listo + '%"></div></div></div>' +
      '<div class="pt-2 flex flex-wrap items-center justify-between gap-2"><div class="flex items-center gap-2">' +
      '<button data-acc="editar" class="h-8 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">arrow_forward</span><span>Continuar edición</span></button>' +
      '<button data-acc="publicar" class="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">publish</span><span>Publicar</span></button>' +
      '<button data-acc="eliminar" class="h-8 px-3 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">delete_outline</span><span>Descartar</span></button>' +
      '</div><span class="font-label-sm text-label-sm text-on-surface-variant">Creado ' + P.hace(e.created_at).toLowerCase() + '</span></div></article>'
    );
  }

  function ficha(e) {
    if (e.estado === 'borrador') return fichaBorrador(e);
    var f = P.fecha(e.fecha);
    var asis = P.asistentesDe(e.id);
    var g = P.grupoEvento(e);
    var pill = g === 'past'
      ? '<span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container-high text-on-surface-variant font-semibold">Finalizado</span>'
      : e.estado === 'archivado'
        ? '<span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-surface-container-high text-on-surface-variant font-semibold">Archivado</span>'
        : e.fecha === P.hoy()
          ? '<span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed font-semibold">En vivo hoy</span>'
          : '<span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] bg-tertiary-fixed/30 text-on-tertiary-container font-semibold">Publicado</span>';
    var virtual = e.formato === 'virtual';
    var cap = Number(e.capacidad) || 0;
    var pctCap = cap ? Math.min(100, Math.round((asis.length / cap) * 100)) : asis.length ? 100 : 0;
    var hora = e.hora_inicio ? e.hora_inicio + (e.hora_fin ? ' – ' + e.hora_fin : '') + ' COT' : 'Hora por definir';
    var plata = ingresos(e.id);
    return (
      '<article class="event-card bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 relative overflow-hidden group">' +
      '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-3">' +
      '<div class="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0">' +
      (f ? '<span class="font-label-sm text-[10px] uppercase font-bold text-secondary">' + f.mes + '</span><span class="font-headline-md text-headline-md font-bold text-on-surface leading-none">' + f.dia + '</span>' : '<span class="material-symbols-outlined text-on-surface-variant">event</span>') +
      '</div><div class="flex flex-col"><div class="flex items-center gap-2">' + pill +
      '<span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">' + (virtual ? 'videocam' : 'pin_drop') + '</span> ' + P.formatoLabel(e.formato) + '</span></div>' +
      '<h2 class="font-headline-md text-headline-md font-bold text-on-surface mt-1 group-hover:text-secondary transition-colors">' + P.esc(e.titulo) + '</h2></div></div>' +
      '<div class="flex flex-col items-end self-end sm:self-auto"><div class="flex items-center gap-1.5">' +
      (e.precio_cop
        ? '<span class="font-headline-md text-headline-md font-bold text-on-surface">' + P.cop(e.precio_cop) + '</span><span class="font-label-sm text-label-sm text-on-surface-variant">COP / entrada</span>'
        : '<span class="font-headline-md text-headline-md font-bold text-on-surface">Gratis</span>') +
      '</div>' + (plata ? '<span class="font-label-sm text-label-sm text-on-tertiary-container">' + P.cop(plata) + ' recaudado</span>' : '') + '</div></div>' +
      '<div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">' + portada(e) +
      '<div class="sm:col-span-8 flex flex-col justify-between gap-3 h-full"><div class="flex flex-col gap-1">' +
      '<div class="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm"><span class="material-symbols-outlined text-[16px]">schedule</span><span>' + P.fechaLarga(e.fecha, hora) + '</span></div>' +
      '<div class="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm"><span class="material-symbols-outlined text-[16px]">' + (virtual ? 'link' : 'location_on') + '</span><span class="truncate">' +
      P.esc([e.lugar, e.ciudad].filter(Boolean).join(', ') || 'Sede por definir') + '</span></div></div>' +
      '<div class="flex flex-col gap-1.5"><div class="flex items-center justify-between font-label-sm text-label-sm"><div class="flex items-center gap-2"><div class="flex -space-x-2 overflow-hidden">' + avatares(asis) + '</div>' +
      '<span class="text-on-surface font-semibold">' + asis.length + (cap ? ' / ' + cap : '') + ' Asistentes</span></div>' +
      '<span class="text-secondary font-bold">' + (cap ? pctCap + '% capacidad' : 'Sin cupo máximo') + '</span></div>' +
      '<div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden"><div class="bg-secondary h-full rounded-full transition-all duration-700" style="width:' + pctCap + '%"></div></div></div></div></div>' +
      '<div class="pt-3 flex flex-wrap items-center justify-between gap-2"><div class="flex items-center gap-2">' +
      '<button data-acc="editar" class="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">edit</span><span>Editar</span></button>' +
      '<button data-acc="duplicar" class="h-8 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">content_copy</span><span>Duplicar</span></button>' +
      '<a data-acc="checkin" href="/stitch/checkin.html" class="h-8 px-3 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">qr_code_scanner</span><span>Check-in</span></a>' +
      '<a data-acc="publica" href="/evento/' + encodeURIComponent(e.checkin_slug || '') + '" target="_blank" class="h-8 px-3 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[15px]">visibility</span><span>Ver pública</span></a>' +
      '</div><button data-acc="mas" class="w-8 h-8 rounded-lg hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"><span class="material-symbols-outlined text-[18px]">more_horiz</span></button></div></article>'
    );
  }

  function lista() {
    var grid = document.getElementById('events-grid');
    var q = estado.q.toLowerCase();
    var evs = P.d.eventos.filter(function (e) {
      var g = P.grupoEvento(e);
      if (estado.tab === 'all' ? g === 'archived' : g !== estado.tab) return false;
      if (estado.tipo !== 'all' && (e.formato || 'presencial') !== estado.tipo) return false;
      if (q && (e.titulo + ' ' + (e.lugar || '') + ' ' + (e.ciudad || '')).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    evs.sort(function (a, b) {
      var ga = P.grupoEvento(a) === 'upcoming' ? 0 : 1;
      var gb = P.grupoEvento(b) === 'upcoming' ? 0 : 1;
      if (ga !== gb) return ga - gb;
      return ga === 0 ? (a.fecha || '').localeCompare(b.fecha || '') : (b.fecha || '').localeCompare(a.fecha || '');
    });
    grid.innerHTML = evs.length
      ? evs.map(ficha).join('')
      : '<div class="bg-surface-container-lowest rounded-xl shadow-sm">' + P.vacio('event_busy', 'No hay eventos en esta vista', 'Crea un evento nuevo o cambia el filtro.') + '</div>';
    grid.querySelectorAll('.event-card').forEach(function (card, i) {
      var e = evs[i];
      card.querySelectorAll('[data-acc]').forEach(function (b) {
        var acc = b.getAttribute('data-acc');
        if (acc === 'publica') return;
        b.addEventListener('click', function (ev) {
          ev.preventDefault();
          accion(acc, e, b);
        });
      });
    });
  }

  function recargar() { P.cargar().then(pintar); }

  function accion(acc, e, btn) {
    if (acc === 'editar') return P.formEvento(e, recargar);
    if (acc === 'eliminar') return P.borrarEvento(e, recargar);
    if (acc === 'publicar') return P.editar('eventos', e.id, { estado: 'activo' }).then(function (r) { if (r.ok) { P.toast('Evento publicado'); recargar(); } });
    if (acc === 'duplicar') return P.op({ op: 'duplicar_evento', id: e.id }).then(function (r) { if (r.ok) { P.toast('Evento duplicado como borrador'); recargar(); } });
    if (acc === 'checkin') {
      localStorage.setItem('snrg_evento', e.id);
      location.href = '/stitch/checkin.html';
      return;
    }
    if (acc === 'mas') {
      P.menu(btn, [
        { texto: 'Check-in & Anfitrión', icono: 'qr_code_scanner', accion: function () { localStorage.setItem('snrg_evento', e.id); location.href = '/stitch/checkin.html'; } },
        { texto: 'Configuración del Evento', icono: 'tune', accion: function () { localStorage.setItem('snrg_evento', e.id); location.href = '/stitch/configuracion.html'; } },
        { texto: 'Comentarios & Feedback', icono: 'rate_review', accion: function () { localStorage.setItem('snrg_evento', e.id); location.href = '/stitch/feedback.html'; } },
        { texto: 'Ver asistentes', icono: 'group', accion: function () { localStorage.setItem('snrg_evento', e.id); location.href = '/stitch/asistentes.html'; } },
        { texto: 'Editar formulario', icono: 'wysiwyg', accion: function () { localStorage.setItem('snrg_evento', e.id); location.href = '/stitch/formularios.html'; } },
        e.estado === 'archivado'
          ? { texto: 'Restaurar', icono: 'unarchive', accion: function () { P.editar('eventos', e.id, { estado: 'activo' }).then(function (r) { if (r.ok) { P.toast('Evento restaurado'); recargar(); } }); } }
          : { texto: 'Archivar', icono: 'archive', accion: function () { P.editar('eventos', e.id, { estado: 'archivado' }).then(function (r) { if (r.ok) { P.toast('Evento archivado'); recargar(); } }); } },
        { sep: true },
        { texto: 'Eliminar', icono: 'delete', peligro: true, accion: function () { P.borrarEvento(e, recargar); } },
      ]);
    }
  }

  function equipo() {
    var card = P.tarjeta('Equipo Anfitrión');
    if (!card) return;
    var n = P.d.miembros.length || 1;
    card.querySelector('.rounded-full.bg-surface-container').textContent = n + (n === 1 ? ' miembro' : ' miembros');
    var email = P.d.usuario.email || '';
    var yo = P.d.miembros.find(function (m) { return m.user_id === P.d.usuario.id; });
    var rol = { admin: 'Propietario', member: 'Co-anfitrión', viewer: 'Lectura' };
    var filas = '<div class="flex items-center justify-between p-2 rounded-lg bg-surface-container-low"><div class="flex items-center gap-2.5 min-w-0">' +
      '<div class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm">' + P.iniciales(email.split('@')[0].replace(/[._-]/g, ' ')) + '</div>' +
      '<div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">' + P.esc(email) + ' (tú)</span><span class="font-label-sm text-[11px] text-on-surface-variant">' + (rol[yo && yo.rol] || 'Propietario') + '</span></div></div>' +
      '<span class="material-symbols-outlined text-secondary text-[16px]">verified_user</span></div>';
    var otros = P.d.miembros.filter(function (m) { return m.user_id !== P.d.usuario.id; });
    otros.forEach(function (m, i) {
      filas += '<div class="flex items-center justify-between p-2 rounded-lg bg-surface-container-low"><div class="flex items-center gap-2.5 min-w-0">' +
        '<div class="w-7 h-7 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-label-sm">M' + (i + 1) + '</div>' +
        '<div class="flex flex-col min-w-0"><span class="font-label-md text-label-md text-on-surface truncate">Miembro del equipo</span><span class="font-label-sm text-[11px] text-on-surface-variant">' + (rol[m.rol] || 'Miembro') + '</span></div></div>' +
        '<span class="font-label-sm text-[11px] text-on-surface-variant">Acceso panel</span></div>';
    });
    card.querySelector('.flex.flex-col.gap-2\\.5').innerHTML = filas;
    var input = card.querySelector('input[type=email]');
    P.on(P.boton('Invitar', card), function () {
      var to = input.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return P.toast('Escribe un correo válido', 'error');
      var cuerpo = 'Hola, te invito a co-organizar eventos en Synergy. Entra al panel en https://snrg.lat/login';
      location.href = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent('Invitación al panel de eventos Synergy') + '&body=' + encodeURIComponent(cuerpo);
      input.value = '';
    });
  }

  function actividad() {
    var card = P.tarjeta('Actividad en Vivo');
    if (!card) return;
    var items = [];
    P.d.asistentes.forEach(function (a) {
      var ev = P.evento(a.evento_id);
      items.push({ t: a.created_at, icono: 'how_to_reg', tono: 'bg-secondary-fixed text-on-secondary-fixed', quien: P.nombre(a), que: 'Registrado en ' + (ev ? ev.titulo : 'un evento') });
      if (a.checked_in_at) items.push({ t: a.checked_in_at, icono: 'qr_code_scanner', tono: 'bg-tertiary-fixed/30 text-on-tertiary-container', quien: P.nombre(a), que: 'Hizo check-in en ' + (ev ? ev.titulo : 'el evento') });
    });
    P.d.pagos.forEach(function (p) {
      items.push({ t: p.created_at, icono: 'confirmation_number', tono: 'bg-tertiary-fixed/30 text-on-tertiary-container', quien: p.pagador || 'Pago', que: 'Pago de ' + P.cop(p.monto_cop) + ' · ' + (p.estado || 'pendiente') });
    });
    P.d.mensajes.forEach(function (m) {
      if (m.enviado_at) items.push({ t: m.enviado_at, icono: 'mark_email_read', tono: 'bg-surface-container-high text-on-surface', quien: m.titulo || 'Notificación', que: (m.enviados || 0) + ' mensajes enviados con éxito' });
    });
    items.sort(function (a, b) { return String(b.t).localeCompare(String(a.t)); });
    var box = card.querySelector('.flex.flex-col.gap-3\\.5');
    box.innerHTML = items.length
      ? items.slice(0, 4).map(function (it) {
          return '<div class="flex items-start gap-3"><div class="w-7 h-7 rounded-full ' + it.tono + ' flex items-center justify-center shrink-0 mt-0.5"><span class="material-symbols-outlined text-[15px]">' + it.icono + '</span></div>' +
            '<div class="flex flex-col flex-1 min-w-0"><div class="flex items-center justify-between gap-1"><p class="font-label-md text-label-md text-on-surface truncate">' + P.esc(it.quien) + '</p><span class="font-label-sm text-[10px] text-on-surface-variant shrink-0">' + P.hace(it.t) + '</span></div>' +
            '<p class="font-body-sm text-[12px] text-on-surface-variant truncate">' + P.esc(it.que) + '</p></div></div>';
        }).join('')
      : '<p class="font-body-sm text-body-sm text-on-surface-variant">Todavía no hay actividad.</p>';
  }

  function calendario() {
    var t = P.porTexto('Calendario Synergy');
    if (!t) return;
    var card = t.closest('.rounded-xl');
    var mes = P.hoy().slice(0, 7);
    var nombreMes = new Date(P.hoy() + 'T12:00:00').toLocaleDateString('es-CO', { month: 'long' });
    nombreMes = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    var delMes = P.d.eventos.filter(function (e) { return (e.fecha || '').slice(0, 7) === mes && e.estado !== 'borrador'; });
    var prox = P.d.eventos.filter(function (e) { return P.grupoEvento(e) === 'upcoming'; }).sort(function (a, b) { return (a.fecha || '').localeCompare(b.fecha || ''); })[0];
    card.querySelector('p.font-headline-md').textContent = nombreMes + ' tiene ' + delMes.length + (delMes.length === 1 ? ' convocatoria' : ' convocatorias');
    var desc = card.querySelector('p.font-body-sm');
    var btn = card.querySelector('button');
    if (prox) {
      var n = P.asistentesDe(prox.id).length;
      desc.textContent = prox.capacidad
        ? 'Los cupos para ' + prox.titulo + ' están al ' + Math.round((n / prox.capacidad) * 100) + '%. Puedes liberar más cupos editando el evento.'
        : prox.titulo + ' lleva ' + n + ' inscritos y no tiene cupo máximo. Defínelo para controlar el aforo.';
      P.on(btn, function () { P.formEvento(prox, recargar); });
    } else {
      desc.textContent = 'No hay eventos próximos. Crea uno para empezar a recibir inscripciones.';
      btn = P.on(btn, function () { P.formEvento(null, recargar); });
      btn.textContent = 'Crear evento';
    }
  }

  function pintar() {
    kpis();
    tabs();
    lista();
    equipo();
    actividad();
    calendario();
  }

  function controles() {
    window.filterEvents = function () {};
    window.handleSearch = function (v) { estado.q = v || ''; lista(); };
    window.filterType = function (v) { estado.tipo = v; lista(); };
    var sel = document.getElementById('type-select');
    if (sel && !sel.querySelector('option[value=hibrido]')) sel.insertAdjacentHTML('beforeend', '<option value="hibrido">Híbrido</option>');
    var crear = P.boton('Crear Evento', document.querySelector('main'));
    P.on(crear, function () { P.formEvento(null, recargar); });
    P.on(P.boton('Exportar CSV', document.querySelector('main')), function () {
      P.csv('eventos-synergy.csv', P.d.eventos.map(function (e) {
        return { titulo: e.titulo, fecha: e.fecha, estado: e.estado, formato: e.formato, lugar: e.lugar, ciudad: e.ciudad, capacidad: e.capacidad, asistentes: P.asistentesDe(e.id).length, ingresos_cop: ingresos(e.id) };
      }));
    });
    var modal = document.getElementById('modal-new-event');
    if (modal) modal.remove();
  }

  controles();
  P.iniciar(function () {
    pintar();
    if (location.hash === '#crear') {
      history.replaceState(null, '', location.pathname);
      P.formEvento(null, recargar);
    }
  });
})();
