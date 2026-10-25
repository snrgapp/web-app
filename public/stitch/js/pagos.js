(function () {
  window.P_PAGINA = 'pagos';
  var POR_PAGINA = 10;
  var st = { evento: null, dias: 0, canal: '', tab: 'todos', q: '', pagina: 1 };

  var CANAL = {
    whatsapp: ['WA', 'Coordinado por WhatsApp'],
    transferencia: ['TR', 'Transferencia bancaria'],
    efectivo: ['EF', 'Efectivo en puerta'],
    otro: ['OT', 'Otro medio'],
  };
  var ESTADOS = [
    { v: 'pendiente', l: 'Pendiente' },
    { v: 'comprobante', l: 'Comprobante recibido' },
    { v: 'aprobado', l: 'Completado / Aprobado' },
    { v: 'rechazado', l: 'Rechazado' },
    { v: 'reembolsado', l: 'Reembolsado' },
  ];

  function enRango(p) {
    if (st.evento && p.evento_id !== st.evento) return false;
    if (st.canal && (p.canal || 'whatsapp') !== st.canal) return false;
    if (st.dias && Date.now() - new Date(p.created_at).getTime() > st.dias * 864e5) return false;
    return true;
  }

  function grupo(p) {
    if (p.estado === 'aprobado') return 'aprobado';
    if (p.estado === 'reembolsado') return 'reembolsado';
    return 'retenido';
  }

  function lista() {
    var q = st.q.toLowerCase();
    return P.d.pagos.filter(function (p) {
      if (!enRango(p)) return false;
      if (st.tab !== 'todos' && grupo(p) !== st.tab) return false;
      if (q) {
        var ev = P.evento(p.evento_id);
        var t = [p.referencia, p.id, p.pagador, p.correo, p.correo_origen_pago, ev && ev.titulo, p.concepto].join(' ').toLowerCase();
        if (t.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function suma(arr) { return arr.reduce(function (s, p) { return s + (Number(p.monto_cop) || 0); }, 0); }

  function kpis() {
    var base = P.d.pagos.filter(enRango);
    var mes = P.hoy().slice(0, 7);
    var aprob = base.filter(function (p) { return p.estado === 'aprobado'; });
    var aprobMes = aprob.filter(function (p) { return (p.created_at || '').slice(0, 7) === mes; });
    var d = new Date(P.hoy() + 'T12:00:00'); d.setMonth(d.getMonth() - 1);
    var mesPrev = d.toISOString().slice(0, 7);
    var aprobPrev = aprob.filter(function (p) { return (p.created_at || '').slice(0, 7) === mesPrev; });
    var reemb = base.filter(function (p) { return p.estado === 'reembolsado'; });
    var pend = base.filter(function (p) { return p.estado === 'pendiente' || p.estado === 'comprobante'; });

    var t = P.porTexto('Saldo disponible');
    if (t) t.nextElementSibling.innerHTML = P.cop(suma(aprob)) + ' <span class="text-[11px] text-on-surface-variant font-normal">COP</span>';

    var k1 = P.tarjeta('Total Recaudado (Mes)');
    if (k1) {
      k1.querySelector('.font-headline-lg').textContent = P.cop(suma(aprobMes));
      k1.querySelector('.font-headline-lg').nextElementSibling.textContent = 'COP';
      var dv = suma(aprobPrev) ? Math.round(((suma(aprobMes) - suma(aprobPrev)) / suma(aprobPrev)) * 1000) / 10 : 0;
      k1.lastElementChild.querySelector('span:last-child').textContent = (dv >= 0 ? '+' : '') + dv + '% vs mes anterior';
    }
    var k2 = P.tarjeta('Transacciones Exitosas');
    if (k2) {
      k2.querySelector('.font-headline-lg').textContent = aprob.length;
      k2.lastElementChild.querySelector('span:last-child').textContent = Math.round(P.pct(aprob.length, base.length || 1)) + '% de los pagos registrados';
    }
    var k3 = P.tarjeta('Reembolsos Procesados');
    if (k3) {
      k3.querySelector('.font-headline-lg').textContent = reemb.length;
      k3.querySelector('.font-headline-lg').nextElementSibling.textContent = '(' + P.cop(suma(reemb)) + ' COP)';
      k3.lastElementChild.querySelector('span').textContent = 'Tasa ' + P.pct(reemb.length, base.length || 1) + '%';
    }
    var k4 = P.tarjeta('En Proceso de Acreditación');
    if (k4) {
      k4.querySelector('.font-headline-lg').textContent = P.cop(suma(pend));
      k4.querySelector('.font-headline-lg').nextElementSibling.textContent = 'COP';
      k4.lastElementChild.querySelector('span:last-child').textContent = pend.length + (pend.length === 1 ? ' pago por confirmar' : ' pagos por confirmar');
    }

    var tabs = document.querySelectorAll('main .border-t.border-surface-container > button');
    var cuenta = { todos: base.length, aprobado: 0, reembolsado: 0, retenido: 0 };
    base.forEach(function (p) { cuenta[grupo(p)]++; });
    var orden = ['todos', 'aprobado', 'reembolsado', 'retenido'];
    tabs.forEach(function (b, i) {
      var k = orden[i];
      var sp = b.querySelectorAll('span');
      if (k === 'retenido') sp[0].textContent = 'Pendientes / Retenidos';
      sp[1].textContent = cuenta[k];
      var on = st.tab === k;
      b.classList.toggle('bg-surface-container', on);
      b.classList.toggle('text-on-surface', on);
      b.classList.toggle('font-semibold', on);
      b.classList.toggle('text-on-surface-variant', !on);
      if (!b.dataset.p) { b.dataset.p = '1'; b.addEventListener('click', function () { st.tab = k; st.pagina = 1; pintar(); }); }
    });
  }

  function pill(p) {
    var e = p.estado || 'pendiente';
    if (e === 'aprobado') return '<span class="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed"></span>Completado / Aprobado</span>';
    if (e === 'reembolsado') return '<span class="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Reembolsado Total</span>';
    if (e === 'rechazado') return '<span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Rechazado</span>';
    if (e === 'comprobante') return '<span class="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Comprobante recibido</span>';
    return '<span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>Pendiente</span>';
  }

  function fila(p) {
    var ev = P.evento(p.evento_id);
    var c = CANAL[p.canal] || CANAL.whatsapp;
    var reemb = p.estado === 'reembolsado';
    var n = Number(p.entradas) || 1;
    var ref = p.referencia || '#SNRG-' + String(p.id).slice(0, 6).toUpperCase();
    var acciones;
    if (reemb) {
      acciones = '<span class="font-label-sm text-[11px] text-on-surface-variant italic">Devolución ejecutada</span><button data-acc="ver" class="p-1 rounded text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[16px]">info</span></button>';
    } else if (p.estado === 'aprobado') {
      acciones =
        '<button data-acc="ver" class="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">receipt</span><span>Ver Recibo</span></button>' +
        '<button data-acc="reembolso" class="px-2.5 py-1 rounded-md bg-error-container/40 hover:bg-error-container text-error font-label-sm text-[12px] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">replay</span><span>Emitir Reembolso</span></button>';
    } else {
      acciones =
        '<button data-acc="ver" class="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-[12px] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">receipt</span><span>Ver</span></button>' +
        '<button data-acc="aprobar" class="px-2.5 py-1 rounded-md bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[12px] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check</span><span>Aprobar</span></button>' +
        (p.estado !== 'rechazado' ? '<button data-acc="rechazar" class="px-2.5 py-1 rounded-md bg-error-container/40 hover:bg-error-container text-error font-label-sm text-[12px] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">close</span><span>Rechazar</span></button>' : '');
    }
    var sub = { aprobado: p.confirmacion_enviada_at ? 'Confirmación enviada por correo' : p.confirmacion_error ? 'Correo de confirmación no enviado' : 'Pago confirmado', reembolsado: 'Reembolsado', rechazado: 'No se acreditó', comprobante: 'Revisar comprobante', pendiente: 'Esperando pago' }[p.estado] || 'Esperando pago';
    return (
      '<tr data-id="' + p.id + '" class="' + (reemb ? 'bg-error-container/10 hover:bg-error-container/20' : 'hover:bg-surface-container-low/40') + ' transition-colors">' +
      '<td class="py-4 px-4"><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg ' + (reemb ? 'bg-surface-container text-on-surface-variant' : 'bg-primary-container text-on-primary') + ' flex items-center justify-center text-[10px] font-bold shrink-0">' + c[0] + '</div>' +
      '<div class="flex flex-col"><span class="font-mono font-medium text-[13px] text-on-surface' + (reemb ? ' line-through' : '') + '">' + P.esc(ref) + '</span><span class="text-[11px] ' + (reemb ? 'text-on-error-container' : 'text-on-surface-variant') + '">' + c[1] + '</span></div></div></td>' +
      '<td class="py-4 px-4"><div class="flex flex-col"><span class="font-medium text-on-surface">' + P.esc(p.pagador || 'Sin nombre') + '</span><span class="text-[12px] text-on-surface-variant">' + P.esc(p.correo || p.correo_origen_pago || '—') + '</span></div></td>' +
      '<td class="py-4 px-4"><div class="flex flex-col"><span class="font-medium text-on-surface">' + P.esc(p.concepto || 'Pase General') + (n > 1 ? ' (x' + n + ')' : '') + '</span><span class="text-[11px] ' + (reemb ? 'text-error font-medium' : 'text-on-surface-variant') + '">' + n + (n === 1 ? ' entrada' : ' entradas') + ' • ' + P.esc(ev ? ev.titulo : 'Sin evento') + '</span></div></td>' +
      '<td class="py-4 px-4 font-bold text-[14px] ' + (reemb ? 'text-error' : 'text-on-surface') + '">' + (reemb ? '-' : '') + P.cop(p.monto_cop) + ' <span class="text-[11px] font-normal text-on-surface-variant">COP</span></td>' +
      '<td class="py-4 px-4 text-on-surface-variant text-[13px]"><div class="flex flex-col"><span class="text-on-surface font-medium">' + P.fechaHora(p.created_at) + '</span><span class="text-[11px]' + (reemb ? ' text-error' : '') + '">' + sub + '</span></div></td>' +
      '<td class="py-4 px-4">' + pill(p) + '</td>' +
      '<td class="py-4 px-4 text-right"><div class="inline-flex items-center gap-1.5 justify-end">' + acciones + '</div></td></tr>'
    );
  }

  function tabla() {
    var l = lista();
    var paginas = Math.max(1, Math.ceil(l.length / POR_PAGINA));
    if (st.pagina > paginas) st.pagina = paginas;
    var desde = (st.pagina - 1) * POR_PAGINA;
    var pag = l.slice(desde, desde + POR_PAGINA);
    var tbody = document.querySelector('main table tbody');
    tbody.innerHTML = pag.length ? pag.map(fila).join('') : '<tr><td colspan="7">' + P.vacio('receipt_long', 'Aún no hay pagos en esta vista', 'Registra los pagos que confirmas por WhatsApp con “Registrar Pago”.') + '</td></tr>';
    tbody.querySelectorAll('tr[data-id]').forEach(function (tr) {
      var p = P.d.pagos.find(function (x) { return x.id === tr.dataset.id; });
      tr.querySelectorAll('[data-acc]').forEach(function (b) {
        b.addEventListener('click', function () { accion(b.dataset.acc, p); });
      });
    });
    var pie = document.querySelector('main table').closest('.rounded-xl').lastElementChild;
    pie.firstElementChild.textContent = 'Mostrando ' + pag.length + ' de ' + l.length + ' transacciones';
    var der = pie.lastElementChild;
    var html = '<button data-p="prev" class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-medium disabled:opacity-40"' + (st.pagina === 1 ? ' disabled' : '') + '>Anterior</button>';
    for (var i = 1; i <= paginas && i <= 7; i++) {
      html += '<button data-p="' + i + '" class="px-2.5 py-1 rounded ' + (i === st.pagina ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-medium') + '">' + i + '</button>';
    }
    html += '<button data-p="next" class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-medium disabled:opacity-40"' + (st.pagina === paginas ? ' disabled' : '') + '>Siguiente</button>';
    der.innerHTML = html;
    der.querySelectorAll('[data-p]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.p;
        st.pagina = v === 'prev' ? st.pagina - 1 : v === 'next' ? st.pagina + 1 : Number(v);
        tabla();
      });
    });
  }

  function cambiar(p, valores, msg) {
    return P.editar('evento_pagos', p.id, valores).then(function (r) { if (r.ok) { P.toast(msg); avisoConfirmacion(r); recargar(); } return r.ok; });
  }

  function avisoConfirmacion(r) {
    if (!r.confirmacion) return;
    if (r.confirmacion.ok) P.toast('Correo de confirmación enviado a ' + r.confirmacion.correo);
    else P.toast(r.confirmacion.error || 'No se pudo enviar el correo de confirmación', 'error');
  }

  function urlComprobante(v) {
    if (!v) return '';
    return /^https?:\/\//.test(v) ? v : '/api/panel/comprobante?ruta=' + encodeURIComponent(v);
  }

  function accion(acc, p) {
    if (acc === 'ver') return formPago(p);
    if (acc === 'aprobar') {
      if (!p.comprobante_url) {
        P.toast('Sube el comprobante para aprobar el pago y enviar la confirmación');
        return formPago(p, { estado: 'aprobado' });
      }
      return cambiar(p, { estado: 'aprobado' }, 'Pago aprobado').then(function (ok) {
        if (ok && p.asistente_id) P.editar('asistentes', p.asistente_id, { estado_pago: 'confirmado' });
      });
    }
    if (acc === 'rechazar') return cambiar(p, { estado: 'rechazado' }, 'Pago rechazado');
    if (acc === 'reembolso') {
      P.confirmar('Emitir reembolso', 'Marca el pago de ' + (p.pagador || 'este asistente') + ' por ' + P.cop(p.monto_cop) + ' COP como reembolsado. La devolución del dinero la haces tú por el mismo medio de pago.', 'Marcar reembolsado').then(function (ok) {
        if (ok) cambiar(p, { estado: 'reembolsado' }, 'Reembolso registrado');
      });
    }
  }

  function formPago(p, extra) {
    var evId = (p && p.evento_id) || st.evento || P.eventoActualId();
    var asist = P.asistentesDe(evId).map(function (a) { return { v: a.id, l: P.nombre(a) + (a.correo ? ' · ' + a.correo : '') }; });
    var modal = P.modal({
      titulo: p ? 'Detalle del Pago' : 'Registrar Pago',
      subtitulo: p ? 'Registrado ' + P.fechaHora(p.created_at) : 'Pagos confirmados por WhatsApp, transferencia o en puerta.',
      campos: [
        { nombre: 'evento_id', etiqueta: 'Evento', tipo: 'select', opciones: P.d.eventos.map(function (e) { return { v: e.id, l: e.titulo }; }) },
        { nombre: 'asistente_id', etiqueta: 'Asistente (opcional)', tipo: 'select', opciones: [{ v: '', l: 'Sin vincular' }].concat(asist), ayuda: 'Al aprobar, el asistente queda como Confirmado / Pagado.' },
        { nombre: 'pagador', etiqueta: 'Pagador', mitad: true },
        { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', mitad: true },
        { nombre: 'monto_cop', etiqueta: 'Monto (COP)', tipo: 'number', requerido: true, mitad: true },
        { nombre: 'entradas', etiqueta: 'Entradas', tipo: 'number', mitad: true, defecto: 1 },
        { nombre: 'concepto', etiqueta: 'Ticket / Concepto', mitad: true, placeholder: 'Pase General' },
        { nombre: 'canal', etiqueta: 'Medio', tipo: 'select', mitad: true, opciones: [{ v: 'whatsapp', l: 'WhatsApp' }, { v: 'transferencia', l: 'Transferencia' }, { v: 'efectivo', l: 'Efectivo' }, { v: 'otro', l: 'Otro' }] },
        { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', mitad: true, opciones: ESTADOS },
        { nombre: 'referencia', etiqueta: 'Referencia', mitad: true, placeholder: '#Nequi-123' },
        { nombre: 'comprobante_url', etiqueta: 'Comprobante de pago', placeholder: 'Sube el archivo o pega un link https://…', ayuda: 'Con comprobante y estado Completado / Aprobado, la persona recibe el correo de confirmación.' },
        { nombre: 'notas', etiqueta: 'Notas', tipo: 'textarea', filas: 2 },
      ],
      valores: Object.assign({}, p || { evento_id: evId, canal: 'whatsapp', estado: 'aprobado', entradas: 1 }, extra),
      textoGuardar: p ? 'Guardar cambios' : 'Registrar pago',
      onGuardar: function (v) {
        if (v.asistente_id && !v.pagador) {
          var a = P.d.asistentes.find(function (x) { return x.id === v.asistente_id; });
          if (a) { v.pagador = P.nombre(a); if (!v.correo) v.correo = a.correo || ''; }
        }
        var req = p ? P.editar('evento_pagos', p.id, v) : P.crear('evento_pagos', v);
        return req.then(function (r) {
          if (!r.ok) return false;
          if (v.estado === 'aprobado' && v.asistente_id) P.editar('asistentes', v.asistente_id, { estado_pago: 'confirmado' });
          P.toast(p ? 'Pago actualizado' : 'Pago registrado');
          avisoConfirmacion(r);
          recargar();
          return true;
        });
      },
      onEliminar: p ? function () {
        return P.confirmar('Eliminar pago', 'Se borrará este registro de pago. No se puede deshacer.', 'Eliminar').then(function (ok) {
          if (!ok) return false;
          return P.eliminar('evento_pagos', p.id).then(function (r) { if (r.ok) { P.toast('Pago eliminado'); recargar(); } return r.ok; });
        });
      } : null,
    });
    adjuntos(modal, p);
  }

  function adjuntos(modal, p) {
    var input = modal.querySelector('[name=comprobante_url]');
    input.insertAdjacentHTML('afterend',
      '<div class="flex flex-wrap items-center gap-2 mt-2">' +
      '<label class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 cursor-pointer transition-colors"><span class="material-symbols-outlined text-[16px]">upload_file</span><span data-adj="texto">Subir archivo</span>' +
      '<input data-adj="archivo" type="file" accept="image/png,image/jpeg,image/webp,image/heic,application/pdf" class="hidden"></label>' +
      '<a data-adj="abrir" target="_blank" class="font-label-sm text-label-sm text-secondary hover:underline items-center gap-1 hidden"><span class="material-symbols-outlined text-[14px]">open_in_new</span>Abrir comprobante</a></div>'
    );
    var abrir = modal.querySelector('[data-adj=abrir]');
    function mostrarAbrir() {
      var url = urlComprobante(input.value.trim());
      abrir.classList.toggle('hidden', !url);
      abrir.classList.toggle('inline-flex', !!url);
      if (url) abrir.href = url;
    }
    mostrarAbrir();
    input.addEventListener('input', mostrarAbrir);

    modal.querySelector('[data-adj=archivo]').addEventListener('change', function (e) {
      var archivo = e.target.files[0];
      if (!archivo) return;
      var texto = modal.querySelector('[data-adj=texto]');
      var guardar = modal.querySelector('[type=submit]');
      texto.textContent = 'Subiendo…';
      guardar.disabled = true;
      var fd = new FormData();
      fd.append('archivo', archivo);
      fetch('/api/panel/comprobante', { method: 'POST', body: fd })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, error: 'Sin conexión con el servidor' }; })
        .then(function (j) {
          guardar.disabled = false;
          e.target.value = '';
          if (!j.ok) { texto.textContent = 'Subir archivo'; P.toast(j.error || 'No se pudo subir el archivo', 'error'); return; }
          input.value = j.ruta;
          texto.textContent = 'Cambiar archivo';
          mostrarAbrir();
          P.toast('Comprobante subido. Guarda el pago para aplicarlo.');
        });
    });

    if (!p || p.estado !== 'aprobado') return;
    var enviado = p.confirmacion_enviada_at;
    var acciones = modal.querySelector('[data-eliminar]').parentElement;
    acciones.insertAdjacentHTML('beforebegin',
      '<div class="rounded-xl p-3 flex items-center justify-between gap-3 ' + (enviado ? 'bg-tertiary-fixed/30' : 'bg-error-container/30') + '">' +
      '<div class="flex items-start gap-2 min-w-0"><span class="material-symbols-outlined text-[18px] ' + (enviado ? 'text-on-tertiary-fixed' : 'text-error') + '">' + (enviado ? 'mark_email_read' : 'unsubscribe') + '</span>' +
      '<div class="min-w-0"><p class="font-label-md text-label-md text-on-surface">' + (enviado ? 'Confirmación enviada ' + P.fechaHora(enviado) : 'Confirmación sin enviar') + '</p>' +
      (!enviado && p.confirmacion_error ? '<p class="font-label-sm text-[11px] text-on-surface-variant break-words">' + P.esc(p.confirmacion_error) + '</p>' : '') + '</div></div>' +
      '<button type="button" data-adj="reenviar" class="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 shrink-0"><span class="material-symbols-outlined text-[14px]">send</span>' + (enviado ? 'Reenviar' : 'Enviar') + '</button></div>'
    );
    modal.querySelector('[data-adj=reenviar]').addEventListener('click', function (e) {
      var b = e.currentTarget;
      b.disabled = true;
      P.op({ op: 'reenviar_confirmacion', id: p.id }).then(function (r) {
        b.disabled = false;
        if (!r.ok) return;
        P.toast('Correo de confirmación enviado a ' + r.correo);
        modal.remove();
        recargar();
      });
    });
  }

  function filtros() {
    var main = document.querySelector('main');
    var btnEv = P.boton('Tech Founders Summit 2025', main);
    var btnDias = P.boton('Últimos 30 días', main);
    var btnCanal = P.boton('Mercado Pago / Todas', main);
    function label(b, txt) { b.querySelectorAll('span')[1].textContent = txt; }
    btnEv = P.on(btnEv, function (e, el) {
      P.elegirEvento(el, function (id) { st.evento = id; st.pagina = 1; label(el, id ? P.evento(id).titulo : 'Todos los eventos'); pintar(); }, { todos: true, actual: st.evento });
    });
    label(btnEv, 'Todos los eventos');
    btnDias = P.on(btnDias, function (e, el) {
      P.menu(el, [[7, 'Últimos 7 días'], [30, 'Últimos 30 días'], [90, 'Últimos 90 días'], [0, 'Todo el historial']].map(function (o) {
        return { texto: o[1], icono: 'calendar_today', activo: st.dias === o[0], accion: function () { st.dias = o[0]; label(el, o[1]); pintar(); } };
      }));
    });
    label(btnDias, 'Todo el historial');
    btnCanal = P.on(btnCanal, function (e, el) {
      P.menu(el, [['', 'Todos los medios'], ['whatsapp', 'WhatsApp'], ['transferencia', 'Transferencia'], ['efectivo', 'Efectivo'], ['otro', 'Otro']].map(function (o) {
        return { texto: o[1], icono: 'credit_card', activo: st.canal === o[0], accion: function () { st.canal = o[0]; label(el, o[1]); pintar(); } };
      }));
    });
    label(btnCanal, 'Todos los medios');

    var buscar = main.querySelector('input[placeholder^="Buscar por ID"]');
    buscar.addEventListener('input', function () { st.q = buscar.value; st.pagina = 1; tabla(); });

    P.on(P.boton('Exportar Reporte Contable (CSV)', main), function () {
      P.csv('pagos-synergy.csv', lista().map(function (p) {
        var ev = P.evento(p.evento_id);
        return { referencia: p.referencia || p.id, pagador: p.pagador, correo: p.correo, evento: ev ? ev.titulo : '', concepto: p.concepto, entradas: p.entradas, monto_cop: p.monto_cop, medio: p.canal, estado: p.estado, fecha: p.created_at, notas: p.notas };
      }));
    });
    var reg = P.on(P.boton('Filtros Rápidos', main), function () { formPago(null); });
    reg.querySelector('.material-symbols-outlined').textContent = 'add';
    reg.querySelectorAll('span')[1].textContent = 'Registrar Pago';
  }

  function textosWhatsApp() {
    var sub = P.porTexto('Monitoreo de cobros completados vía Mercado Pago, desglose por asistente, estados de liquidación y control de reembolsos directos.');
    if (sub) sub.textContent = 'Pagos coordinados por WhatsApp: registra cada cobro, concilia comprobantes y controla reembolsos por asistente.';
  }

  function tarjetasInferiores() {
    var aj = P.d.ajustes || {};
    var pol = P.tarjeta('Política de Reembolsos con un Clic');
    if (pol) {
      pol.querySelector('h3').textContent = 'Política de Reembolsos';
      pol.querySelector('h3').nextElementSibling.textContent = aj.whatsapp_pagos ? 'Pagos por WhatsApp · ' + aj.whatsapp_pagos : 'Pagos coordinados por WhatsApp';
      pol.querySelector('p.font-body-sm').textContent = aj.politica_reembolso || 'Aún no has escrito tu política. Define en qué casos devuelves el dinero y en cuánto tiempo; se la compartes al asistente por WhatsApp.';
      var b = P.on(P.boton('Revisar términos', pol), function () {
        P.modal({
          titulo: 'Política de reembolsos',
          campos: [
            { nombre: 'whatsapp_pagos', etiqueta: 'WhatsApp de pagos', tipo: 'tel', placeholder: '300 123 4567' },
            { nombre: 'politica_reembolso', etiqueta: 'Política', tipo: 'textarea', filas: 5 },
          ],
          valores: aj,
          onGuardar: guardarAjustes,
        });
      });
      b.querySelector('span').textContent = 'Editar política y WhatsApp de pagos';
    }

    var dis = P.tarjeta('Calendario de Dispersión Automática');
    if (dis) {
      dis.querySelector('h3').textContent = 'Calendario de Conciliación';
      dis.querySelector('h3').nextElementSibling.textContent = aj.cuenta_dispersion ? 'Cuenta: ' + aj.cuenta_dispersion : 'Sin cuenta registrada';
      var dia = aj.dia_dispersion || 'lunes';
      dis.querySelector('p.font-body-sm').textContent = 'Cada ' + dia + ' revisa los comprobantes recibidos y aprueba los pagos para que el asistente quede confirmado.';
      var pend = P.d.pagos.filter(function (p) { return p.estado === 'pendiente' || p.estado === 'comprobante'; });
      var fila = dis.querySelector('.pt-1');
      fila.innerHTML =
        '<span class="text-[12px] text-on-tertiary-container font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">check_circle</span>Por conciliar: ' + pend.length + ' pagos (' + P.cop(suma(pend)) + ' COP)</span>' +
        '<button class="text-secondary font-label-md text-label-md hover:underline flex items-center gap-1 ml-auto"><span class="material-symbols-outlined text-[16px]">edit</span>Editar</button>';
      fila.querySelector('button').addEventListener('click', function () {
        P.modal({
          titulo: 'Conciliación',
          campos: [
            { nombre: 'cuenta_dispersion', etiqueta: 'Cuenta donde recibes', placeholder: 'Bancolombia ahorros ***4092 / Nequi' },
            { nombre: 'dia_dispersion', etiqueta: 'Día de revisión', tipo: 'select', opciones: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] },
          ],
          valores: aj,
          onGuardar: guardarAjustes,
        });
      });
    }
  }

  function guardarAjustes(v) {
    return P.op({ op: 'ajustes', valores: v }).then(function (r) {
      if (!r.ok) return false;
      P.toast('Ajustes guardados');
      recargar();
      return true;
    });
  }

  function pintar() {
    kpis();
    tabla();
    tarjetasInferiores();
  }

  function recargar() { P.cargar().then(pintar); }

  textosWhatsApp();
  filtros();
  P.iniciar(pintar);
})();
