/* =========================================================================
   PORTAFOLIO — Matías Tenorio
   JavaScript vanilla (sin frameworks, sin backend).
   ========================================================================= */

/* -------------------------------------------------------------------------
   EFECTO DE ESCRITURA EN LA LÍNEA DE ARRANQUE (terminal)
   ------------------------------------------------------------------------- */
const el = document.getElementById('boot-text');
const message = 'whoami --portafolio';
let i = 0;

function type() {
  if (i <= message.length) {
    el.textContent = message.slice(0, i);
    i++;
    setTimeout(type, 38);
  }
}

type();
