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

  function pintar() {
    var vieja = document.getElementById('p-preview');
    if (vieja) vieja.remove();
    var e = P.evento(st.evento);
    if (!e) return;
    st.url = '/evento/' + encodeURIComponent(e.checkin_slug || '');

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

    var sponsors = document.getElementById('p-sponsors');
    if (!sponsors) {
      var host = document.querySelector('main h3');
      if (host && /Sponsors/.test(host.textContent || '')) sponsors = host.closest('div.p-5, div.p-6, div[class*=\"p-5\"]');
    }
    var listaSp = Array.isArray(e.patrocinadores) ? e.patrocinadores.filter(function (s) { return s && s.nombre; }) : [];
    if (sponsors) {
      sponsors.style.display = listaSp.length ? '' : 'none';
      var grid = sponsors.querySelector('.grid');
      if (grid && listaSp.length) {
        grid.innerHTML = listaSp.map(function (s) {
          var logo = s.logo_url
            ? '<img src="' + P.esc(s.logo_url) + '" alt="" class="w-full h-full object-contain p-1">'
            : '<span class="font-label-md text-label-md text-on-surface-variant">' + P.esc((s.nombre || '?').slice(0, 1)) + '</span>';
          var inner =
            '<div class="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center gap-2 text-center min-w-0 h-full">' +
            '<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">' + logo + '</div>' +
            '<div class="flex flex-col items-center min-w-0 w-full"><span class="font-label-md text-label-md text-on-surface leading-tight font-semibold truncate w-full">' + P.esc(s.nombre) + '</span>' +
            (s.rol ? '<span class="font-label-sm text-label-sm text-on-surface-variant truncate w-full">' + P.esc(s.rol) + '</span>' : '') +
            '</div></div>';
          return s.url ? '<a href="' + P.esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>' : inner;
        }).join('');
      }
    }

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
