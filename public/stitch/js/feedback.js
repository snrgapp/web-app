(function () {
  window.P_PAGINA = 'feedback';
  var st = { evento: null };

  function ev() { return P.evento(st.evento); }

  function hero() {
    var e = ev();
    var h1 = document.querySelector('main h1');
    if (h1) h1.textContent = 'Comentarios & Feedback del Evento';
    document.querySelectorAll('main span').forEach(function (s) {
      if (s.children.length) return;
      if (s.textContent.indexOf('EVT-') === 0) s.textContent = e && e.checkin_slug ? e.checkin_slug : 'sin-slug';
      if (s.textContent.indexOf('Tech Founders') !== -1) s.textContent = e ? e.titulo : 'Sin evento';
    });
    var chip = P.porTexto('Encuesta Activa');
    if (chip && !document.getElementById('p-ejemplo')) {
      var tag = document.createElement('span');
      tag.id = 'p-ejemplo';
      tag.className = 'font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold';
      tag.textContent = 'Datos de ejemplo';
      chip.parentNode.appendChild(tag);
    }
  }

  function bind() {
    P.on(P.boton('Exportar Respuestas (CSV)'), function () {
      P.csv('feedback-ejemplo.csv', [
        { nombre: 'Sofia Mendez', ticket: 'VIP Founder', estrellas: 5, comentario: 'Nivel de ponentes y networking.' },
        { nombre: 'Mateo Rivas', ticket: 'Acceso General', estrellas: 5, comentario: 'Check-in rápido y audio impecable.' },
        { nombre: 'Lucía Chen', ticket: 'Acceso General', estrellas: 4, comentario: 'Sala B quedó chica para el workshop.' },
      ]);
    });
    P.on(P.boton('Configurar Encuesta'), function () {
      P.toast('Estas tarjetas son de ejemplo para ver los gráficos. La encuesta real se activa al cerrar el evento.');
    });
  }

  P.iniciar(function () {
    st.evento = P.eventoActualId();
    P.pestaniasEvento(st.evento);
    bind();
    hero();
  });
})();
