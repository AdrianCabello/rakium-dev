# RakiumDev

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Testing SSR (Server-Side Rendering)

### 1. Probar SSR en local (sin Docker)

Desde la raíz del proyecto `rakium-dev`:

```bash
# Build de la app (browser + server)
npm run build:ssr

# Levantar el servidor Node con SSR (puerto 4000 por defecto)
npm run serve:ssr
```

Abrí **http://localhost:4000**. La app se sirve desde Node con renderizado en el servidor. Para comprobar que es SSR, inspeccioná el HTML de la página (View Source): deberías ver el contenido ya renderizado en lugar de un `<app-root>` vacío.

### 2. Probar con Docker

Desde la raíz del proyecto `rakium-dev`:

```bash
# Construir la imagen
docker build -t rakium-dev .

# Ejecutar el contenedor (mapea el puerto 4000)
docker run -p 4000:4000 rakium-dev
```

Abrí **http://localhost:4000**. Es el mismo resultado que `serve:ssr`, pero dentro del contenedor.

Para usar otro puerto en el host, por ejemplo 8080:

```bash
docker run -p 8080:4000 -e PORT=4000 rakium-dev
```

Y entrá a **http://localhost:8080**.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
