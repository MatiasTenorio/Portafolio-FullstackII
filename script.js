/* ============================================================
       JS: aquí definimos el COMPORTAMIENTO (lo que pasa al hacer clic)
       ============================================================ */

    // 1. Buscamos en el HTML los elementos que necesitamos, por su "id"
    const fotoInput = document.getElementById('fotoInput');
    const fotoPerfil = document.getElementById('fotoPerfil');

    // 2. "addEventListener" = escuchamos un evento (change = cuando
    //    el usuario elige un archivo) y ejecutamos una función cuando pasa
    fotoInput.addEventListener('change', function (evento) {
      // evento.target.files[0] = el primer archivo que el usuario eligió
      const archivo = evento.target.files[0];

      if (archivo) {
        // FileReader permite leer el archivo de imagen desde el navegador
        const lector = new FileReader();

        // Cuando termine de leer el archivo, esta función se ejecuta:
        lector.onload = function (e) {
          fotoPerfil.src = e.target.result; // ponemos la imagen leída como src
          fotoPerfil.classList.remove('profile-pic-placeholder');
        };

        // Iniciamos la lectura del archivo como una URL de datos (base64)
        lector.readAsDataURL(archivo);
      }
    });

    // 3. Al hacer clic en la imagen (aunque no tenga foto aún), abrimos el selector
    fotoPerfil.addEventListener('click', function () {
      fotoInput.click();
    });