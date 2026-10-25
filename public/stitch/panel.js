/* Synergy · núcleo del panel de eventos (pantallas Stitch). */
(function () {
  var P = (window.P = {});
  P.d = null;

  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var MESES_L = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  P.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  P.hoy = function () {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
  };

  P.cop = function (n) {
    return '$' + Math.round(Number(n) || 0).toLocaleString('es-CO');
  };

  P.num = function (n) {
    return (Number(n) || 0).toLocaleString('es-CO');
  };

  P.pct = function (a, b) {
    return b ? Math.round((a / b) * 1000) / 10 : 0;
  };

  P.fecha = function (iso) {
    if (!iso) return null;
    var p = String(iso).slice(0, 10).split('-');
    return { anio: p[0], mes: MESES[Number(p[1]) - 1], mesL: MESES_L[Number(p[1]) - 1], dia: String(Number(p[2])) };
  };

  P.fechaLarga = function (iso, hora) {
    var f = P.fecha(iso);
    if (!f) return 'Sin fecha';
    return f.mesL + ' ' + f.dia + ', ' + f.anio + (hora ? ' • ' + hora : '');
  };

  P.fechaHora = function (iso) {
    if (!iso) return '';
    var d = new Date(iso);
    var hoy = P.hoy();
    var dia = d.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    var hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' });
    if (dia === hoy) return 'Hoy, ' + hora + ' hrs';
    var ayer = new Date(Date.now() - 864e5).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
    if (dia === ayer) return 'Ayer, ' + hora + ' hrs';
    var f = P.fecha(dia);
    return f.dia + ' ' + f.mesL + ', ' + hora + ' hrs';
  };

  P.hace = function (iso) {
    if (!iso) return '';
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'Hace un momento';
    if (s < 3600) return 'Hace ' + Math.floor(s / 60) + 'm';
    if (s < 86400) return 'Hace ' + Math.floor(s / 3600) + 'h';
    if (s < 86400 * 30) return 'Hace ' + Math.floor(s / 86400) + 'd';
    return P.fechaHora(iso);
  };

  P.iniciales = function (a, b) {
    var t = ((a || '') + ' ' + (b || '')).trim().split(/\s+/);
    return ((t[0] || '?')[0] + (t[1] ? t[1][0] : '')).toUpperCase();
  };

  P.nombre = function (a) {
    return ((a.nombre || '') + ' ' + (a.apellido || '')).trim() || 'Sin nombre';
  };

  P.grupoEvento = function (e) {
    if (e.estado === 'borrador') return 'draft';
    if (e.estado === 'archivado') return 'archived';
    if (e.fecha && e.fecha < P.hoy()) return 'past';
    return 'upcoming';
  };

  P.formatoLabel = function (f) {
    return { presencial: 'Presencial', virtual: 'Remoto', hibrido: 'Híbrido' }[f] || 'Presencial';
  };

  P.evento = function (id) {
    return (P.d && P.d.eventos.find(function (e) { return e.id === id; })) || null;
  };

  P.asistentesDe = function (id) {
    return (P.d ? P.d.asistentes : []).filter(function (a) { return !id || a.evento_id === id; });
  };

  /* ---------- Datos ---------- */

  P.cargar = function () {
    return fetch('/api/panel/data', { cache: 'no-store' }).then(function (r) {
      if (r.status === 401) {
        location.href = '/login?next=' + encodeURIComponent(location.pathname);
        return Promise.reject(new Error('sesion'));
      }
      return r.json();
    }).then(function (j) {
      if (!j.ok) throw new Error(j.error || 'No se pudo cargar');
      P.d = j;
      P.sidebar();
      return j;
    });
  };

  P.op = function (body) {
    return fetch('/api/panel/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: 'Sin conexión con el servidor' }; })
      .then(function (j) {
        if (!j.ok) P.toast(j.error || 'No se pudo guardar', 'error');
        return j;
      });
  };

  P.crear = function (tabla, valores) { return P.op({ op: 'crear', tabla: tabla, valores: valores }); };
  P.editar = function (tabla, id, valores) { return P.op({ op: 'editar', tabla: tabla, id: id, valores: valores }); };
  P.eliminar = function (tabla, id) { return P.op({ op: 'eliminar', tabla: tabla, id: id }); };

  /* ---------- Avisos ---------- */

  P.toast = function (msg, tipo) {
    var box = document.getElementById('p-toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'p-toasts';
      box.className = 'fixed bottom-5 right-5 z-[80] flex flex-col gap-2 items-end';
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    var err = tipo === 'error';
    el.className =
      'px-4 py-2.5 rounded-xl shadow-lg font-label-md text-label-md flex items-center gap-2 max-w-sm ' +
      (err ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary');
    el.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">' + (err ? 'error' : 'check_circle') + '</span><span>' + P.esc(msg) + '</span>';
    box.appendChild(el);
    setTimeout(function () { el.remove(); }, err ? 6000 : 3200);
  };

  P.confirmar = function (titulo, texto, boton) {
    return new Promise(function (resolve) {
      P.modal({
        titulo: titulo,
        texto: texto,
        campos: [],
        textoGuardar: boton || 'Eliminar',
        peligro: true,
        onGuardar: function () { resolve(true); return true; },
        onCerrar: function () { resolve(false); },
      });
    });
  };

  /* ---------- Modal con el estilo de "Crear Nuevo Evento" ---------- */

  var INPUT = 'w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface outline-none focus:bg-surface-container font-body-sm text-body-sm';

  function campoHtml(c, v) {
    var val = v == null ? (c.defecto == null ? '' : c.defecto) : v;
    var req = c.requerido ? ' required' : '';
    var ph = c.placeholder ? ' placeholder="' + P.esc(c.placeholder) + '"' : '';
    var control;
    if (c.tipo === 'select') {
      control =
        '<select name="' + c.nombre + '" class="' + INPUT + '"' + req + '>' +
        c.opciones.map(function (o) {
          var ov = typeof o === 'object' ? o.v : o;
          var ol = typeof o === 'object' ? o.l : o;
          return '<option value="' + P.esc(ov) + '"' + (String(ov) === String(val) ? ' selected' : '') + '>' + P.esc(ol) + '</option>';
        }).join('') +
        '</select>';
    } else if (c.tipo === 'textarea') {
      control = '<textarea name="' + c.nombre + '" rows="' + (c.filas || 3) + '" class="' + INPUT + ' resize-y"' + req + ph + '>' + P.esc(val) + '</textarea>';
    } else if (c.tipo === 'checkbox') {
      return (
        '<label class="' + (c.mitad ? '' : 'col-span-2 ') + 'flex items-center gap-2.5 font-label-md text-label-md text-on-surface cursor-pointer py-1">' +
        '<input type="checkbox" name="' + c.nombre + '" class="w-4 h-4 accent-[#4648d4]"' + (val ? ' checked' : '') + '>' + P.esc(c.etiqueta) + '</label>'
      );
    } else {
      control = '<input type="' + (c.tipo || 'text') + '" name="' + c.nombre + '" value="' + P.esc(val) + '" class="' + INPUT + '"' + req + ph + (c.paso ? ' step="' + c.paso + '"' : '') + '>';
    }
    return (
      '<div class="' + (c.mitad ? '' : 'col-span-2') + '"><label class="font-label-md text-label-md text-on-surface block mb-1">' +
      P.esc(c.etiqueta) + (c.requerido ? ' <span class="text-error">*</span>' : '') + '</label>' + control +
      (c.ayuda ? '<p class="font-label-sm text-[11px] text-on-surface-variant mt-1">' + P.esc(c.ayuda) + '</p>' : '') + '</div>'
    );
  }

  P.modal = function (cfg) {
    var valores = cfg.valores || {};
    var wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 bg-primary/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
    wrap.innerHTML =
      '<form class="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">' +
      '<div class="flex items-start justify-between gap-4"><div><h3 class="font-headline-lg text-headline-lg font-bold text-on-surface">' + P.esc(cfg.titulo) + '</h3>' +
      (cfg.subtitulo ? '<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">' + P.esc(cfg.subtitulo) + '</p>' : '') + '</div>' +
      '<button type="button" data-cerrar class="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[20px]">close</span></button></div>' +
      (cfg.texto ? '<p class="font-body-md text-body-md text-on-surface-variant">' + P.esc(cfg.texto) + '</p>' : '') +
      (cfg.campos.length ? '<div class="grid grid-cols-2 gap-x-3 gap-y-4">' + cfg.campos.map(function (c) { return campoHtml(c, valores[c.nombre]); }).join('') + '</div>' : '') +
      '<div class="flex items-center justify-between gap-3 pt-2"><div>' +
      (cfg.onEliminar
        ? '<button type="button" data-eliminar class="px-3 py-2 rounded-lg hover:bg-error-container text-error font-label-md text-label-md flex items-center gap-1.5 transition-colors"><span class="material-symbols-outlined text-[16px]">delete</span>Eliminar</button>'
        : '') +
      '</div><div class="flex items-center gap-3"><button type="button" data-cerrar class="px-4 py-2 rounded-lg hover:bg-surface-container font-label-md text-label-md text-on-surface transition-colors">Cancelar</button>' +
      '<button type="submit" class="px-5 py-2 rounded-lg ' + (cfg.peligro ? 'bg-error text-on-error' : 'bg-primary hover:bg-primary-container text-on-primary') +
      ' font-label-md text-label-md transition-all shadow-sm disabled:opacity-50">' + P.esc(cfg.textoGuardar || 'Guardar') + '</button></div></div></form>';

    var form = wrap.querySelector('form');
    var cerrado = false;
    function cerrar(conCallback) {
      if (cerrado) return;
      cerrado = true;
      wrap.remove();
      if (conCallback && cfg.onCerrar) cfg.onCerrar();
    }
    wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) cerrar(true); });
    wrap.querySelectorAll('[data-cerrar]').forEach(function (b) { b.addEventListener('click', function () { cerrar(true); }); });
    var del = wrap.querySelector('[data-eliminar]');
    if (del) del.addEventListener('click', function () {
      Promise.resolve(cfg.onEliminar()).then(function (ok) { if (ok !== false) cerrar(false); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = {};
      cfg.campos.forEach(function (c) {
        var el = form.elements[c.nombre];
        if (!el) return;
        if (c.tipo === 'checkbox') out[c.nombre] = el.checked;
        else if (c.tipo === 'number') out[c.nombre] = el.value === '' ? null : Number(el.value);
        else out[c.nombre] = el.value.trim();
      });
      var btn = form.querySelector('[type=submit]');
      btn.disabled = true;
      Promise.resolve(cfg.onGuardar(out)).then(function (ok) {
        if (ok === false) btn.disabled = false;
        else cerrar(false);
      });
    });
    document.body.appendChild(wrap);
    var first = form.querySelector('input:not([type=checkbox]),textarea,select');
    if (first) first.focus();
    return wrap;
  };

  /* ---------- Menú desplegable genérico ---------- */

  P.menu = function (ancla, items) {
    document.querySelectorAll('.p-menu').forEach(function (m) { m.remove(); });
    var r = ancla.getBoundingClientRect();
    var m = document.createElement('div');
    m.className = 'p-menu fixed z-[75] min-w-[220px] max-w-[320px] bg-surface-container-lowest rounded-xl shadow-lg p-1.5 max-h-[60vh] overflow-y-auto';
    m.style.top = Math.min(r.bottom + 6, window.innerHeight - 80) + 'px';
    m.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 330)) + 'px';
    items.forEach(function (it) {
      if (it.sep) {
        var hr = document.createElement('div');
        hr.className = 'h-px bg-surface-container my-1';
        m.appendChild(hr);
        return;
      }
      var b = document.createElement('button');
      b.type = 'button';
      b.className =
        'w-full text-left px-3 py-1.5 rounded-lg text-body-sm flex items-center gap-2 ' +
        (it.peligro ? 'hover:bg-error-container text-error' : 'hover:bg-surface-container text-on-surface') +
        (it.activo ? ' bg-surface-container font-semibold' : '');
      b.innerHTML = (it.icono ? '<span class="material-symbols-outlined text-[16px]">' + it.icono + '</span>' : '') + '<span class="truncate">' + P.esc(it.texto) + '</span>';
      b.addEventListener('click', function () { m.remove(); it.accion(); });
      m.appendChild(b);
    });
    document.body.appendChild(m);
    setTimeout(function () {
      document.addEventListener('mousedown', function fuera(e) {
        if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', fuera); }
      });
    }, 0);
  };

  /* ---------- Evento seleccionado (compartido entre pestañas) ---------- */

  P.eventoActualId = function () {
    var guardado = localStorage.getItem('snrg_evento');
    if (guardado && P.evento(guardado)) return guardado;
    var ev = P.d.eventos.filter(function (e) { return P.grupoEvento(e) === 'upcoming'; }).sort(function (a, b) { return (a.fecha || '').localeCompare(b.fecha || ''); })[0] || P.d.eventos[0];
    return ev ? ev.id : null;
  };

  P.elegirEvento = function (ancla, onPick, opciones) {
    var items = [];
    if (opciones && opciones.todos) items.push({ texto: 'Todos los eventos', icono: 'select_all', activo: !opciones.actual, accion: function () { onPick(null); } });
    P.d.eventos.forEach(function (e) {
      items.push({
        texto: e.titulo + (e.fecha ? ' · ' + P.fechaLarga(e.fecha) : ''),
        icono: 'event',
        activo: opciones && opciones.actual === e.id,
        accion: function () { localStorage.setItem('snrg_evento', e.id); onPick(e.id); },
      });
    });
    if (!items.length) items.push({ texto: 'Aún no hay eventos', icono: 'info', accion: function () {} });
    P.menu(ancla, items);
  };

  /* ---------- Utilidades DOM ---------- */

  P.porTexto = function (texto, raiz) {
    var nodos = (raiz || document).querySelectorAll('span,p,h1,h2,h3,label,button,a,div');
    for (var i = 0; i < nodos.length; i++) {
      var n = nodos[i];
      if (n.children.length === 0 && n.textContent.trim() === texto) return n;
    }
    for (var j = 0; j < nodos.length; j++) {
      if (nodos[j].textContent.trim() === texto) return nodos[j];
    }
    return null;
  };

  P.tarjeta = function (texto, sel) {
    var n = P.porTexto(texto);
    return n ? n.closest(sel || '.rounded-xl') : null;
  };

  P.boton = function (texto, raiz) {
    var bs = (raiz || document).querySelectorAll('button,a');
    for (var i = 0; i < bs.length; i++) if (bs[i].textContent.replace(/\s+/g, ' ').trim().indexOf(texto) !== -1) return bs[i];
    return null;
  };

  P.on = function (el, fn) {
    if (!el) return;
    var nuevo = el.cloneNode(true);
    nuevo.removeAttribute('onclick');
    el.parentNode.replaceChild(nuevo, el);
    nuevo.addEventListener('click', function (e) { e.preventDefault(); fn(e, nuevo); });
    return nuevo;
  };

  P.csv = function (nombre, filas) {
    if (!filas.length) { P.toast('No hay datos para exportar', 'error'); return; }
    var cols = Object.keys(filas[0]);
    var txt = [cols.join(',')].concat(filas.map(function (f) {
      return cols.map(function (c) { return '"' + String(f[c] == null ? '' : f[c]).replace(/"/g, '""') + '"'; }).join(',');
    })).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + txt], { type: 'text/csv;charset=utf-8' }));
    a.download = nombre;
    a.click();
  };

  P.vacio = function (icono, titulo, texto) {
    return (
      '<div class="p-8 flex flex-col items-center justify-center text-center gap-2">' +
      '<div class="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant"><span class="material-symbols-outlined text-[22px]">' + icono + '</span></div>' +
      '<p class="font-label-md text-label-md text-on-surface font-semibold">' + P.esc(titulo) + '</p>' +
      (texto ? '<p class="font-body-sm text-body-sm text-on-surface-variant max-w-sm">' + P.esc(texto) + '</p>' : '') + '</div>'
    );
  };

  /* ---------- Asistentes ---------- */

  P.OPC = {
    estado: [
      { v: 'confirmado', l: 'Confirmado / Pagado' },
      { v: 'por_aprobar', l: 'Pendiente aprobación' },
      { v: 'pago_pendiente', l: 'Pago pendiente' },
      { v: 'lista_espera', l: 'Lista de espera' },
      { v: 'rechazado', l: 'Rechazado' },
    ],
    genero: [{ v: '', l: 'Sin dato' }, { v: 'masculino', l: 'Masculino' }, { v: 'femenino', l: 'Femenino' }, { v: 'otro', l: 'No binario / Pref. no decir' }],
    edad: [{ v: '', l: 'Sin dato' }, '18-24', '25-34', '35-44', '45+'],
    tamano: [{ v: '', l: 'Sin dato' }, { v: '1-10', l: '1 - 10 colaboradores' }, { v: '11-50', l: '11 - 50 colaboradores' }, { v: '51-200', l: '51 - 200 colaboradores' }, { v: '200+', l: '200+ colaboradores' }],
    antiguedad: [{ v: '', l: 'Sin dato' }, { v: '0-1', l: '0 - 1 año' }, { v: '1-3', l: '1 - 3 años' }, { v: '3-5', l: '3 - 5 años' }, { v: '5+', l: '5+ años' }],
    formal: [{ v: '', l: 'Sin dato' }, { v: 'true', l: 'Sí, constituida' }, { v: 'false', l: 'No / en trámite' }],
  };

  P.estadoAsistente = function (a) {
    if (a.checked_in_at) return 'checkin';
    var e = a.estado_pago || 'confirmado';
    if (e === 'pagado' || e === 'aprobado') return 'confirmado';
    return e;
  };

  P.formAsistente = function (a, eventoId, despues) {
    var eventos = P.d.eventos.map(function (e) { return { v: e.id, l: e.titulo }; });
    var v = a ? Object.assign({}, a, { formalizada: a.formalizada == null ? '' : String(a.formalizada) }) : { evento_id: eventoId, estado_pago: 'confirmado' };
    var modal = P.modal({
      titulo: a ? 'Editar Asistente' : 'Invitar Asistente',
      subtitulo: a ? null : 'Se agrega directo a la lista del evento.',
      campos: [
        { nombre: 'nombre', etiqueta: 'Nombre', requerido: true, mitad: true },
        { nombre: 'apellido', etiqueta: 'Apellido', mitad: true },
        { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', mitad: true },
        { nombre: 'telefono', etiqueta: 'Celular', tipo: 'tel', mitad: true, placeholder: '300 123 4567' },
        { nombre: 'empresa', etiqueta: 'Empresa', mitad: true },
        { nombre: 'cargo', etiqueta: 'Cargo', mitad: true },
        { nombre: 'sector', etiqueta: 'Sector / vertical', mitad: true, placeholder: 'SaaS, FinTech…' },
        { nombre: 'tipo_ticket', etiqueta: 'Ticket / Categoría', mitad: true, placeholder: 'General, VIP…' },
        { nombre: 'evento_id', etiqueta: 'Evento', tipo: 'select', opciones: eventos, mitad: true },
        { nombre: 'estado_pago', etiqueta: 'Estado del registro', tipo: 'select', opciones: P.OPC.estado, mitad: true },
        { nombre: 'genero', etiqueta: 'Género', tipo: 'select', opciones: P.OPC.genero, mitad: true },
        { nombre: 'rango_edad', etiqueta: 'Rango de edad', tipo: 'select', opciones: P.OPC.edad, mitad: true },
        { nombre: 'tamano_equipo', etiqueta: 'Tamaño de la empresa', tipo: 'select', opciones: P.OPC.tamano, mitad: true },
        { nombre: 'antiguedad', etiqueta: 'Años de operación', tipo: 'select', opciones: P.OPC.antiguedad, mitad: true },
        { nombre: 'formalizada', etiqueta: 'Empresa constituida', tipo: 'select', opciones: P.OPC.formal },
      ],
      valores: v,
      textoGuardar: a ? 'Guardar cambios' : 'Agregar asistente',
      onGuardar: function (val) {
        val.formalizada = val.formalizada === '' ? null : val.formalizada === 'true';
        return (a ? P.editar('asistentes', a.id, val) : P.crear('asistentes', val)).then(function (r) {
          if (!r.ok) return false;
          P.toast(a ? 'Asistente actualizado' : 'Asistente agregado');
          if (despues) despues();
          return true;
        });
      },
      onEliminar: a ? function () { return P.borrarAsistente(a, despues); } : null,
    });
    var respuestas = a && a.respuestas ? Object.keys(a.respuestas) : [];
    if (!respuestas.length) return;
    modal.querySelector('form > .grid').insertAdjacentHTML('afterend',
      '<div class="rounded-xl bg-surface-container-low p-4 flex flex-col gap-3"><p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Respuestas del formulario</p>' +
      respuestas.map(function (k) {
        var val = a.respuestas[k];
        var txt = Array.isArray(val) ? val.join(', ') : String(val);
        var cuerpo = /^https?:\/\//.test(txt)
          ? '<a href="' + P.esc(txt) + '" target="_blank" class="text-secondary hover:underline inline-flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">open_in_new</span>Abrir archivo o enlace</a>'
          : P.esc(txt);
        return '<div><p class="font-label-md text-label-md text-on-surface">' + P.esc(k) + '</p><p class="font-body-sm text-body-sm text-on-surface-variant break-words">' + cuerpo + '</p></div>';
      }).join('') + '</div>'
    );
  };

  P.borrarAsistente = function (a, despues) {
    return P.confirmar('Eliminar asistente', P.nombre(a) + ' saldrá de la lista del evento. Esta acción no se puede deshacer.', 'Eliminar').then(function (ok) {
      if (!ok) return false;
      return P.eliminar('asistentes', a.id).then(function (r) {
        if (!r.ok) return false;
        P.toast('Asistente eliminado');
        if (despues) despues();
        return true;
      });
    });
  };

  /* ---------- Formulario de evento (crear / editar) ---------- */

  P.camposEvento = [
    { nombre: 'titulo', etiqueta: 'Nombre del Evento', requerido: true, placeholder: 'Ej. Founders Breakfast & Pitch Session' },
    { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', mitad: true },
    { nombre: 'formato', etiqueta: 'Formato', tipo: 'select', mitad: true, opciones: [{ v: 'presencial', l: 'Presencial' }, { v: 'virtual', l: 'Virtual / Remoto' }, { v: 'hibrido', l: 'Híbrido' }] },
    { nombre: 'hora_inicio', etiqueta: 'Hora inicio', tipo: 'time', mitad: true },
    { nombre: 'hora_fin', etiqueta: 'Hora fin', tipo: 'time', mitad: true },
    { nombre: 'lugar', etiqueta: 'Sede o Enlace', placeholder: 'Dirección física o link de streaming' },
    { nombre: 'ciudad', etiqueta: 'Ciudad', mitad: true, placeholder: 'Bogotá' },
    { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', mitad: true, opciones: [{ v: 'activo', l: 'Publicado' }, { v: 'borrador', l: 'Borrador' }, { v: 'archivado', l: 'Archivado' }] },
    { nombre: 'capacidad', etiqueta: 'Cupo máximo', tipo: 'number', mitad: true, placeholder: 'Sin límite' },
    { nombre: 'precio_cop', etiqueta: 'Precio (COP)', tipo: 'number', mitad: true, placeholder: '0 = gratis' },
    { nombre: 'image_url', etiqueta: 'Imagen de portada (URL)', placeholder: 'https://…' },
    { nombre: 'acerca_del_evento', etiqueta: 'Descripción', tipo: 'textarea' },
    { nombre: 'inscripcion_abierta', etiqueta: 'Inscripción abierta', tipo: 'checkbox', defecto: true },
  ];

  P.formEvento = function (ev, despues) {
    P.modal({
      titulo: ev ? 'Editar Evento' : 'Crear Nuevo Evento',
      subtitulo: ev ? 'Los cambios se guardan en Supabase al instante.' : null,
      campos: P.camposEvento,
      valores: ev || { formato: 'presencial', estado: 'activo', inscripcion_abierta: true },
      textoGuardar: ev ? 'Guardar cambios' : 'Guardar y Diseñar',
      onGuardar: function (v) {
        return (ev ? P.editar('eventos', ev.id, v) : P.crear('eventos', v)).then(function (r) {
          if (!r.ok) return false;
          P.toast(ev ? 'Evento actualizado' : 'Evento creado');
          if (!ev && r.fila) localStorage.setItem('snrg_evento', r.fila.id);
          if (despues) despues(r.fila);
          return true;
        });
      },
      onEliminar: ev ? function () { return P.borrarEvento(ev, despues); } : null,
    });
  };

  P.borrarEvento = function (ev, despues) {
    var n = P.asistentesDe(ev.id).length;
    return P.confirmar(
      'Eliminar evento',
      '“' + ev.titulo + '” se borrará junto con sus preguntas de formulario.' + (n ? ' Sus ' + n + ' asistentes quedarán sin evento asignado.' : ''),
      'Eliminar evento'
    ).then(function (ok) {
      if (!ok) return false;
      return P.eliminar('eventos', ev.id).then(function (r) {
        if (!r.ok) return false;
        P.toast('Evento eliminado');
        if (despues) despues(null);
        return true;
      });
    });
  };

  /* ---------- Barra lateral (igual en todas las pantallas) ---------- */

  P.sidebar = function () {
    var aside = document.querySelector('aside');
    if (!aside || !P.d) return;
    var email = (P.d.usuario && P.d.usuario.email) || '';
    var alias = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    var t;
    if ((t = P.porTexto('Venture Hub', aside))) t.textContent = 'Synergy';
    if ((t = P.porTexto('Pro Curator', aside))) t.textContent = 'Organización';
    if ((t = P.porTexto('Alex Rivera', aside))) t.textContent = alias || 'Equipo Synergy';
    if ((t = P.porTexto('alex@venture.co', aside))) t.textContent = email;
    var mes = P.hoy().slice(0, 7);
    var nMes = P.d.asistentes.filter(function (a) { return (a.created_at || '').slice(0, 7) === mes; }).length;
    var rs = aside.querySelector('p.font-semibold');
    aside.querySelectorAll('p').forEach(function (p) { if (/RSVPs|registros este mes/.test(p.textContent)) rs = p; });
    if (rs) rs.textContent = P.num(nMes) + ' registros este mes';

    var crear = P.boton('Crear Evento', aside);
    if (crear && !crear.dataset.p) {
      crear = P.on(crear, function () {
        if (window.P_PAGINA === 'dashboard') P.formEvento(null, function () { location.reload(); });
        else location.href = '/stitch/dashboard.html#crear';
      });
      crear.dataset.p = '1';
    }
    var mas = aside.querySelector('button .material-symbols-outlined');
    aside.querySelectorAll('button').forEach(function (b) { if (b.textContent.trim() === 'more_vert') mas = b; });
    if (mas && mas.tagName === 'BUTTON' && !mas.dataset.p) {
      mas = P.on(mas, function (e, el) {
        P.menu(el, [
          { texto: 'Ajustes de pagos', icono: 'settings', accion: function () { location.href = '/panel/ajustes'; } },
          { texto: 'Ir al sitio', icono: 'open_in_new', accion: function () { location.href = '/'; } },
          { sep: true },
          { texto: 'Cerrar sesión', icono: 'logout', peligro: true, accion: function () {
            fetch('/api/panel/salir', { method: 'POST' }).then(function () { location.href = '/login'; });
          } },
        ]);
      });
      mas.dataset.p = '1';
    }
  };

  P.iniciar = function (render) {
    P.cargar().then(render).catch(function (e) {
      if (e && e.message !== 'sesion') P.toast(e.message || 'No se pudo cargar el panel', 'error');
    });
  };
})();
