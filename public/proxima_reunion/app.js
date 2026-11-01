(function () {
  var KEY = 'snrg_proxima_reunion';
  var BASE = '/proxima_reunion';

  function leer() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function guardar(parte) {
    sessionStorage.setItem(KEY, JSON.stringify(Object.assign(leer(), parte || {})));
  }
  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || '').trim() : '';
  }
  function setVal(id, v) {
    var el = document.getElementById(id);
    if (el && v != null) el.value = v;
  }
  function botonPorTexto(txt) {
    var hallado = null;
    document.querySelectorAll('button').forEach(function (b) {
      if (!hallado && b.textContent.replace(/\s+/g, ' ').indexOf(txt) !== -1) hallado = b;
    });
    return hallado;
  }
  function errorBajo(id, msg) {
    var input = document.getElementById(id);
    if (!input) return alert(msg);
    var wrap = input.closest('.flex.flex-col') || input.parentNode;
    var prev = wrap.querySelector('.p-dup-msg');
    if (prev) prev.remove();
    if (!msg) return;
    var p = document.createElement('p');
    p.className = 'p-dup-msg font-body-sm text-body-sm text-error mt-1';
    p.textContent = msg;
    wrap.appendChild(p);
    input.focus();
  }

  function paso1() {
    if (!document.getElementById('founder-name')) return false;
    var d = leer();
    setVal('founder-name', d.nombre);
    setVal('founder-lastname', d.apellido);
    setVal('founder-email', d.correo);
    setVal('founder-phone', d.telefono);
    setVal('company-name', d.empresa);
    if (d.ciudad && typeof selectCity === 'function') {
      document.querySelectorAll('.city-chip').forEach(function (b) {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').indexOf("'" + d.ciudad + "'") !== -1) {
          selectCity(b, d.ciudad);
        }
      });
    }
    var cont = botonPorTexto('Continue');
    if (cont) {
      cont.addEventListener('click', function () {
        var nombre = val('founder-name');
        var apellido = val('founder-lastname');
        var correo = val('founder-email').toLowerCase();
        var telefono = val('founder-phone');
        var empresa = val('company-name');
        var ciudad = val('selected-city-input') || 'Barranquilla';
        errorBajo('founder-email', '');
        if (!nombre || !apellido) { errorBajo('founder-name', 'Escribe tu nombre y apellido.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { errorBajo('founder-email', 'Escribe un correo válido.'); return; }
        cont.disabled = true;
        fetch('/api/proxima-reunion?correo=' + encodeURIComponent(correo))
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j.existe) {
              errorBajo('founder-email', 'Este correo ya está registrado. Si necesitas actualizar tus datos, escríbenos.');
              cont.disabled = false;
              return;
            }
            guardar({ nombre: nombre, apellido: apellido, correo: correo, telefono: telefono, empresa: empresa, ciudad: ciudad });
            location.href = BASE + '/diagnostico';
          })
          .catch(function () {
            cont.disabled = false;
            errorBajo('founder-email', 'No se pudo validar el correo. Intenta de nuevo.');
          });
      });
    }
    return true;
  }

  function paso2() {
    if (!document.getElementById('ig-handle-input')) return false;
    var d = leer();
    if (!d.correo) { location.replace(BASE); return true; }
    setVal('ig-handle-input', d.instagram);
    setVal('problem-textarea', d.problema);
    if (d.tiempo_empresa) {
      document.querySelectorAll('.stage-card[data-value]').forEach(function (b) {
        if (b.getAttribute('data-value') === d.tiempo_empresa && typeof selectStage === 'function') selectStage(b);
      });
    }
    if (d.facturacion) {
      document.querySelectorAll('.stage-card[data-revenue]').forEach(function (b) {
        if (b.getAttribute('data-revenue') === d.facturacion && typeof selectStage === 'function') selectStage(b);
      });
    }
    if (d.tamano_equipo) {
      document.querySelectorAll('.team-card').forEach(function (b) {
        if (b.getAttribute('data-team') === d.tamano_equipo && typeof selectTeam === 'function') selectTeam(b);
      });
    }
    var cont = botonPorTexto('Continuar a Canales');
    if (cont) {
      cont.addEventListener('click', function () {
        var stage = document.querySelector('.stage-card[data-value].selected');
        var revenue = document.querySelector('.stage-card[data-revenue].selected');
        var team = document.querySelector('.team-card.selected');
        guardar({
          instagram: val('ig-handle-input').replace(/^@+/, ''),
          problema: val('problem-textarea'),
          tiempo_empresa: stage ? stage.getAttribute('data-value') : '6m',
          facturacion: revenue ? revenue.getAttribute('data-revenue') : '3-10m',
          tamano_equipo: team ? team.getAttribute('data-team') : 'medium',
        });
        location.href = BASE + '/traccion';
      });
    }
    return true;
  }

  function paso3() {
    if (!document.getElementById('submit-cta')) return false;
    var d = leer();
    if (!d.correo) { location.replace(BASE); return true; }
    if (d.desafio) setVal('challenge-input', d.desafio);
    if (Array.isArray(d.canales)) {
      document.querySelectorAll('.channel-pill').forEach(function (b) {
        var t = (b.querySelector('.font-label-md') || {}).textContent || '';
        if (d.canales.indexOf(t.trim()) !== -1 && typeof toggleMultiSelect === 'function' && !b.classList.contains('selected')) {
          toggleMultiSelect(b);
        }
      });
    }
    if (d.camara_comercio) {
      var radio = document.querySelector('input[name="chamber_status"][value="' + d.camara_comercio + '"]');
      if (radio) {
        radio.checked = true;
        if (typeof handleRadioSelect === 'function') handleRadioSelect(radio);
      }
    }
    window.handleSubmit = function (btn) {
      var terms = document.getElementById('terms-toggle');
      if (!terms || !terms.checked) {
        var card = document.getElementById('terms-card');
        var box = document.getElementById('terms-box');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.remove('p-tambalea');
          void card.offsetWidth;
          card.classList.add('p-tambalea', 'p-terms-alerta');
          setTimeout(function () {
            card.classList.remove('p-tambalea', 'p-terms-alerta');
          }, 900);
        }
        if (box) {
          box.classList.add('scale-125');
          setTimeout(function () { box.classList.remove('scale-125'); }, 200);
        }
        return;
      }
      var canales = [];
      document.querySelectorAll('.channel-pill.selected .font-label-md').forEach(function (s) {
        canales.push(s.textContent.trim());
      });
      var camara = (document.querySelector('input[name="chamber_status"]:checked') || {}).value || '';
      var desafio = val('challenge-input');
      guardar({ canales: canales, camara_comercio: camara, desafio: desafio, acepto_terminos: true });
      var payload = Object.assign({}, leer(), { canales: canales, camara_comercio: camara, desafio: desafio, acepto_terminos: true });
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Curando tu perfil...</span>';
      fetch('/api/proxima-reunion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
        .then(function (res) {
          if (res.j && res.j.duplicado) {
            btn.disabled = false;
            btn.innerHTML = '<span class="text-base tracking-tight font-semibold">Enviar mis Respuestas & Postularme</span>';
            alert(res.j.error || 'Este correo ya está registrado.');
            location.href = BASE;
            return;
          }
          if (!res.j || !res.j.ok) {
            btn.disabled = false;
            btn.innerHTML = '<span class="text-base tracking-tight font-semibold">Enviar mis Respuestas & Postularme</span>';
            alert((res.j && res.j.error) || 'No se pudo guardar. Intenta de nuevo.');
            return;
          }
          sessionStorage.removeItem(KEY);
          location.href = BASE + '/listo';
        })
        .catch(function () {
          btn.disabled = false;
          btn.innerHTML = '<span class="text-base tracking-tight font-semibold">Enviar mis Respuestas & Postularme</span>';
          alert('No se pudo guardar. Intenta de nuevo.');
        });
    };
    return true;
  }

  function paso4() {
    var share = document.getElementById('btn-share');
    if (!share) return false;
    share.addEventListener('click', function () {
      var url = location.origin + BASE;
      if (navigator.clipboard) navigator.clipboard.writeText(url);
    }, true);
    return true;
  }

  paso1() || paso2() || paso3() || paso4();
})();
