(function () {
  window.P_PAGINA = 'asistentes';
  var POR_PAGINA = 10;
  var st = { evento: null, filtro: 'todos', q: '', pagina: 1, sel: {}, avanzado: {} };

  var PILL = {
    checkin: function (a) {
      var h = new Date(a.checked_in_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' });
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span>Check-in ' + h + ' hrs</span>';
    },
    confirmado: function () {
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Confirmado / Pagado</span>';
    },
    por_aprobar: function () {
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>Pendiente Aprobación</span>';
    },
    pago_pendiente: function (a) {
      var h = Math.max(1, Math.round((Date.now() - new Date(a.created_at).getTime()) / 36e5));
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-error font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Pago Pendiente (' + (h > 48 ? Math.round(h / 24) + 'd' : h + 'h') + ')</span>';
    },
    lista_espera: function () {
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>Lista de espera</span>';
    },
    rechazado: function () {
      return '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm line-through"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Rechazado</span>';
    },
  };

  var ACCION = {
    checkin: ['badge', 'Ver Credencial'],
    confirmado: ['how_to_reg', 'Hacer Check-in'],
    por_aprobar: ['check', 'Aprobar'],
    pago_pendiente: ['chat', 'Recordar Pago'],
    lista_espera: ['check', 'Aprobar'],
    rechazado: ['undo', 'Reactivar'],
  };

  var ORIGEN = {
    lista: ['upload_file', 'Lista importada'],
    panel: ['person_add', 'Agregado en panel'],
    formulario: ['wysiwyg', 'Formulario web'],
    checkin: ['qr_code_scanner', 'Registro en puerta'],
  };

  function base() {
    return P.asistentesDe(st.evento);
  }

  function filtrados() {
    var q = st.q.toLowerCase();
    var av = st.avanzado;
    return base().filter(function (a) {
      var e = P.estadoAsistente(a);
      if (st.filtro === 'confirmado' && e !== 'confirmado' && e !== 'checkin') return false;
      if (st.filtro === 'por_aprobar' && e !== 'por_aprobar' && e !== 'lista_espera') return false;
      if (st.filtro === 'checkin' && e !== 'checkin') return false;
      if (st.filtro === 'pago_pendiente' && e !== 'pago_pendiente') return false;
      if (av.sector && (a.sector || '') !== av.sector) return false;
      if (av.ticket && (a.tipo_ticket || 'General') !== av.ticket) return false;
      if (av.origen && (a.origen_registro || '') !== av.origen) return false;
      if (q) {
        var txt = [a.nombre, a.apellido, a.correo, a.empresa, a.telefono, a.codigo_mesa, a.cargo].join(' ').toLowerCase();
        if (txt.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function hero() {
    var ev = P.evento(st.evento);
    var lista = base();
    var c = { checkin: 0, confirmado: 0, por_aprobar: 0, pago_pendiente: 0, lista_espera: 0 };
    lista.forEach(function (a) { var e = P.estadoAsistente(a); if (c[e] != null) c[e]++; });
    var confirmados = c.checkin + c.confirmado;
    var cap = ev && ev.capacidad ? Number(ev.capacidad) : 0;
    var h1 = document.querySelector('main section h1');
    h1.innerHTML = confirmados + ' <span class="font-body-lg text-body-lg text-on-surface-variant font-normal">' + (cap ? '/ ' + cap + ' confirmados' : 'confirmados') + '</span>';
    h1.nextElementSibling.textContent = cap ? Math.round((confirmados / cap) * 100) + '%' : lista.length + ' inscritos';

    var t;
    if ((t = P.porTexto('Ingresados a sala'))) t.nextElementSibling.innerHTML = c.checkin + ' <span class="text-on-surface-variant font-body-sm text-body-sm">(' + Math.round(P.pct(c.checkin, confirmados || 1)) + '%)</span>';
    if ((t = P.porTexto('En lista de espera'))) t.nextElementSibling.textContent = c.lista_espera;
    if ((t = P.porTexto('Ingresos netos'))) {
      var plata = P.d.pagos.filter(function (p) { return p.estado === 'aprobado' && (!st.evento || p.evento_id === st.evento); }).reduce(function (s, p) { return s + (Number(p.monto_cop) || 0); }, 0);
      t.nextElementSibling.innerHTML = P.cop(plata) + ' <span class="text-label-sm font-label-sm text-on-surface-variant">COP</span>';
    }

    var total = cap || lista.length || 1;
    var segs = document.querySelectorAll('main section .h-3 > div');
    var vals = [c.checkin, c.confirmado, c.por_aprobar + c.lista_espera, c.pago_pendiente];
    segs.forEach(function (s, i) { s.style.width = Math.min(100, (vals[i] / total) * 100) + '%'; });
    var leyenda = document.querySelectorAll('main section .flex-wrap > span.flex');
    var nombres = ['Check-in', 'Confirmados / Pagados', 'Por Aprobar', 'Pago Pendiente'];
    leyenda.forEach(function (l, i) { if (nombres[i]) l.lastChild.textContent = ' ' + nombres[i] + ' (' + vals[i] + ')'; });
    var resto = document.querySelector('main section .pt-1 > span.font-semibold');
    if (resto) resto.textContent = cap ? Math.max(0, cap - confirmados) + ' cupos restantes' : 'Sin cupo máximo';

    var chip = document.getElementById('p-evento-chip');
    if (!chip) {
      var fila = P.porTexto('Check-in en Puerta Activo');
      fila = fila ? fila.closest('span.inline-flex') : null;
      if (fila) {
        chip = document.createElement('button');
        chip.id = 'p-evento-chip';
        chip.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-sm font-label-sm transition-colors';
        fila.parentNode.appendChild(chip);
        chip.addEventListener('click', function () {
          P.elegirEvento(chip, function (id) { st.evento = id; st.pagina = 1; st.sel = {}; pintar(); }, { todos: true, actual: st.evento });
        });
        fila.style.cursor = 'pointer';
        fila.addEventListener('click', abrirCheckin);
      }
    }
    if (chip) chip.innerHTML = '<span class="material-symbols-outlined text-[14px] text-secondary">event</span>' + P.esc(ev ? ev.titulo : 'Todos los eventos') + '<span class="material-symbols-outlined text-[14px]">expand_more</span>';
  }

  function pills() {
    var lista = base();
    var cuenta = { todos: lista.length, confirmado: 0, por_aprobar: 0, checkin: 0, pago_pendiente: 0 };
    lista.forEach(function (a) {
      var e = P.estadoAsistente(a);
      if (e === 'confirmado' || e === 'checkin') cuenta.confirmado++;
      if (e === 'por_aprobar' || e === 'lista_espera') cuenta.por_aprobar++;
      if (e === 'checkin') cuenta.checkin++;
      if (e === 'pago_pendiente') cuenta.pago_pendiente++;
    });
    var orden = ['todos', 'confirmado', 'por_aprobar', 'checkin', 'pago_pendiente'];
    var botones = document.querySelectorAll('main section button.h-8.rounded-full');
    botones.forEach(function (b, i) {
      var k = orden[i];
      if (!k) return;
      b.querySelectorAll('span')[1].textContent = cuenta[k];
      var activo = st.filtro === k;
      b.classList.toggle('bg-primary', activo);
      b.classList.toggle('text-on-primary', activo);
      b.classList.toggle('bg-surface-container-lowest', !activo);
      b.classList.toggle('text-on-surface', !activo);
      if (!b.dataset.p) {
        b.dataset.p = '1';
        b.addEventListener('click', function () { st.filtro = k; st.pagina = 1; pintar(); });
      }
    });
  }

  function fila(a) {
    var e = P.estadoAsistente(a);
    var ev = P.evento(a.evento_id);
    var acc = ACCION[e] || ACCION.confirmado;
    var orig = ORIGEN[a.origen_registro] || ['edit_note', a.origen_registro || 'Registro'];
    var precio = ev && ev.precio_cop ? P.cop(ev.precio_cop) + ' COP' : 'Gratis';
    var respuesta = [a.cargo, a.empresa].filter(Boolean).join(' • ') || 'Sin empresa';
    var detalle = a.sector || (a.codigo_mesa ? 'Mesa ' + a.codigo_mesa : 'Sin sector');
    var fecha = a.created_at ? new Date(a.created_at) : null;
    var fechaTxt = fecha ? fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' }) + ', ' + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' }) : '';
    return (
      '<tr class="hover:bg-surface-container-low/60 transition-colors group" data-id="' + a.id + '">' +
      '<td class="py-4 pl-6 pr-3 text-center"><input data-sel class="w-4 h-4 rounded bg-surface-bright text-primary cursor-pointer accent-primary" type="checkbox"' + (st.sel[a.id] ? ' checked' : '') + '></td>' +
      '<td class="py-4 px-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full ' + (e === 'checkin' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container text-on-surface') + ' flex items-center justify-center font-label-md text-label-md font-semibold shrink-0">' + P.iniciales(a.nombre, a.apellido) + '</div>' +
      '<div class="flex flex-col min-w-0"><div class="flex items-center gap-1.5"><span class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(P.nombre(a)) + '</span>' +
      (e === 'checkin' ? '<span class="material-symbols-outlined text-[14px] text-secondary" title="Ingresó al evento">verified</span>' : '') + '</div>' +
      '<span class="font-body-sm text-body-sm text-on-surface-variant truncate">' + P.esc(a.correo || a.telefono || 'Sin contacto') + '</span></div></div></td>' +
      '<td class="py-4 px-4"><div class="flex flex-col"><span class="font-label-md text-label-md text-on-surface' + (a.tipo_ticket ? ' font-semibold' : '') + '">' + P.esc(a.tipo_ticket || 'Pase General') + '</span><span class="font-label-sm text-label-sm text-on-surface-variant font-mono">' + precio + '</span></div></td>' +
      '<td class="py-4 px-4">' + (PILL[e] || PILL.confirmado)(a) + '</td>' +
      '<td class="py-4 px-4"><div class="flex items-center gap-1.5"><div class="flex flex-col"><span class="truncate max-w-[160px] font-label-md text-label-md">' + P.esc(respuesta) + '</span><span class="font-label-sm text-label-sm text-secondary truncate max-w-[160px]">' + P.esc(detalle) + '</span></div></div></td>' +
      '<td class="py-4 px-4"><div class="flex flex-col"><span class="font-body-sm text-body-sm text-on-surface">' + fechaTxt + '</span><span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">' + orig[0] + '</span> ' + P.esc(orig[1]) + '</span></div></td>' +
      '<td class="py-4 pr-6 pl-4 text-right"><div class="flex items-center justify-end gap-1.5">' +
      '<button data-acc="rapida" class="h-8 px-3 rounded-lg ' + (e === 'confirmado' ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container text-on-surface hover:bg-surface-container-high') + ' font-label-sm text-label-sm transition-colors flex items-center gap-1 whitespace-nowrap"><span class="material-symbols-outlined text-[14px]">' + acc[0] + '</span><span>' + acc[1] + '</span></button>' +
      '<button data-acc="mas" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"><span class="material-symbols-outlined text-[18px]">more_vert</span></button>' +
      '</div></td></tr>'
    );
  }

  function tabla() {
    var lista = filtrados();
    var paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    if (st.pagina > paginas) st.pagina = paginas;
    var desde = (st.pagina - 1) * POR_PAGINA;
    var pag = lista.slice(desde, desde + POR_PAGINA);
    var tbody = document.querySelector('main table tbody');
    tbody.innerHTML = pag.length ? pag.map(fila).join('') : '<tr><td colspan="7">' + P.vacio('group_off', 'No hay asistentes en esta vista', 'Invita a alguien o cambia los filtros.') + '</td></tr>';
    tbody.querySelectorAll('tr[data-id]').forEach(function (tr) {
      var a = P.d.asistentes.find(function (x) { return x.id === tr.dataset.id; });
      tr.querySelector('[data-sel]').addEventListener('change', function (ev) {
        if (ev.target.checked) st.sel[a.id] = true;
        else delete st.sel[a.id];
        pie(lista.length, desde, pag.length, paginas);
      });
      tr.querySelector('[data-acc=rapida]').addEventListener('click', function () { rapida(a); });
      tr.querySelector('[data-acc=mas]').addEventListener('click', function (ev) { menuFila(a, ev.currentTarget); });
    });
    var todos = document.querySelector('main table thead input');
    todos.checked = pag.length > 0 && pag.every(function (a) { return st.sel[a.id]; });
    todos.onchange = function () {
      pag.forEach(function (a) { if (todos.checked) st.sel[a.id] = true; else delete st.sel[a.id]; });
      tabla();
    };
    pie(lista.length, desde, pag.length, paginas);
  }

  function pie(total, desde, n, paginas) {
    var barra = document.querySelector('main table').closest('.rounded-xl').lastElementChild;
    var izq = barra.firstElementChild;
    var nSel = Object.keys(st.sel).length;
    izq.innerHTML =
      '<span>Mostrando <strong>' + (total ? desde + 1 : 0) + ' - ' + (desde + n) + '</strong> de <strong>' + total + '</strong> invitados</span><span class="text-outline-variant">•</span>' +
      '<button id="p-sel" class="font-label-sm text-label-sm ' + (nSel ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface') + ' px-2 py-0.5 rounded">' + nSel + ' seleccionados' + (nSel ? ' ▾' : '') + '</button>';
    izq.querySelector('#p-sel').addEventListener('click', function (ev) { if (nSel) menuLote(ev.currentTarget); });
    var der = barra.lastElementChild;
    var nums = [];
    for (var i = 1; i <= paginas; i++) {
      if (paginas > 6 && i > 3 && i < paginas) { if (nums[nums.length - 1] !== '…') nums.push('…'); continue; }
      nums.push(i);
    }
    if (paginas > 6 && st.pagina > 3 && st.pagina < paginas) nums.splice(3, 0, st.pagina);
    der.innerHTML =
      '<button data-p="prev" class="h-8 px-2.5 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm disabled:opacity-40"' + (st.pagina === 1 ? ' disabled' : '') + '>Anterior</button>' +
      '<div class="flex items-center gap-1 font-label-sm text-label-sm">' + nums.map(function (x) {
        if (x === '…') return '<span class="px-1 text-on-surface-variant">...</span>';
        return '<button data-p="' + x + '" class="w-7 h-7 rounded ' + (x === st.pagina ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-container text-on-surface') + '">' + x + '</button>';
      }).join('') + '</div>' +
      '<button data-p="next" class="h-8 px-2.5 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm disabled:opacity-40"' + (st.pagina === paginas ? ' disabled' : '') + '>Siguiente</button>';
    der.querySelectorAll('[data-p]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.dataset.p;
        st.pagina = p === 'prev' ? st.pagina - 1 : p === 'next' ? st.pagina + 1 : Number(p);
        tabla();
      });
    });
  }

  function guardar(a, valores, msg) {
    return P.editar('asistentes', a.id, valores).then(function (r) {
      if (r.ok) { P.toast(msg); recargar(); }
      return r.ok;
    });
  }

  function whatsapp(a, texto) {
    var tel = String(a.telefono || '').replace(/\D/g, '');
    if (tel.length < 10) return P.toast('Este asistente no tiene celular', 'error');
    if (tel.length === 10) tel = '57' + tel;
    window.open('https://wa.me/' + tel + '?text=' + encodeURIComponent(texto), '_blank');
  }

  function rapida(a) {
    var e = P.estadoAsistente(a);
    if (e === 'confirmado') return guardar(a, { checked_in_at: new Date().toISOString() }, 'Check-in registrado');
    if (e === 'por_aprobar' || e === 'lista_espera') return guardar(a, { estado_pago: 'confirmado' }, 'Asistente aprobado');
    if (e === 'rechazado') return guardar(a, { estado_pago: 'confirmado' }, 'Asistente reactivado');
    if (e === 'pago_pendiente') {
      var ev = P.evento(a.evento_id);
      return whatsapp(a, 'Hola ' + (a.nombre || '') + ', te escribimos de Synergy. Tu cupo para ' + (ev ? ev.titulo : 'el evento') + ' está reservado; solo falta el pago' + (ev && ev.precio_cop ? ' de ' + P.cop(ev.precio_cop) + ' COP' : '') + '. ¿Te ayudamos a completarlo?');
    }
    credencial(a);
  }

  function credencial(a) {
    var ev = P.evento(a.evento_id);
    P.modal({
      titulo: P.nombre(a),
      subtitulo: (ev ? ev.titulo : 'Sin evento') + ' · ' + (a.tipo_ticket || 'Pase General'),
      texto:
        'Check-in: ' + P.fechaHora(a.checked_in_at) +
        (a.codigo_mesa || a.mesa ? ' · Mesa ' + (a.codigo_mesa || a.mesa) : '') +
        (a.empresa ? ' · ' + a.empresa : '') +
        (a.correo ? ' · ' + a.correo : ''),
      campos: [],
      textoGuardar: 'Deshacer check-in',
      peligro: true,
      onGuardar: function () { return guardar(a, { checked_in_at: null }, 'Check-in deshecho'); },
    });
  }

  function menuFila(a, ancla) {
    var e = P.estadoAsistente(a);
    var items = [{ texto: 'Editar datos', icono: 'edit', accion: function () { P.formAsistente(a, st.evento, recargar); } }];
    if (e === 'checkin') items.push({ texto: 'Deshacer check-in', icono: 'undo', accion: function () { guardar(a, { checked_in_at: null }, 'Check-in deshecho'); } });
    else items.push({ texto: 'Hacer check-in', icono: 'how_to_reg', accion: function () { guardar(a, { checked_in_at: new Date().toISOString() }, 'Check-in registrado'); } });
    P.OPC.estado.forEach(function (o) {
      if ((a.estado_pago || 'confirmado') !== o.v) items.push({ texto: 'Marcar: ' + o.l, icono: 'label', accion: function () { guardar(a, { estado_pago: o.v }, 'Estado actualizado'); } });
    });
    if (a.telefono) items.push({ texto: 'Escribir por WhatsApp', icono: 'chat', accion: function () { whatsapp(a, 'Hola ' + (a.nombre || '') + ', te escribimos de Synergy.'); } });
    items.push({ sep: true }, { texto: 'Eliminar', icono: 'delete', peligro: true, accion: function () { P.borrarAsistente(a, recargar); } });
    P.menu(ancla, items);
  }

  function menuLote(ancla) {
    var ids = Object.keys(st.sel);
    function lote(valores, msg) {
      Promise.all(ids.map(function (id) { return P.editar('asistentes', id, valores); })).then(function () { st.sel = {}; P.toast(msg); recargar(); });
    }
    P.menu(ancla, [
      { texto: 'Hacer check-in a ' + ids.length, icono: 'how_to_reg', accion: function () { lote({ checked_in_at: new Date().toISOString() }, 'Check-in registrado'); } },
      { texto: 'Aprobar / confirmar', icono: 'check', accion: function () { lote({ estado_pago: 'confirmado' }, 'Asistentes confirmados'); } },
      { texto: 'Exportar seleccionados', icono: 'download', accion: function () { exportar(P.d.asistentes.filter(function (a) { return st.sel[a.id]; })); } },
      { texto: 'Quitar selección', icono: 'deselect', accion: function () { st.sel = {}; tabla(); } },
      { sep: true },
      { texto: 'Eliminar ' + ids.length + ' asistentes', icono: 'delete', peligro: true, accion: function () {
        P.confirmar('Eliminar asistentes', 'Se borrarán ' + ids.length + ' asistentes. No se puede deshacer.', 'Eliminar').then(function (ok) {
          if (!ok) return;
          Promise.all(ids.map(function (id) { return P.eliminar('asistentes', id); })).then(function () { st.sel = {}; P.toast('Asistentes eliminados'); recargar(); });
        });
      } },
    ]);
  }

  function exportar(lista) {
    P.csv('asistentes-synergy.csv', lista.map(function (a) {
      var ev = P.evento(a.evento_id);
      return {
        nombre: a.nombre, apellido: a.apellido, correo: a.correo, telefono: a.telefono, empresa: a.empresa, cargo: a.cargo, sector: a.sector,
        ticket: a.tipo_ticket, estado: a.estado_pago, check_in: a.checked_in_at || '', mesa: a.codigo_mesa || a.mesa || '', evento: ev ? ev.titulo : '', registrado: a.created_at,
      };
    }));
  }

  function abrirCheckin() {
    var ev = P.evento(st.evento) || P.evento(P.eventoActualId());
    if (!ev) return P.toast('Elige un evento primero', 'error');
    window.open('/checkin?event=' + encodeURIComponent(ev.checkin_slug || ''), '_blank');
  }

  function avanzados() {
    function unicos(campo, def) {
      var s = {};
      base().forEach(function (a) { var v = a[campo] || def; if (v) s[v] = 1; });
      return [{ v: '', l: 'Todos' }].concat(Object.keys(s).sort());
    }
    P.modal({
      titulo: 'Filtros avanzados',
      campos: [
        { nombre: 'sector', etiqueta: 'Sector', tipo: 'select', opciones: unicos('sector') },
        { nombre: 'ticket', etiqueta: 'Ticket / Categoría', tipo: 'select', opciones: unicos('tipo_ticket', 'General') },
        { nombre: 'origen', etiqueta: 'Origen del registro', tipo: 'select', opciones: unicos('origen_registro') },
      ],
      valores: st.avanzado,
      textoGuardar: 'Aplicar filtros',
      onGuardar: function (v) { st.avanzado = v; st.pagina = 1; tabla(); return true; },
    });
  }

  function tarjetasInferiores() {
    var lista = base();
    var confirmados = lista.filter(function (a) { var e = P.estadoAsistente(a); return e === 'confirmado' || e === 'checkin'; }).length;
    var check = lista.filter(function (a) { return a.checked_in_at; }).length;

    var embudo = P.tarjeta('Embudo de Invitación');
    if (embudo) {
      var tasa = P.pct(check, lista.length);
      embudo.querySelector('h3').textContent = tasa + '% Conversión';
      var cols = embudo.querySelectorAll('.flex-1');
      var datos = [[lista.length, 'Inscritos'], [confirmados, 'Confirmados'], [check, 'Check-in']];
      var max = Math.max(1, lista.length);
      cols.forEach(function (c, i) {
        var s = c.querySelectorAll('span');
        s[0].textContent = datos[i][0];
        s[1].textContent = datos[i][1];
        c.querySelector('div').style.height = Math.max(6, Math.round((datos[i][0] / max) * 64)) + 'px';
      });
      var prev = P.d.eventos.filter(function (e) { return e.id !== st.evento && P.grupoEvento(e) === 'past'; })[0];
      var nota = embudo.querySelector('p');
      if (prev && st.evento) {
        var pa = P.asistentesDe(prev.id);
        var tp = P.pct(pa.filter(function (a) { return a.checked_in_at; }).length, pa.length);
        var d = Math.round((tasa - tp) * 10) / 10;
        nota.textContent = (d >= 0 ? '+' : '') + d + '% respecto a ' + prev.titulo + '.';
      } else nota.textContent = 'Inscritos que terminaron haciendo check-in en puerta.';
    }

    var mix = P.tarjeta('Pases VIP y Mix de Tickets');
    if (mix) {
      var tipos = {};
      lista.forEach(function (a) { var t = a.tipo_ticket || 'Pase General'; tipos[t] = (tipos[t] || 0) + 1; });
      var orden = Object.keys(tipos).sort(function (a, b) { return tipos[b] - tipos[a]; });
      var top = orden[0];
      mix.querySelector('h3').textContent = top ? tipos[top] + ' ' + top : 'Sin tickets';
      var pTop = Math.round(P.pct(tipos[top] || 0, lista.length));
      mix.querySelector('svg path.text-primary').setAttribute('stroke-dasharray', pTop + ', 100');
      mix.querySelector('.absolute.font-label-md').textContent = pTop + '%';
      var filas = mix.querySelectorAll('.flex-col.gap-1\\.5 > div');
      var colores = ['bg-primary', 'bg-secondary', 'bg-tertiary-fixed-dim'];
      filas.forEach(function (f, i) {
        var t = orden[i];
        f.style.display = t ? '' : 'none';
        if (!t) return;
        f.children[0].innerHTML = '<span class="w-2 h-2 rounded-full ' + colores[i] + '"></span> ' + P.esc(t) + ' (' + tipos[t] + ')';
        f.children[1].textContent = Math.round(P.pct(tipos[t], lista.length)) + '%';
      });
      var ev = P.evento(st.evento);
      mix.querySelector('p.font-body-sm').textContent = ev && ev.capacidad ? 'Quedan ' + Math.max(0, ev.capacidad - lista.length) + ' cupos disponibles.' : 'Define el cupo del evento para ver disponibilidad.';
    }

    var vel = P.tarjeta('Velocidad en Recepción');
    if (vel) {
      var tiempos = lista.filter(function (a) { return a.checked_in_at; }).map(function (a) { return new Date(a.checked_in_at).getTime(); }).sort();
      var ritmo = 0, picoTxt = 'Sin check-ins todavía', picoN = 0;
      if (tiempos.length) {
        var min = Math.max(1, (tiempos[tiempos.length - 1] - tiempos[0]) / 60000);
        ritmo = Math.round((tiempos.length / min) * 10) / 10;
        var mejor = 0, ini = tiempos[0];
        for (var i = 0, j = 0; i < tiempos.length; i++) {
          while (tiempos[i] - tiempos[j] > 20 * 60000) j++;
          if (i - j + 1 > mejor) { mejor = i - j + 1; ini = tiempos[j]; }
        }
        picoN = mejor;
        var fmt = function (t) { return new Date(t).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' }); };
        picoTxt = 'Pico de ingreso: ' + fmt(ini) + ' - ' + fmt(ini + 20 * 60000);
      }
      vel.querySelector('h3').textContent = ritmo + ' escaneos / min';
      var linea = vel.querySelectorAll('.font-label-sm > span');
      if (linea[0]) linea[0].textContent = picoTxt;
      if (linea[1]) linea[1].textContent = '+' + picoN + ' personas';
      vel.querySelector('.bg-secondary-container').style.width = Math.round(P.pct(picoN, tiempos.length || 1)) + '%';
      var pto = P.porTexto('2 puntos de control activos', vel);
      if (pto) pto.textContent = check + ' de ' + lista.length + ' ya ingresaron';
      P.on(P.boton('Ver log en vivo', vel), abrirCheckin);
    }
  }

  function pintar() {
    hero();
    pills();
    tabla();
    tarjetasInferiores();
  }

  function recargar() { P.cargar().then(pintar); }

  function controles() {
    var buscar = document.querySelector('main input[placeholder^="Buscar por nombre"]');
    buscar.addEventListener('input', function () { st.q = buscar.value; st.pagina = 1; tabla(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); buscar.focus(); }
    });
    var main = document.querySelector('main');
    P.on(P.boton('Filtros avanzados', main), avanzados);
    P.on(P.boton('Exportar CSV', main), function () { exportar(filtrados()); });
    P.on(P.boton('Escanear QR en Puerta', main), abrirCheckin);
    P.on(P.boton('+ Invitar Asistente', main), function () {
      if (!P.d.eventos.length) return P.toast('Primero crea un evento', 'error');
      P.formAsistente(null, st.evento || P.eventoActualId(), recargar);
    });
  }

  controles();
  P.iniciar(function () {
    st.evento = P.eventoActualId();
    pintar();
  });
})();
