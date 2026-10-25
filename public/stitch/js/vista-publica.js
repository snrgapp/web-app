(function () {
  window.P_PAGINA = 'vista-publica';
  var st = { evento: null };

  function texto(viejo, nuevo) {
    var n = P.porTexto(viejo) || document.querySelector('[data-pv="' + viejo + '"]');
    if (!n) return null;
    n.setAttribute('data-pv', viejo);
    n.textContent = nuevo;
    return n;
  }

  function barra() {
    var b = document.getElementById('p-preview');
    if (b) return b;
    b = document.createElement('div');
    b.id = 'p-preview';
    b.className = 'sticky top-16 z-30 -mx-8 px-8 py-2.5 mb-4 bg-secondary-fixed/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3';
    b.innerHTML =
      '<div class="flex items-center gap-2 font-label-md text-label-md text-on-secondary-fixed"><span class="material-symbols-outlined text-[18px]">preview</span>Vista previa de <button id="p-preview-ev" class="underline font-bold"></button></div>' +
      '<div class="flex items-center gap-2"><button id="p-preview-editar" class="h-8 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">edit</span>Editar evento</button>' +
      '<a id="p-preview-real" target="_blank" class="h-8 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">open_in_new</span>Abrir página real</a></div>';
    var main = document.querySelector('main');
    main.insertBefore(b, main.firstChild);
    b.querySelector('#p-preview-ev').addEventListener('click', function (e) {
      P.elegirEvento(e.currentTarget, function (id) { st.evento = id; pintar(); }, { actual: st.evento });
    });
    b.querySelector('#p-preview-editar').addEventListener('click', function () {
      P.formEvento(P.evento(st.evento), function () { P.cargar().then(pintar); });
    });
    return b;
  }

  function pintar() {
    var e = P.evento(st.evento);
    var b = barra();
    if (!e) { b.querySelector('#p-preview-ev').textContent = 'ningún evento'; return; }
    b.querySelector('#p-preview-ev').textContent = e.titulo;
    st.url = '/evento/' + encodeURIComponent(e.checkin_slug || '');
    b.querySelector('#p-preview-real').href = st.url;

    var asis = P.asistentesDe(e.id);
    var cap = Number(e.capacidad) || 0;
    var hero = document.querySelector('main img');
    if (hero && e.image_url) hero.src = e.image_url;

    texto('Pocas entradas disponibles', cap ? (cap - asis.length > 0 ? (cap - asis.length) + ' cupos disponibles' : 'Cupos agotados') : e.inscripcion_abierta ? 'Inscripción abierta' : 'Inscripción cerrada');
    texto('Conferencia de Alto Impacto', P.formatoLabel(e.formato));
    texto('Ciudad de México • Edición Exclusiva', [e.ciudad, e.lugar].filter(Boolean).join(' • ') || 'Sede por confirmar');
    texto('+140', '+' + asis.length);

    var h1 = document.querySelector('main h1');
    h1.textContent = e.titulo;
    h1.nextElementSibling.textContent = e.acerca_del_evento || 'Pronto compartiremos todos los detalles de este encuentro.';

    var f = e.fecha ? new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha por confirmar';
    var fecha = texto('Jueves, 18 Octubre 2025', f.charAt(0).toUpperCase() + f.slice(1));
    if (fecha && fecha.nextElementSibling) fecha.nextElementSibling.textContent = (e.hora_inicio || '--:--') + ' — ' + (e.hora_fin || '--:--') + ' hrs GMT-5';
    var sede = texto('Auditorio Central, Torre Prisma', e.lugar || 'Sede por confirmar');
    if (sede && sede.nextElementSibling) sede.nextElementSibling.textContent = e.ciudad || '';
    var mapa = P.boton('Abrir en Mapas');
    if (mapa) mapa.href = 'https://maps.google.com/?q=' + encodeURIComponent([e.lugar, e.ciudad].filter(Boolean).join(', '));

    var agenda = document.getElementById('tab-agenda');
    if (agenda) {
      var bloques = Array.isArray(e.agenda) ? e.agenda : [];
      agenda.innerHTML = bloques.length
        ? bloques.map(function (x) {
            return '<div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-start gap-4"><span class="font-label-md text-label-md text-secondary shrink-0 pt-0.5">' + P.esc(x.inicio || '') + '</span>' +
              '<div class="flex flex-col gap-0.5"><h4 class="font-label-md text-label-md text-on-surface">' + P.esc(x.titulo) + '</h4><p class="font-body-sm text-body-sm text-on-surface-variant">' + P.esc([x.detalle, x.lugar].filter(Boolean).join(' · ')) + '</p></div></div>';
          }).join('')
        : '<div class="p-4 rounded-xl bg-surface-container-lowest shadow-sm font-body-sm text-body-sm text-on-surface-variant">La agenda se publica desde Formularios → Agenda y Cronograma.</div>';
    }
    var pol = P.porTexto('Política de Reembolso');
    if (pol && pol.nextElementSibling && P.d.ajustes && P.d.ajustes.politica_reembolso) pol.nextElementSibling.textContent = P.d.ajustes.politica_reembolso;

    var precio = document.getElementById('order-total-price');
    if (precio) precio.textContent = e.precio_cop ? P.cop(e.precio_cop) : 'Gratis';
    var cta = document.getElementById('btn-cta-text');
    if (cta) {
      var btn = cta.closest('button');
      if (btn && !btn.dataset.p) {
        btn.dataset.p = '1';
        btn.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); window.open(st.url, '_blank'); }, true);
      }
    }
  }

  P.iniciar(function () {
    st.evento = P.eventoActualId();
    pintar();
  });
})();
