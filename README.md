# ALABANZA MINISTERIO JERICO
Creador de anuncios semanales, aplicación web progresiva (PWA).

## Archivos
- `index.html`: interfaz en español.
- `styles.css`: diseño adaptable a teléfonos.
- `app.js`: editor, vista previa, almacenamiento IndexedDB y exportación.
- `manifest.webmanifest`: instalación como aplicación.
- `service-worker.js`: caché offline versionada.
- `assets/logo.png`: logotipo permanente extraído de la imagen proporcionada.
- `assets/icon-192.png` y `assets/icon-512.png`: iconos PWA.

## Publicar en GitHub Pages desde Android
1. Crea un repositorio en GitHub, por ejemplo `anuncios-jerico`.
2. Sube todos los archivos y carpetas de este proyecto a la raíz del repositorio. No subas únicamente el ZIP.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub Pages publique el sitio. Abre la dirección HTTPS que GitHub muestra.
7. En Chrome para Android, abre el sitio, toca el menú ⋮ y elige **Instalar aplicación** o **Agregar a pantalla principal**.

## Uso
- Completa fechas, horas, asignaciones, oración y camisa.
- Para la foto, toca el selector y elige Galería o Cámara.
- La vista previa se actualiza al escribir.
- Pulsa **Guardar anuncio** para guardarlo en el dispositivo.
- En **Mis anuncios guardados**, abre, duplica o elimina anuncios.
- **Guardar imagen PNG** genera una imagen de alta resolución (2700 × 3600).
- **Guardar PDF** abre el diálogo de impresión del navegador. Elige **Guardar como PDF**.

## Actualizar la aplicación sin borrar anuncios
1. Sube los archivos nuevos al mismo repositorio.
2. Cambia `CACHE_NAME` en `service-worker.js` a una versión nueva, por ejemplo `jerico-pwa-v1.0.1`.
3. Publica los cambios y vuelve a abrir la aplicación con internet.
4. El service worker nuevo reemplaza la caché anterior. Los anuncios se guardan en IndexedDB, separado de la caché, así que una actualización normal no los borra.

No borres los datos del sitio ni desinstales la aplicación para actualizarla. Los anuncios están guardados en el almacenamiento local del navegador de ese dispositivo; exporta copias importantes para conservarlas fuera del teléfono.

## Notas importantes
- La primera apertura necesita internet para cargar el sitio y registrar la caché. Después, los archivos principales están disponibles sin conexión.
- Los anuncios se almacenan localmente en el dispositivo y no se sincronizan entre teléfonos.
- El logotipo está incluido como archivo permanente y no depende de la foto semanal.
- La exportación PNG usa el mismo SVG que alimenta la vista previa, incorpora el logotipo y la foto cargada, y lo rasteriza a 3×.
- PDF usa el diálogo de impresión de Chrome con una hoja vertical. En Android, selecciona **Guardar como PDF** si aparece esa opción.
- Para publicar cambios en GitHub Pages, se requiere conexión a internet.
