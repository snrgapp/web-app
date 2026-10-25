(function () {
  window.P_PAGINA = 'formularios';
  var st = { evento: null, guardado: null };

  var TIPOS = {
    nombre: ['badge', 'Nombre y Apellido'],
    texto: ['short_text', 'Texto Corto', 'badge'],
    parrafo: ['notes', 'Texto Largo'],
    si_no: ['toggle_on', 'Sí / No'],
    unica: ['radio_button_checked', 'Opción Única'],
    multiple: ['check_box', 'Opción Múltiple'],
    archivo: ['upload_file', 'Subir Archivo / PDF'],
    telefono: ['call', 'Teléfono / WhatsApp', 'call'],
    url: ['link', 'URL / Social Link', 'link'],
    numero: ['pin', 'Número Entero', 'pin'],
    email: ['alternate_email', 'Correo', 'domain'],
  };
  var PALETA = {
    'Nombre y Apellido': 'nombre', 'Texto Corto': 'texto', 'Texto Largo': 'parrafo', 'Sí / No Switch': 'si_no', 'Opción Única': 'unica', 'Opción Múltiple': 'multiple',
    'Subir Archivo / PDF': 'archivo', 'Teléfono / WhatsApp': 'telefono', 'URL / Social Link': 'url', 'Número Entero': 'numero',
  };

  function ev() { return P.evento(st.evento); }
  function campos() {
    return P.d.campos.filter(function (c) { return c.evento_id === st.evento; }).sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
  }
  function opciones(c) {
    var t = String(c.opciones || '');
    return (t.indexOf('\n') !== -1 ? t.split('\n') : t.split(',')).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function marcarGuardado() {
    st.guardado = new Date();
    var s = document.getElementById('p-guardado');
    if (s) s.innerHTML = '<span class="material-symbols-outlined text-[13px]">check_circle</span> Guardado en Supabase ' + P.hace(st.guardado.toISOString()).toLowerCase();
  }

  function guardarEvento(valores, msg) {
    return P.editar('eventos', st.evento, valores).then(function (r) {
      if (!r.ok) return false;
      Object.assign(ev(), r.fila || valores);
      marcarGuardado();
      if (msg) P.toast(msg);
      return true;
    });
  }

  /* ---------- Encabezado ---------- */

  function encabezado() {
    var e = ev();
    var h1 = document.querySelector('main section h1');
    h1.innerHTML = 'Formulario de Registro &amp; Admisión — ' + P.esc(e ? e.titulo : 'sin evento') + ' <span class="material-symbols-outlined text-[18px] align-middle text-on-surface-variant">expand_more</span>';
    h1.style.cursor = 'pointer';
    h1.onclick = function () { P.elegirEvento(h1, function (id) { st.evento = id; pintar(); }, { actual: st.evento }); };

    var cap = e && e.capacidad ? Number(e.capacidad) : 0;
    var n = P.asistentesDe(st.evento).length;
    document.querySelectorAll('main section span').forEach(function (s) {
      if (s.textContent.indexOf('Capacidad:') === 0) {
        s.textContent = 'Capacidad: ' + n + (cap ? ' / ' + cap : '') + ' cupos';
        var barra = s.nextElementSibling && s.nextElementSibling.firstElementChild;
        if (barra) { barra.className = 'h-full bg-primary rounded-full'; barra.style.width = (cap ? Math.min(100, Math.round((n / cap) * 100)) : 0) + '%'; }
      }
    });
    var badge = P.boton('Campos y Preguntas', document.querySelector('main section'));
    if (badge && badge.querySelector('.w-5')) badge.querySelector('.w-5').textContent = campos().length;
  }

  function controlesFijos() {
    var main = document.querySelector('main');
    document.querySelectorAll('main section span').forEach(function (s) {
      if (s.children.length === 1 && s.textContent.indexOf('Guardado automático') !== -1) s.id = 'p-guardado';
    });
    var g = document.getElementById('p-guardado');
    if (g) g.innerHTML = '<span class="material-symbols-outlined text-[13px]">check_circle</span> Sincronizado con Supabase';

    var atras = main.querySelector('section a[href="#"]');
    if (atras) atras.href = '/stitch/dashboard.html';

    P.on(P.boton('Ver como invitado', main), function () {
      var e = ev();
      if (e) window.open('/evento/' + encodeURIComponent(e.checkin_slug || ''), '_blank');
    });
    P.on(P.boton('Guardar y Publicar Cambios', main), function () {
      if (!ev()) return;
      guardarEvento({ estado: 'activo', inscripcion_abierta: true }, 'Evento publicado con inscripción abierta');
    });

    var detalles = P.tarjeta('Detalles Esenciales del Evento');
    var preguntas = P.porTexto('Cuerpo del Cuestionario');
    function ir(el) { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    P.on(P.boton('Detalles del Even', main), function () { ir(detalles); });
    P.on(P.boton('Campos y Preguntas', main), function () { ir(preguntas); });
    P.on(P.boton('Configuración de Entradas', main), function () { ir(document.getElementById('p-entradas')); });
    P.on(P.boton('Notificaciones por Email', main), function () { location.href = '/stitch/notificaciones.html'; });
    P.on(P.boton('Lógica Condicional', main), function () {
      P.toast('La lógica condicional aún no está disponible: por ahora todas las preguntas se muestran siempre.', 'error');
    });

    var paleta = main.querySelectorAll('section.grid > div:first-child .cursor-grab');
    paleta.forEach(function (item) {
      var titulo = item.querySelector('p').textContent.trim();
      item.classList.remove('cursor-grab', 'active:cursor-grabbing');
      item.classList.add('cursor-pointer');
      item.addEventListener('click', function () {
        if (PALETA[titulo]) return formCampo(null, PALETA[titulo]);
        ir(detalles);
      });
    });
    var buscar = main.querySelector('input[placeholder="Buscar componente..."]');
    if (buscar) buscar.addEventListener('input', function () {
      var q = buscar.value.toLowerCase();
      paleta.forEach(function (item) { item.style.display = item.textContent.toLowerCase().indexOf(q) === -1 ? 'none' : ''; });
    });
  }

  /* ---------- Detalles esenciales ---------- */

  function bloqueAgenda(b, i) {
    return (
      '<div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-2 group" data-i="' + i + '">' +
      '<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 flex-1 min-w-0">' +
      '<span class="material-symbols-outlined text-on-surface-variant text-[16px]">drag_handle</span>' +
      '<button data-ag="horas" class="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-body-sm text-[12px] font-semibold shrink-0"><span class="material-symbols-outlined text-[13px] text-secondary">schedule</span><span>' +
      P.esc((b.inicio || '--:--') + ' - ' + (b.fin || '--:--')) + '</span></button>' +
      '<input data-ag="titulo" type="text" value="' + P.esc(b.titulo) + '" placeholder="Nombre de la actividad" class="font-body-sm text-body-sm font-semibold text-on-surface bg-transparent border-b border-transparent hover:border-outline-variant/40 focus:border-secondary focus:outline-none flex-1 min-w-0">' +
      '</div><div class="flex items-center gap-1">' +
      '<button data-ag="horas" class="w-6 h-6 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center"><span class="material-symbols-outlined text-[15px]">edit</span></button>' +
      '<button data-ag="borrar" class="w-6 h-6 rounded hover:bg-surface-container text-on-surface-variant hover:text-error flex items-center justify-center"><span class="material-symbols-outlined text-[15px]">delete</span></button>' +
      '</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">' +
      '<div class="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-[12px]"><span class="material-symbols-outlined text-[14px]">person</span><input data-ag="detalle" type="text" value="' + P.esc(b.detalle) + '" placeholder="Host o speaker" class="bg-surface-container-low px-2 py-1 rounded w-full text-on-surface text-[12px] border border-transparent focus:border-outline-variant focus:outline-none"></div>' +
      '<div class="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-[12px]"><span class="material-symbols-outlined text-[14px]">pin_drop</span><input data-ag="lugar" type="text" value="' + P.esc(b.lugar) + '" placeholder="Sala o espacio" class="bg-surface-container-low px-2 py-1 rounded w-full text-on-surface text-[12px] border border-transparent focus:border-outline-variant focus:outline-none"></div>' +
      '</div></div>'
    );
  }

  function detalles() {
    var card = P.tarjeta('Detalles Esenciales del Evento');
    var e = ev();
    if (!card) return;
    var cuerpo = card.children[1] ? Array.prototype.slice.call(card.children, 1) : [];
    cuerpo.forEach(function (n) { n.remove(); });
    if (!e) {
      card.insertAdjacentHTML('beforeend', P.vacio('event', 'No hay eventos todavía', 'Crea un evento desde el dashboard para diseñar su formulario.'));
      return;
    }
    var f = e.fecha ? new Date(e.fecha + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha definida';
    f = f.charAt(0).toUpperCase() + f.slice(1);
    var virtual = e.formato === 'virtual';
    var agenda = Array.isArray(e.agenda) ? e.agenda : [];
    var patrocinadores = Array.isArray(e.patrocinadores) ? e.patrocinadores : [];
    var portada = e.image_url
      ? '<div class="absolute inset-0 bg-cover bg-center" style="background-image:url(\'' + P.esc(e.image_url) + '\')"></div><div class="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent z-10"></div>'
      : '<div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-primary/10 z-10"></div><div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/40 via-surface-container-highest/20 to-surface-container-low opacity-90"></div>';
    var archivo = e.image_url ? e.image_url.split('/').pop().split('?')[0].slice(0, 38) : 'Sin imagen de portada';

    card.insertAdjacentHTML('beforeend',
      '<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start"><div class="flex flex-col gap-1.5 h-full">' +
      '<label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center justify-between"><span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">image</span> Foto / Banner de Portada (16:9)</span><span class="text-[11px] text-on-surface-variant/80 font-normal">Recomendado: 1920×1080 px</span></label>' +
      '<div class="relative w-full rounded-xl overflow-hidden group border border-outline-variant/40 bg-surface-container-low flex flex-col justify-end p-4 shadow-sm h-48">' + portada +
      '<div class="relative z-20 flex items-center justify-between gap-2"><div class="flex items-center gap-2 min-w-0"><span class="px-2 py-0.5 rounded bg-surface-container-lowest/90 backdrop-blur-md font-label-sm text-label-sm font-bold text-on-surface truncate max-w-[140px]">' + P.esc(e.titulo) + '</span>' +
      '<span class="font-body-sm text-body-sm text-on-primary/90 text-[12px] truncate">' + P.esc(archivo) + '</span></div>' +
      '<div class="flex items-center gap-1.5 shrink-0"><button data-d="portada" class="h-7 px-2.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-on-surface hover:bg-surface-container-lowest font-label-sm text-label-sm flex items-center gap-1 transition-colors"><span class="material-symbols-outlined text-[14px]">upload</span> Cambiar</button>' +
      (e.image_url ? '<button data-d="sin-portada" class="w-7 h-7 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-error hover:bg-surface-container-lowest flex items-center justify-center transition-colors"><span class="material-symbols-outlined text-[14px]">delete</span></button>' : '') +
      '</div></div></div></div>' +
      '<div class="flex flex-col gap-3.5"><div class="flex flex-col gap-1.5"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">calendar_clock</span> Fecha y Horario</label>' +
      '<button data-d="fecha" class="text-left flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"><div class="flex items-center justify-between text-body-sm text-on-surface font-semibold w-full"><span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-secondary text-[16px]">schedule</span> ' + P.esc(f) + '</span><span class="material-symbols-outlined text-[15px] text-on-surface-variant">edit</span></div>' +
      '<div class="grid grid-cols-2 gap-2 pt-1 w-full"><div class="flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Inicio</span><span class="font-body-sm text-body-sm font-medium text-on-surface">' + P.esc(e.hora_inicio || '--:--') + '</span></div>' +
      '<div class="flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Fin</span><span class="font-body-sm text-body-sm font-medium text-on-surface">' + P.esc(e.hora_fin || '--:--') + '</span></div></div>' +
      '<div class="flex items-center gap-1 pt-1 text-[11px] text-on-surface-variant"><span class="material-symbols-outlined text-[13px]">public</span><span>GMT-5 (Hora Bogotá)</span></div></button></div>' +
      '<div class="flex flex-col gap-1.5"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span> Ubicación del Evento</label>' +
      '<div class="flex flex-col gap-2 p-3 rounded-lg bg-surface-container-low"><div class="flex gap-1 bg-surface-container p-0.5 rounded-md">' +
      '<button data-d="presencial" class="flex-1 py-1 rounded ' + (!virtual ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface') + ' font-label-sm text-label-sm flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[13px]">apartment</span> Presencial</button>' +
      '<button data-d="virtual" class="flex-1 py-1 rounded ' + (virtual ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface') + ' font-label-sm text-label-sm flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[13px]">videocam</span> Virtual</button></div>' +
      '<button data-d="lugar" class="text-left flex items-center gap-2 pt-0.5 hover:opacity-80"><span class="material-symbols-outlined text-secondary text-[18px] shrink-0">' + (virtual ? 'link' : 'pin_drop') + '</span><div class="min-w-0 flex-1">' +
      '<p class="font-body-sm text-body-sm font-semibold text-on-surface truncate">' + P.esc(e.lugar || (virtual ? 'Agrega el enlace de la transmisión' : 'Agrega la sede')) + '</p>' +
      '<p class="font-label-sm text-label-sm text-on-surface-variant truncate">' + P.esc(e.ciudad || 'Ciudad sin definir') + '</p></div><span class="material-symbols-outlined text-[15px] text-on-surface-variant">edit</span></button></div></div></div></div>' +

      '<div class="flex flex-col gap-1.5"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center justify-between"><span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">notes</span> Descripción y Agenda del Evento</span><span class="text-[11px] text-on-surface-variant">Se guarda al salir del campo</span></label>' +
      '<div class="rounded-lg border border-outline-variant/30 bg-surface-container-low overflow-hidden"><div class="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high border-b border-outline-variant/20 text-on-surface-variant">' +
      '<button data-md="**" class="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container hover:text-on-surface font-bold text-[13px]">B</button>' +
      '<button data-md="_" class="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container hover:text-on-surface italic text-[13px]">I</button>' +
      '<button data-md="link" class="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container hover:text-on-surface"><span class="material-symbols-outlined text-[15px]">link</span></button>' +
      '<button data-md="lista" class="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container hover:text-on-surface"><span class="material-symbols-outlined text-[15px]">format_list_bulleted</span></button>' +
      '<span class="w-px h-3.5 bg-outline-variant mx-1"></span><span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Markdown</span></div>' +
      '<textarea data-d="descripcion" rows="4" placeholder="Cuenta de qué se trata el evento…" class="w-full p-3 text-body-sm text-on-surface font-body-sm leading-relaxed bg-transparent outline-none resize-y">' + P.esc(e.acerca_del_evento || '') + '</textarea></div></div>' +

      '<div class="flex flex-col gap-2.5 pt-1"><div class="flex items-center justify-between"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-secondary">calendar_month</span> Agenda y Cronograma del Evento</label><span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Visible en checkout público tipo timeline</span></div>' +
      '<div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30"><div class="flex flex-col gap-2" id="p-agenda">' +
      (agenda.length ? agenda.map(bloqueAgenda).join('') : '<p class="font-body-sm text-body-sm text-on-surface-variant px-1 py-2">Todavía no hay bloques en la agenda.</p>') +
      '</div><button data-d="nuevo-bloque" class="w-full py-2.5 rounded-lg border border-dashed border-outline-variant hover:border-secondary hover:bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"><span class="material-symbols-outlined text-[16px] text-secondary">add_circle</span><span>Añadir actividad / bloque a la agenda</span></button></div></div>' +

      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1" id="p-entradas"><div class="flex flex-col gap-2 p-3.5 rounded-lg bg-surface-container-low"><div class="flex items-center justify-between"><label class="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-secondary">group</span> Capacidad Máxima</label>' +
      '<div class="flex items-center gap-1"><input data-d="capacidad" class="w-20 h-7 text-center rounded bg-surface-container-lowest font-body-sm text-body-sm font-semibold text-on-surface focus:outline-none border border-outline-variant/30" type="number" min="0" value="' + (e.capacidad || '') + '" placeholder="∞"><span class="font-label-sm text-label-sm text-on-surface-variant">cupos</span></div></div>' +
      '<div class="flex items-center justify-between pt-2 border-t border-surface-container-high"><div class="min-w-0"><p class="font-label-sm text-label-sm text-on-surface font-medium">Lista de espera automática</p><p class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">' + (e.capacidad ? 'Al agotar los ' + e.capacidad + ' cupos disponibles' : 'Define un cupo para activarla') + '</p></div>' +
      '<button data-d="espera" class="w-9 h-5 rounded-full ' + (e.lista_espera ? 'bg-secondary justify-end' : 'bg-surface-container-highest justify-start') + ' flex items-center px-0.5 cursor-pointer shrink-0"><div class="w-4 h-4 rounded-full bg-on-secondary shadow-sm"></div></button></div></div>' +
      '<div class="flex flex-col gap-2 p-3.5 rounded-lg bg-surface-container-low"><div class="flex items-center justify-between"><label class="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-secondary">payments</span> Precio de Entrada</label>' +
      '<div class="flex items-center gap-1.5"><span class="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface">COP</span><input data-d="precio" class="w-24 h-7 text-center rounded bg-surface-container-lowest font-body-sm text-body-sm font-semibold text-on-surface focus:outline-none border border-outline-variant/30" type="text" inputmode="numeric" value="' + (e.precio_cop ? P.cop(e.precio_cop) : '') + '" placeholder="Gratis"></div></div>' +
      '<div class="flex items-center justify-between pt-2 border-t border-surface-container-high"><div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-secondary">chat</span><p class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Cobro y confirmación vía WhatsApp</p></div>' +
      '<span class="font-label-sm text-label-sm ' + (e.precio_cop ? 'text-secondary' : 'text-on-surface-variant') + ' font-semibold text-[11px]">' + (e.precio_cop ? 'Activo' : 'Evento gratis') + '</span></div></div></div>' +

      '<div class="flex flex-col gap-1.5"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center justify-between"><span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">local_cafe</span> La entrada incluye</span><span class="text-[11px] text-on-surface-variant font-normal normal-case tracking-normal">Se muestra bajo el valor en la tarjeta de registro</span></label>' +
      '<input data-d="incluye" type="text" value="' + P.esc(e.incluye || '') + '" placeholder="Ej. Incluye bebida (1 café y 1 limonada) con tu pago" class="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-transparent focus:border-outline-variant focus:outline-none"></div>' +

      '<div class="flex flex-col gap-2.5 pt-1"><div class="flex items-center justify-between"><label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-secondary">award_star</span> Sponsors &amp; Aliados</label><span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">Tarjeta en la página pública</span></div>' +
      '<div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/30"><div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="p-sponsors">' +
      (patrocinadores.length ? patrocinadores.map(tarjetaSponsor).join('') : '<p class="col-span-full font-body-sm text-body-sm text-on-surface-variant px-1 py-2">Todavía no hay patrocinadores.</p>') +
      '</div><button data-d="nuevo-sponsor" class="w-full py-2.5 rounded-lg border border-dashed border-outline-variant hover:border-secondary hover:bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"><span class="material-symbols-outlined text-[16px] text-secondary">add_circle</span><span>Añadir patrocinador</span></button></div></div>'
    );
    enlazarDetalles(card, e);
  }

  function tarjetaSponsor(s, i) {
    var logo = s.logo_url
      ? '<img src="' + P.esc(s.logo_url) + '" alt="" class="w-full h-full object-contain">'
      : '<span class="material-symbols-outlined text-[20px] text-on-surface-variant">apartment</span>';
    return (
      '<button data-sp="' + i + '" class="p-3 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center min-w-0">' +
      '<span class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">' + logo + '</span>' +
      '<span class="font-label-md text-label-md text-on-surface font-semibold leading-tight truncate w-full">' + P.esc(s.nombre) + '</span>' +
      (s.rol ? '<span class="font-label-sm text-label-sm text-on-surface-variant truncate w-full">' + P.esc(s.rol) + '</span>' : '') +
      '</button>'
    );
  }

  function formSponsor(i) {
    var lista = (ev().patrocinadores || []).slice();
    var guardar = function (msg) {
      return guardarEvento({ patrocinadores: lista }, msg).then(function (ok) { if (ok) detalles(); return ok; });
    };
    P.modal({
      titulo: i == null ? 'Nuevo patrocinador' : 'Editar patrocinador',
      campos: [
        { nombre: 'nombre', etiqueta: 'Nombre', requerido: true, placeholder: 'Ej. Bancolombia' },
        { nombre: 'rol', etiqueta: 'Tipo de alianza', placeholder: 'Ej. Patrocinador oro' },
        { nombre: 'logo_url', etiqueta: 'URL del logo', placeholder: 'https://…', ayuda: 'Enlace público a la imagen del logo (PNG o SVG, fondo transparente).' },
        { nombre: 'url', etiqueta: 'Sitio web', placeholder: 'https://…' },
      ],
      valores: i == null ? {} : lista[i],
      onGuardar: function (v) {
        if (i == null) lista.push(v);
        else lista[i] = v;
        return guardar(i == null ? 'Patrocinador añadido' : 'Patrocinador actualizado');
      },
      onEliminar: i == null ? null : function () {
        lista.splice(i, 1);
        return guardar('Patrocinador eliminado');
      },
    });
  }

  function guardarAgenda(agenda) {
    return guardarEvento({ agenda: agenda });
  }

  function formBloque(i) {
    var e = ev();
    var agenda = (e.agenda || []).slice();
    var b = i == null ? {} : agenda[i];
    P.modal({
      titulo: i == null ? 'Nuevo bloque de agenda' : 'Editar bloque',
      campos: [
        { nombre: 'inicio', etiqueta: 'Inicio', tipo: 'time', mitad: true },
        { nombre: 'fin', etiqueta: 'Fin', tipo: 'time', mitad: true },
        { nombre: 'titulo', etiqueta: 'Actividad', requerido: true },
        { nombre: 'detalle', etiqueta: 'Host o speaker', mitad: true },
        { nombre: 'lugar', etiqueta: 'Sala o espacio', mitad: true },
      ],
      valores: b,
      onGuardar: function (v) {
        if (i == null) agenda.push(v);
        else agenda[i] = v;
        agenda.sort(function (x, y) { return String(x.inicio || '').localeCompare(String(y.inicio || '')); });
        return guardarAgenda(agenda).then(function (ok) { if (ok) detalles(); return ok; });
      },
      onEliminar: i == null ? null : function () {
        agenda.splice(i, 1);
        return guardarAgenda(agenda).then(function (ok) { if (ok) detalles(); return ok; });
      },
    });
  }

  function enlazarDetalles(card, e) {
    card.querySelectorAll('[data-d]').forEach(function (el) {
      var d = el.getAttribute('data-d');
      if (el.tagName === 'BUTTON') el.addEventListener('click', function () {
        if (d === 'portada') {
          P.modal({ titulo: 'Imagen de portada', campos: [{ nombre: 'image_url', etiqueta: 'URL de la imagen', placeholder: 'https://…', ayuda: 'Pega el enlace público de la imagen (16:9).' }], valores: e, onGuardar: function (v) { return guardarEvento(v, 'Portada actualizada').then(function (ok) { if (ok) detalles(); return ok; }); } });
        } else if (d === 'sin-portada') {
          guardarEvento({ image_url: '' }, 'Portada eliminada').then(detalles);
        } else if (d === 'fecha') {
          P.modal({
            titulo: 'Fecha y horario',
            campos: [{ nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date' }, { nombre: 'hora_inicio', etiqueta: 'Inicio', tipo: 'time', mitad: true }, { nombre: 'hora_fin', etiqueta: 'Fin', tipo: 'time', mitad: true }],
            valores: e,
            onGuardar: function (v) { return guardarEvento(v, 'Fecha actualizada').then(function (ok) { if (ok) { detalles(); encabezado(); } return ok; }); },
          });
        } else if (d === 'presencial' || d === 'virtual') {
          guardarEvento({ formato: d }).then(detalles);
        } else if (d === 'lugar') {
          P.modal({
            titulo: 'Ubicación',
            campos: [{ nombre: 'lugar', etiqueta: e.formato === 'virtual' ? 'Enlace de la transmisión' : 'Sede y dirección' }, { nombre: 'ciudad', etiqueta: 'Ciudad' }],
            valores: e,
            onGuardar: function (v) { return guardarEvento(v, 'Ubicación actualizada').then(function (ok) { if (ok) detalles(); return ok; }); },
          });
        } else if (d === 'nuevo-bloque') {
          formBloque(null);
        } else if (d === 'nuevo-sponsor') {
          formSponsor(null);
        } else if (d === 'espera') {
          guardarEvento({ lista_espera: !e.lista_espera }, e.lista_espera ? 'Lista de espera desactivada' : 'Lista de espera activada').then(detalles);
        }
      });
    });

    var desc = card.querySelector('[data-d=descripcion]');
    desc.addEventListener('blur', function () {
      if ((e.acerca_del_evento || '') !== desc.value) guardarEvento({ acerca_del_evento: desc.value }, 'Descripción guardada');
    });
    card.querySelectorAll('[data-md]').forEach(function (b) {
      b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-md');
        var s = desc.selectionStart, f = desc.selectionEnd, sel = desc.value.slice(s, f);
        var nuevo = t === 'link' ? '[' + (sel || 'texto') + '](https://)' : t === 'lista' ? '\n- ' + sel : t + (sel || 'texto') + t;
        desc.setRangeText(nuevo, s, f, 'end');
        desc.focus();
      });
    });

    var cap = card.querySelector('[data-d=capacidad]');
    cap.addEventListener('change', function () {
      guardarEvento({ capacidad: cap.value === '' ? null : Number(cap.value) }, 'Cupo actualizado').then(function () { detalles(); encabezado(); });
    });
    var precio = card.querySelector('[data-d=precio]');
    precio.addEventListener('change', function () {
      var n = Number(String(precio.value).replace(/[^\d]/g, '')) || 0;
      guardarEvento({ precio_cop: n }, n ? 'Precio actualizado' : 'Evento marcado como gratis').then(detalles);
    });

    var incluye = card.querySelector('[data-d=incluye]');
    incluye.addEventListener('change', function () {
      guardarEvento({ incluye: incluye.value.trim() }, 'Detalle de la entrada guardado');
    });
    card.querySelectorAll('[data-sp]').forEach(function (b) {
      b.addEventListener('click', function () { formSponsor(Number(b.getAttribute('data-sp'))); });
    });

    var agenda = card.querySelector('#p-agenda');
    agenda.querySelectorAll('[data-i]').forEach(function (fila) {
      var i = Number(fila.getAttribute('data-i'));
      fila.querySelectorAll('[data-ag]').forEach(function (el) {
        var k = el.getAttribute('data-ag');
        if (k === 'horas') el.addEventListener('click', function () { formBloque(i); });
        else if (k === 'borrar') el.addEventListener('click', function () {
          var lista = (ev().agenda || []).slice();
          lista.splice(i, 1);
          guardarAgenda(lista).then(function (ok) { if (ok) { P.toast('Bloque eliminado'); detalles(); } });
        });
        else el.addEventListener('change', function () {
          var lista = (ev().agenda || []).slice();
          lista[i] = Object.assign({}, lista[i]);
          lista[i][k] = el.value.trim();
          guardarAgenda(lista);
        });
      });
    });
  }

  /* ---------- Preguntas ---------- */

  function vistaPrevia(c) {
    var t = TIPOS[c.tipo] || TIPOS.texto;
    var ops = opciones(c);
    if (c.tipo === 'nombre') {
      return '<div class="grid grid-cols-2 gap-2">' + ['Nombre', 'Apellido'].map(function (l) {
        return '<div class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">' + l + (c.obligatorio ? ' *' : '') + '</span><div class="w-full bg-surface-container-low rounded-lg p-2.5 text-on-surface-variant font-body-sm text-body-sm">Ej. ' + (l === 'Nombre' ? 'Sofía' : 'Hernández') + '</div></div>';
      }).join('') + '</div>';
    }
    if (c.tipo === 'parrafo') {
      return '<div class="w-full h-20 bg-surface-container-low rounded-lg p-2.5 text-on-surface-variant font-body-sm text-body-sm flex justify-between items-start"><span>Respuesta abierta…</span><span class="font-label-sm text-label-sm text-on-surface-variant">0 / 300</span></div>';
    }
    if (c.tipo === 'si_no') {
      return '<div class="p-3 rounded-lg bg-surface-container-low flex items-center justify-between"><p class="font-body-sm text-body-sm text-on-surface font-semibold">' + P.esc(c.label) + '</p><div class="w-11 h-6 rounded-full bg-secondary flex items-center justify-end px-0.5"><div class="w-5 h-5 rounded-full bg-on-secondary shadow-sm"></div></div></div>';
    }
    if (c.tipo === 'unica') {
      return '<div class="grid grid-cols-2 gap-2">' + (ops.length ? ops : ['Agrega opciones']).map(function (o, i) {
        return '<div class="p-2 rounded-lg bg-surface-container-low flex items-center gap-2 ' + (i === 0 ? 'text-on-surface' : 'text-on-surface-variant') + ' font-body-sm text-body-sm">' +
          (i === 0 ? '<span class="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center"><span class="w-1.5 h-1.5 rounded-full bg-on-primary"></span></span>' : '<span class="w-3.5 h-3.5 rounded-full bg-surface-container-highest"></span>') +
          '<span>' + P.esc(o) + '</span></div>';
      }).join('') + '</div>';
    }
    if (c.tipo === 'multiple') {
      return '<div class="flex flex-wrap gap-1.5">' + (ops.length ? ops : ['Agrega opciones']).map(function (o, i) {
        return '<span class="px-3 py-1.5 rounded-lg ' + (i % 2 === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface') + ' font-label-md text-label-md flex items-center gap-1"><span>' + P.esc(o) + '</span>' + (i % 2 === 0 ? '<span class="material-symbols-outlined text-[14px]">check</span>' : '') + '</span>';
      }).join('') + '</div>';
    }
    if (c.tipo === 'archivo') {
      return '<div class="w-full rounded-lg border border-dashed border-outline-variant p-4 flex items-center justify-center gap-2 text-on-surface-variant font-body-sm text-body-sm"><span class="material-symbols-outlined text-[18px]">upload_file</span>PDF o imagen (máx. 4 MB)</div>';
    }
    var ph = { texto: 'Respuesta corta', telefono: '+57 300 123 4567', url: 'https://linkedin.com/in/…', numero: '0', email: 'nombre@email.com' }[c.tipo] || 'Respuesta';
    return '<div class="w-full bg-surface-container-low rounded-lg p-2.5 text-on-surface-variant font-body-sm text-body-sm flex items-center justify-between"><span>' + ph + '</span><span class="material-symbols-outlined text-[16px]">' + (t[2] || t[0]) + '</span></div>';
  }

  function tarjetaPregunta(c, i) {
    var etiqueta = c.obligatorio
      ? '<span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">Obligatorio</span>'
      : c.tipo === 'multiple'
        ? '<span class="font-label-sm text-label-sm text-on-surface-variant">(Multiselección)</span>'
        : '<span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">Opcional</span>';
    return (
      '<div draggable="true" data-campo="' + c.id + '" class="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group cursor-pointer">' +
      '<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2 min-w-0">' +
      '<span class="material-symbols-outlined text-on-surface-variant cursor-grab text-[18px]">drag_handle</span>' +
      '<span class="w-6 h-6 rounded bg-surface-container font-label-sm text-label-sm text-on-surface font-semibold flex items-center justify-center shrink-0">' + (i + 1) + '</span>' +
      '<span class="font-label-md text-label-md text-on-surface font-semibold truncate">' + P.esc(c.label) + '</span>' + etiqueta + '</div>' +
      '<div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">' +
      '<button data-q="arriba" title="Subir" class="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[16px]">arrow_upward</span></button>' +
      '<button data-q="editar" class="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
      '<button data-q="borrar" class="w-7 h-7 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-error"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
      '</div></div>' + vistaPrevia(c) + '</div>'
    );
  }

  function preguntas() {
    var ghost = P.boton('Añadir nueva pregunta al formulario');
    var pila = ghost.parentNode;
    Array.prototype.slice.call(pila.children).forEach(function (n) { if (n !== ghost) n.remove(); });
    var lista = campos();
    var t = Array.prototype.find.call(document.querySelectorAll('main span'), function (s) { return /preguntas? configuradas?/.test(s.textContent); });
    if (t) t.textContent = lista.length + (lista.length === 1 ? ' pregunta configurada' : ' preguntas configuradas') + ' · Nombre, Correo y Celular se piden siempre';
    if (!st.evento) return;
    ghost.insertAdjacentHTML('beforebegin', lista.length ? lista.map(tarjetaPregunta).join('') : '<div class="bg-surface-container-lowest rounded-xl shadow-sm">' + P.vacio('quiz', 'El formulario no tiene preguntas', 'Elige un tipo de campo a la izquierda o usa el botón de abajo.') + '</div>');

    var arrastrado = null;
    pila.querySelectorAll('[data-campo]').forEach(function (card, i) {
      var c = lista[i];
      card.querySelector('[data-q=editar]').addEventListener('click', function (e) { e.stopPropagation(); formCampo(c); });
      card.querySelector('[data-q=borrar]').addEventListener('click', function (e) {
        e.stopPropagation();
        P.confirmar('Eliminar pregunta', '“' + c.label + '” dejará de aparecer en el formulario.', 'Eliminar').then(function (ok) {
          if (ok) P.eliminar('evento_form_campos', c.id).then(function (r) { if (r.ok) { P.toast('Pregunta eliminada'); recargar(); } });
        });
      });
      card.querySelector('[data-q=arriba]').addEventListener('click', function (e) {
        e.stopPropagation();
        if (i === 0) return;
        var nuevo = lista.slice();
        nuevo.splice(i - 1, 0, nuevo.splice(i, 1)[0]);
        reordenar(nuevo);
      });
      card.addEventListener('click', function () { formCampo(c); });
      card.addEventListener('dragstart', function () { arrastrado = i; card.classList.add('opacity-50'); });
      card.addEventListener('dragend', function () { card.classList.remove('opacity-50'); });
      card.addEventListener('dragover', function (e) { e.preventDefault(); });
      card.addEventListener('drop', function (e) {
        e.preventDefault();
        if (arrastrado == null || arrastrado === i) return;
        var nuevo = lista.slice();
        nuevo.splice(i, 0, nuevo.splice(arrastrado, 1)[0]);
        arrastrado = null;
        reordenar(nuevo);
      });
    });
  }

  function reordenar(lista) {
    Promise.all(lista.map(function (c, i) {
      return c.orden === i ? null : P.editar('evento_form_campos', c.id, { orden: i });
    })).then(function () { marcarGuardado(); recargar(); });
  }

  function formCampo(c, tipo) {
    if (!st.evento) return P.toast('Primero crea un evento', 'error');
    var opcionesTipo = Object.keys(TIPOS).map(function (k) { return { v: k, l: TIPOS[k][1] }; });
    P.modal({
      titulo: c ? 'Editar pregunta' : 'Nueva pregunta',
      campos: [
        { nombre: 'label', etiqueta: 'Pregunta', requerido: true, placeholder: 'Ej. ¿Cuál es tu rol en el ecosistema?' },
        { nombre: 'tipo', etiqueta: 'Tipo de campo', tipo: 'select', opciones: opcionesTipo },
        { nombre: 'opciones', etiqueta: 'Opciones (una por línea)', tipo: 'textarea', filas: 4, ayuda: 'Solo aplica a Opción Única y Opción Múltiple.' },
        { nombre: 'obligatorio', etiqueta: 'Respuesta obligatoria', tipo: 'checkbox' },
      ],
      valores: c
        ? Object.assign({}, c, { opciones: opciones(c).join('\n') })
        : tipo === 'nombre' ? { tipo: 'nombre', label: 'Nombre', obligatorio: true } : { tipo: tipo || 'texto', obligatorio: false },
      textoGuardar: c ? 'Guardar pregunta' : 'Añadir pregunta',
      onGuardar: function (v) {
        if (v.tipo !== 'unica' && v.tipo !== 'multiple') v.opciones = '';
        if (v.tipo === 'nombre' && campos().some(function (x) { return x.tipo === 'nombre' && (!c || x.id !== c.id); })) {
          P.toast('El formulario ya tiene un campo de Nombre y Apellido', 'error');
          return Promise.resolve(false);
        }
        var req = c ? P.editar('evento_form_campos', c.id, v) : P.crear('evento_form_campos', Object.assign(v, { evento_id: st.evento, orden: campos().length }));
        return req.then(function (r) {
          if (!r.ok) return false;
          P.toast(c ? 'Pregunta actualizada' : 'Pregunta añadida');
          marcarGuardado();
          recargar();
          return true;
        });
      },
      onEliminar: c ? function () {
        return P.eliminar('evento_form_campos', c.id).then(function (r) { if (r.ok) { P.toast('Pregunta eliminada'); recargar(); } return r.ok; });
      } : null,
    });
  }

  function pintar() {
    encabezado();
    detalles();
    preguntas();
  }

  function recargar() { P.cargar().then(pintar); }

  controlesFijos();
  P.on(P.boton('Añadir nueva pregunta al formulario'), function () { formCampo(null); });
  P.iniciar(function () {
    st.evento = P.eventoActualId();
    pintar();
  });
})();
