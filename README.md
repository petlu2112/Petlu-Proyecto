# PETLÚS — Tienda de productos para mascotas

Sitio web académico creado con HTML5, CSS3 y JavaScript ES6. Incluye catálogo dinámico, búsqueda, filtros por categoría, orden por precio, carrito con cantidades, persistencia local y armado de pedidos para WhatsApp.

## Cómo abrir el proyecto
1. Descarga o descomprime la carpeta.
2. Abre `index.html` en tu navegador.
3. Para una mejor experiencia de desarrollo, usa la extensión Live Server de Visual Studio Code (opcional).

## Personalización necesaria antes de publicar
- En `script.js`, reemplaza `WHATSAPP_NUMBER = "51987654321"` por el número real de PETLÚS, usando código de país y solo dígitos. El número incluido es ficticio.
- Revisa nombres, descripciones, precios y fotos de ejemplo en el arreglo `products` de `script.js`.
- El catálogo actual es demostrativo: no procesa pagos ni confirma inventario.
- Las fotografías se cargan desde URLs externas y requieren conexión a internet.

## Publicar gratis con GitHub Pages
1. Crea una cuenta o inicia sesión en GitHub.
2. Crea un repositorio **público**, por ejemplo `petlus`.
3. Sube `index.html`, `styles.css`, `script.js`, `README.md` y la carpeta `assets`.
4. Abre **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Elige la rama `main` y la carpeta `/ (root)`, guarda.
7. Espera a que GitHub Pages publique el sitio y abre el enlace que aparece en esa sección.

## Tecnologías
- HTML5 semántico
- CSS3 responsive (Flexbox, Grid y media queries)
- JavaScript ES6
- localStorage para conservar el carrito en el navegador
- WhatsApp Click to Chat para enviar el pedido como mensaje preparado
