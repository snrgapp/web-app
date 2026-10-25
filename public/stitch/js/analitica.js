(function () {
  window.P_PAGINA = 'analitica';
  var st = { evento: null };

  function lista() { return P.asistentesDe(st.evento); }
  function card(titulo) { return P.tarjeta(titulo); }
  function hora(t) { return new Date(t).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' }); }
  function contar(arr, campo) {
    var c = {};
    arr.forEach(function (a) { var v = a[campo]; if (v != null && v !== '') c[v] = (c[v] || 0) + 1; });
    return c;
  }
  function conDato(arr, campo) { return arr.filter(function (a) { return a[campo] != null && a[campo] !== ''; }).length; }
  function pct(n, t) { return t ? Math.round((n / t) * 100) : 0; }

  function cabecera() {
    var e = P.evento(st.evento);
    var t = document.getElementById('selectedEventTitle');
    if (t) t.textContent = e ? e.titulo : 'Consolidado Global (Todos)';
    var id = Array.prototype.find.call(document.querySelectorAll('main span'), function (s) { return /^ID: /.test(s.textContent.trim()); });
    if (id) id.textContent = 'ID: ' + (e ? (e.checkin_slug || e.id.slice(0, 8)).toUpperCase() : 'GLOBAL');
    var rango = P.porTexto('Últimos 30 días');
    if (!rango) rango = document.getElementById('p-rango');
    if (rango) { rango.id = 'p-rango'; rango.textContent = e && e.fecha ? P.fechaLarga(e.fecha) : P.d.eventos.length + ' eventos'; }
  }

  function kpis() {
    var e = P.evento(st.evento);
    var l = lista();
    var check = l.filter(function (a) { return a.checked_in_at; }).length;
    var tasa = pct(check, l.length);

    var k1 = card('Asistencia Efectiva');
    if (k1) {
      k1.querySelector('.text-\\[44px\\]').textContent = tasa + '%';
      var previo = P.d.eventos.filter(function (x) { return x.id !== st.evento && P.grupoEvento(x) === 'past'; })[0];
      var chip = k1.querySelector('.text-\\[44px\\]').nextElementSibling;
      var sub = k1.querySelector('p span');
      if (previo && st.evento) {
        var pa = P.asistentesDe(previo.id);
        var tp = pct(pa.filter(function (a) { return a.checked_in_at; }).length, pa.length);
        var d = tasa - tp;
        chip.innerHTML = '<span class="material-symbols-outlined text-[14px]">' + (d >= 0 ? 'trending_up' : 'trending_down') + '</span>' + (d >= 0 ? '+' : '') + d + '%';
        sub.textContent = 'vs. ' + tp + '% en ' + previo.titulo;
      } else {
        chip.innerHTML = '<span class="material-symbols-outlined text-[14px]">how_to_reg</span>' + check;
        sub.textContent = check + ' de ' + l.length + ' inscritos hicieron check-in';
      }
      k1.querySelector('.bg-secondary.h-1\\.5').style.width = tasa + '%';
    }

    var k2 = card('Asistentes Únicos');
    if (k2) {
      var cap = e && e.capacidad ? Number(e.capacidad) : 0;
      k2.querySelector('.text-\\[44px\\]').textContent = l.length;
      k2.querySelector('.text-\\[44px\\]').nextElementSibling.textContent = cap ? '/ ' + cap + ' cupos' : 'inscritos';
      var noShow = e && P.grupoEvento(e) === 'past' ? l.length - check : 0;
      k2.querySelector('p').innerHTML = e && P.grupoEvento(e) === 'past'
        ? '<strong class="text-on-surface font-semibold">' + noShow + '</strong> reservas no reclamadas (no-show)'
        : '<strong class="text-on-surface font-semibold">' + (l.length - check) + '</strong> aún sin check-in';
      var barras = k2.querySelectorAll('.flex > div.h-1\\.5');
      var base = cap || l.length;
      barras[0].style.width = Math.min(100, pct(l.length - noShow, base)) + '%';
      barras[1].style.width = Math.min(100, pct(noShow, base)) + '%';
    }

    var k3 = card('Permanencia en Sala');
    if (k3) {
      k3.querySelector('.uppercase').textContent = 'Duración del Evento';
      var dur = '—';
      if (e && e.hora_inicio && e.hora_fin) {
        var a = e.hora_inicio.split(':'), b = e.hora_fin.split(':');
        var min = (Number(b[0]) * 60 + Number(b[1])) - (Number(a[0]) * 60 + Number(a[1]));
        if (min > 0) dur = Math.floor(min / 60) + 'h ' + (min % 60 ? (min % 60) + 'm' : '');
      }
      k3.querySelector('.text-\\[44px\\]').textContent = dur.trim();
      var bloques = e && Array.isArray(e.agenda) ? e.agenda.length : 0;
      k3.querySelector('p').textContent = e ? (e.hora_inicio || '--:--') + ' a ' + (e.hora_fin || '--:--') + ' · ' + bloques + (bloques === 1 ? ' bloque' : ' bloques') + ' de agenda' : 'Elige un evento para ver su horario';
      k3.querySelector('.bg-secondary-container').style.width = dur === '—' ? '0%' : '100%';
    }

    var k4 = card('Organizaciones');
    if (k4) {
      var emp = {};
      l.forEach(function (a) { var x = String(a.empresa || '').trim().toLowerCase(); if (x) emp[x] = 1; });
      var n = Object.keys(emp).length;
      k4.querySelector('.text-\\[44px\\]').textContent = n;
      k4.querySelector('.text-\\[44px\\]').nextElementSibling.textContent = n ? (Math.round((conDato(l, 'empresa') / n) * 10) / 10) + ' pers/empresa' : 'sin empresas';
      k4.querySelector('p').textContent = pct(conDato(l, 'empresa'), l.length) + '% de los asistentes registró empresa';
      k4.querySelector('.bg-primary.h-1\\.5').style.width = pct(conDato(l, 'empresa'), l.length) + '%';
    }
  }

  function flujo() {
    var c = P.porTexto('Flujo de Llegada & Check-in');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var t = lista().filter(function (a) { return a.checked_in_at; }).map(function (a) { return new Date(a.checked_in_at).getTime(); }).sort();
    var e = P.evento(st.evento);
    var base;
    if (t.length) base = Math.floor(t[0] / 18e5) * 18e5;
    else {
      var h = (e && e.hora_inicio) || '18:00';
      base = new Date((e && e.fecha ? e.fecha : P.hoy()) + 'T' + h + ':00-05:00').getTime() - 18e5;
    }
    var slots = [0, 0, 0, 0, 0];
    t.forEach(function (x) { var i = Math.floor((x - base) / 18e5); slots[Math.max(0, Math.min(4, i))]++; });
    var max = Math.max.apply(null, slots);
    var pico = max ? slots.indexOf(max) : -1;
    var tonos = ['bg-secondary/10', 'bg-secondary/15', 'bg-secondary/35', 'bg-secondary/60', 'bg-secondary'];
    var html = slots.map(function (n, i) {
      var ini = hora(base + i * 18e5), fin = hora(base + (i + 1) * 18e5);
      var etiqueta = i === 4 ? ini + '+' : ini + ' - ' + fin;
      var ritmo = Math.round((n / 30) * 10) / 10;
      var r = max ? n / max : 0;
      var nivel = r === 0 ? 'Sin flujo' : r < 0.25 ? 'Bajo' : r < 0.5 ? 'Moderado' : r < 0.85 ? 'Medio' : 'Intenso';
      if (i === pico) {
        return '<div class="flex flex-col gap-2 p-3 rounded-lg bg-secondary-fixed/40 transition-colors relative"><span class="font-label-sm text-label-sm text-on-secondary-fixed font-bold">' + etiqueta + '</span>' +
          '<div class="h-20 w-full rounded-md bg-secondary text-on-secondary flex flex-col justify-end p-2 relative overflow-hidden shadow-sm"><span class="absolute top-1.5 right-1.5 text-[10px] uppercase font-bold tracking-widest bg-white/20 px-1 rounded">Peak</span><div class="font-headline-md text-[18px] font-bold">' + n + '</div><span class="font-label-sm text-[10px] text-on-secondary/80">check-ins</span></div>' +
          '<div class="flex items-center justify-between text-[11px] text-secondary font-semibold"><span>' + ritmo + '/min</span><span>' + nivel + '</span></div></div>';
      }
      var tono = r === 0 ? tonos[0] : r < 0.25 ? tonos[1] : r < 0.5 ? tonos[2] : tonos[3];
      var oscuro = r >= 0.5;
      return '<div class="flex flex-col gap-2 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"><span class="font-label-sm text-label-sm text-on-surface-variant">' + etiqueta + '</span>' +
        '<div class="h-20 w-full rounded-md ' + tono + (oscuro ? ' text-on-secondary' : '') + ' flex flex-col justify-end p-2 relative overflow-hidden"><div class="' + (oscuro ? '' : 'text-on-surface ') + 'font-headline-md text-[18px] font-bold">' + n + '</div><span class="font-label-sm text-[10px] ' + (oscuro ? 'text-on-secondary/80' : 'text-on-surface-variant') + '">' + (i === 4 ? 'tardíos' : 'check-ins') + '</span></div>' +
        '<div class="flex items-center justify-between text-[11px] text-on-surface-variant"><span>' + ritmo + '/min</span><span class="text-on-surface-variant/70">' + nivel + '</span></div></div>';
    }).join('');
    c.querySelector('.grid.grid-cols-5').innerHTML = html;

    var picoTxt = pico >= 0 ? hora(base + pico * 18e5) + ' hrs' : 'sin datos';
    var chip = c.querySelector('.font-mono');
    chip.textContent = 'Pico ' + picoTxt;
    var banner = c.querySelector('.mb-6.p-3\\.5');
    banner.querySelector('p.font-body-sm').innerHTML = pico >= 0
      ? picoTxt + ' • Tasa de entrada: <strong class="text-on-surface">' + (Math.round((max / 30) * 10) / 10) + ' escaneos/minuto</strong>'
      : 'Todavía no hay check-ins registrados para este evento.';
    banner.querySelector('.rounded-full').textContent = max / 30 > 2 ? 'Recepción congestionada' : t.length ? 'Recepción fluida' : 'Esperando llegadas';
    var pie = c.lastElementChild.querySelector('.font-mono');
    if (pie) pie.textContent = t.length + ' escaneos validados';
  }

  function verticales() {
    var c = P.porTexto('Verticales & Categorías');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var l = lista();
    var cuenta = contar(l, 'sector');
    var orden = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; });
    var total = l.length;
    var colores = ['bg-primary group-hover:bg-secondary', 'bg-secondary group-hover:bg-secondary-container', 'bg-on-surface-variant', 'bg-outline', 'bg-surface-variant'];
    var filas = [0, 1, 2, 3, 4].map(function (i) {
      var k = orden[i];
      var n = k ? cuenta[k] : 0;
      return '<div class="group"><div class="flex items-center justify-between text-body-sm mb-1.5"><span class="font-label-md text-label-md text-on-surface truncate pr-2">' + P.esc(k || (i === 0 ? 'Sin sector registrado' : '—')) + '</span>' +
        '<span class="font-label-md text-label-md text-on-surface font-mono shrink-0">' + pct(n, total) + '% <span class="text-on-surface-variant font-normal">(' + n + ')</span></span></div>' +
        '<div class="w-full h-3 bg-surface-container-low rounded-full overflow-hidden"><div class="h-full ' + colores[i] + ' rounded-full transition-all duration-700 ease-out" style="width:' + pct(n, total) + '%"></div></div></div>';
    }).join('');
    c.querySelector('.flex.flex-col.gap-4').innerHTML = filas;
    var pie = c.lastElementChild;
    pie.querySelector('span').textContent = orden[0] ? 'Predominancia: ' + orden[0] : 'Pide el sector en el formulario de registro';
    P.on(P.boton('Ver desglose', c), function () {
      P.modal({
        titulo: 'Desglose por sector',
        texto: orden.length ? orden.map(function (k) { return k + ': ' + cuenta[k] + ' (' + pct(cuenta[k], total) + '%)'; }).join('  ·  ') : 'Ningún asistente tiene sector registrado.',
        campos: [],
        textoGuardar: 'Ver asistentes',
        onGuardar: function () { location.href = '/stitch/asistentes.html'; return true; },
      });
    });
  }

  function genero() {
    var c = P.porTexto('Distribución por Género');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var l = lista();
    var cu = contar(l, 'genero');
    var vals = [cu.masculino || 0, cu.femenino || 0, cu.otro || 0];
    var con = vals[0] + vals[1] + vals[2];
    var C = 238.76, off = 0;
    var circ = c.querySelectorAll('svg circle');
    vals.forEach(function (v, i) {
      var len = con ? (v / con) * C : 0;
      circ[i + 1].setAttribute('stroke-dasharray', len.toFixed(2) + ' ' + C);
      circ[i + 1].setAttribute('stroke-dashoffset', (-off).toFixed(2));
      off += len;
    });
    var centro = c.querySelector('.absolute.inset-0 span');
    centro.textContent = con;
    var filas = c.querySelectorAll('.flex.flex-col.gap-3.min-w-0 > div');
    filas.forEach(function (f, i) {
      f.lastElementChild.innerHTML = pct(vals[i], con) + '% <span class="text-on-surface-variant font-normal">(' + vals[i] + ')</span>';
    });
    c.lastElementChild.querySelector('span').textContent = con < l.length ? (l.length - con) + ' asistentes sin género registrado' : 'Todos los asistentes con dato de género';
  }

  function edad() {
    var c = P.porTexto('Rangos de Edad');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var l = lista();
    var cu = contar(l, 'rango_edad');
    var rangos = ['18-24', '25-34', '35-44', '45+'];
    var vals = rangos.map(function (r) { return cu[r] || 0; });
    var con = vals.reduce(function (a, b) { return a + b; }, 0);
    var max = Math.max.apply(null, vals);
    var iMax = max ? vals.indexOf(max) : -1;
    c.querySelector('.grid.grid-cols-4').innerHTML = rangos.map(function (r, i) {
      var p = pct(vals[i], con);
      var alto = max ? Math.max(4, Math.round((vals[i] / max) * 100)) : 4;
      if (i === iMax) {
        return '<div class="flex flex-col items-center gap-2 h-full justify-end group"><div class="bg-secondary text-on-secondary px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight mb-1">Mayoría</div><span class="font-label-md text-label-md font-mono text-secondary font-bold">' + p + '%</span>' +
          '<div class="w-12 bg-secondary group-hover:bg-secondary-container rounded-t-lg shadow-sm transition-all" style="height:' + alto + '%"></div><span class="font-label-md text-label-md text-on-surface font-bold">' + r + '</span></div>';
      }
      return '<div class="flex flex-col items-center gap-2 h-full justify-end group"><span class="font-label-sm text-label-sm font-mono text-on-surface-variant group-hover:text-on-surface">' + p + '%</span>' +
        '<div class="w-12 ' + (i === 2 ? 'bg-primary group-hover:bg-primary-container' : 'bg-surface-container-highest group-hover:bg-primary-fixed-dim') + ' rounded-t-lg transition-all" style="height:' + alto + '%"></div><span class="font-label-md text-label-md text-on-surface-variant">' + r + '</span></div>';
    }).join('');
    var chip = c.querySelector('.font-mono.bg-secondary-fixed\\/50');
    if (chip) chip.textContent = iMax >= 0 ? 'Core: ' + rangos[iMax] + ' años' : 'Sin datos';
    c.lastElementChild.querySelector('span').textContent = con
      ? pct(vals[1] + vals[2], con) + '% de los asistentes tiene entre 25 y 44 años (' + con + ' con dato).'
      : 'Aún no hay rangos de edad registrados en los asistentes.';
  }

  function tamano() {
    var c = P.porTexto('1 - 10 colaboradores');
    if (!c) c = document.getElementById('p-tamano');
    if (!c) return;
    c = c.closest('.lg\\:col-span-4');
    c.id = 'p-tamano';
    var l = lista();
    var cu = contar(l, 'tamano_equipo');
    var keys = ['1-10', '11-50', '51-200', '200+'];
    var con = keys.reduce(function (s, k) { return s + (cu[k] || 0); }, 0);
    var filas = c.querySelectorAll('.flex.flex-col.gap-3\\.5 > div');
    filas.forEach(function (f, i) {
      var p = pct(cu[keys[i]] || 0, con);
      f.querySelector('.font-mono').textContent = p + '%';
      f.querySelector('.h-2\\.5.rounded-full:not(.w-full)').style.width = p + '%';
    });
    var max = keys.reduce(function (a, k) { return (cu[k] || 0) > (cu[a] || 0) ? k : a; }, keys[0]);
    c.lastElementChild.querySelector('span').textContent = con ? 'Predomina: ' + max + ' colaboradores (' + con + ' con dato)' : 'Sin datos de tamaño de empresa';
  }

  function antiguedad() {
    var c = P.porTexto('Antigüedad Comercial');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var l = lista();
    var cu = contar(l, 'antiguedad');
    var keys = ['0-1', '1-3', '3-5', '5+'];
    var con = keys.reduce(function (s, k) { return s + (cu[k] || 0); }, 0);
    var max = keys.reduce(function (a, k) { return (cu[k] || 0) > (cu[a] || 0) ? k : a; }, keys[1]);
    var tiles = c.querySelectorAll('.grid.grid-cols-2 > div');
    tiles.forEach(function (t, i) {
      var on = keys[i] === max && con;
      t.className = 'p-4 rounded-xl ' + (on ? 'bg-secondary-fixed/40' : 'bg-surface-container-low') + ' flex flex-col justify-between relative overflow-hidden';
      var spans = t.querySelectorAll('span');
      spans[0].className = 'font-label-sm text-label-sm ' + (on ? 'text-on-secondary-fixed font-semibold' : 'text-on-surface-variant');
      spans[1].className = 'font-display-lg text-[28px] font-bold leading-none ' + (on ? 'text-secondary' : 'text-on-surface');
      spans[1].textContent = pct(cu[keys[i]] || 0, con) + '%';
      spans[2].className = 'font-body-sm text-body-sm ' + (on ? 'text-on-secondary-fixed-variant font-medium' : 'text-on-surface-variant');
    });
    c.lastElementChild.querySelector('span').textContent = con
      ? 'Concentración en fase de tracción activa (' + pct((cu['1-3'] || 0) + (cu['3-5'] || 0), con) + '%)'
      : 'Sin datos de años de operación';
  }

  function formalizacion() {
    var c = P.porTexto('Formalización Jurídica');
    if (!c) return;
    c = c.closest('.rounded-xl');
    var l = lista();
    var si = l.filter(function (a) { return a.formalizada === true; }).length;
    var no = l.filter(function (a) { return a.formalizada === false; }).length;
    var con = si + no;
    var p = pct(si, con);
    c.querySelector('svg path.text-secondary').setAttribute('stroke-dasharray', p + ', 100');
    c.querySelector('.absolute.inset-0').textContent = p + '%';
    var filas = c.querySelectorAll('.space-y-2\\.5 > div');
    filas[0].lastElementChild.innerHTML = p + '% <span class="text-on-surface-variant font-normal">(' + si + ' orgs)</span>';
    filas[1].lastElementChild.innerHTML = pct(no, con) + '% <span class="text-on-surface-variant font-normal">(' + no + ' orgs)</span>';
    c.lastElementChild.querySelector('span').textContent = con ? con + ' asistentes con dato de formalización' : 'Sin datos de formalización';
  }

  function insight() {
    var t = P.porTexto('Lumina Cohort Digest • Calidad de Red Excelente');
    if (!t) t = document.getElementById('p-insight');
    if (!t) return;
    t.id = 'p-insight';
    var l = lista();
    var sectores = Object.keys(contar(l, 'sector')).length;
    var check = l.filter(function (a) { return a.checked_in_at; }).length;
    t.textContent = 'Resumen de la cohorte Synergy';
    t.nextElementSibling.textContent = l.length
      ? l.length + ' asistentes de ' + sectores + (sectores === 1 ? ' sector' : ' sectores') + '; ' + check + ' ya hicieron check-in (' + pct(check, l.length) + '%).'
      : 'Aún no hay asistentes en este evento.';
  }

  function exportar() {
    var e = P.evento(st.evento);
    P.csv('analitica-' + (e ? e.checkin_slug : 'global') + '.csv', lista().map(function (a) {
      return { nombre: P.nombre(a), empresa: a.empresa, sector: a.sector, genero: a.genero, rango_edad: a.rango_edad, tamano_empresa: a.tamano_equipo, antiguedad: a.antiguedad, formalizada: a.formalizada, check_in: a.checked_in_at || '' };
    }));
  }

  function pintar() {
    cabecera();
    kpis();
    flujo();
    verticales();
    genero();
    edad();
    tamano();
    antiguedad();
    formalizacion();
    insight();
  }

  function controles() {
    var menu = document.getElementById('eventDropdownMenu');
    if (menu) menu.remove();
    P.on(document.getElementById('eventSelectorBtn'), function (e, el) {
      P.elegirEvento(el, function (id) { st.evento = id; pintar(); }, { todos: true, actual: st.evento });
    });
    var main = document.querySelector('main');
    P.on(P.boton('Exportar Reporte (PDF/CSV)', main), exportar);
    P.on(P.boton('Segmentar Asistentes', main), function () { location.href = '/stitch/asistentes.html'; });
    P.on(P.boton('Follow-up por Cohorte', main), function () { location.href = '/stitch/notificaciones.html'; });
  }

  controles();
  P.iniciar(function () {
    st.evento = P.eventoActualId();
    pintar();
  });
})();
