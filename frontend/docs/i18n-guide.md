# Guía para Nuevos Idiomas

Esta guía explica el proceso técnico necesario para incorporar un nuevo idioma a la plataforma Nexo (Soporte Multi-idioma con `next-intl`).

Al añadir un nuevo idioma, es imperativo asegurarse de que todas las piezas del enrutador internacional y el gestor de traducciones estén sincronizados. Sigue estos 4 sencillos pasos.

## Paso 1: Crear el Archivo de Traducción (JSON)

En la carpeta donde residen las traducciones (`frontend/src/locales`), debes crear el nuevo archivo `.json`. Por lo general, se acostumbra clonar uno completo (ej: `en.json`) y luego empezar a traducirlo.

```bash
# Ejemplo: Agregando el idioma Francés (fr)
cd frontend/src/locales
cp en.json fr.json
```

Abre el nuevo archivo `fr.json` y comienza a traducir los valores. ¡No alteres las claves (keys) del lado izquierdo!

## Paso 2: Registrar el Idioma en el Enrutador

Ve al archivo de configuración de rutas internacionales ubicado en `frontend/src/i18n/routing.ts`.

Añade el prefijo de tu nuevo idioma en el arreglo `locales`:

```typescript
export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'es', 'ja', 'fr'], // <-- ¡Aquí! Añades 'fr'

    // Used when no locale matches
    defaultLocale: 'es'
});
```

## Paso 3: Tipar y Validar las Peticiones del Cliente

Para asegurar el tipado fuerte y la validación de peticiones, Next.js necesita interceptar el idioma mediante el archivo `frontend/src/i18n/request.ts`.

En este archivo, actualiza el tipo Union que valida qué idioma ha ingresado el usuario según el Request:

```typescript
    // Ensure that a valid locale is used
    // Añade | "fr" al final de la validación
    if (!locale || !routing.locales.includes(locale as "en" | "es" | "ja" | "fr")) {
        locale = routing.defaultLocale;
    }
```

## Paso 4: Adaptar el Middleware de Interceptación (Next.js)

Finalmente, nuestro servidor de Renderizado intermedio (Middleware) debe saber que existe esa ruta para no redirigir a un error 404, validando la procedencia del tráfico.

Abre el archivo de `frontend/src/middleware.ts` y actualiza la expresión regular del `matcher`:

```typescript
export const config = {
    // Match only internationalized pathnames
    // Añade |fr en la secuencia de strings
    matcher: ['/', '/(es|en|ja|fr)/:path*']
};
```

## Paso 5: Agregar el Idioma al Selector Gráfico (Dropdown)

Busca el componente encargado del selector de idioma (normalmente en la barra superior o `Header`).
Dependiendo de la implementación, deberás ubicar la lista de opciones gráficas (Dropdown o Select) y añadir la bandera y prefijo de tu nuevo idioma a esa misma colección de interfaz de usuario.

## Paso 6: Activar Pestañas (Tabs) en Formularios Dinámicos

Los formularios autogenerados en el dashboard soportan traducciones multi-idioma (Ej: un campo de entrada diferente por cada idioma seleccionado).
Debes agregar tu nuevo idioma para que la pestaña correspondiente aparezca en la interfaz del Administrador (Dashboard).

Ve al componente `FormGenerator` en `frontend/src/features/dashboard/components/FormGenerator.tsx`.
Busca el bloque donde se renderizan los idiomas del formulario (`['es', 'en']`) y añade tu nuevo idioma a la matriz, junto con su representación gráfica:

```tsx
{['es', 'en', 'ja', 'fr'].map(lang => (
    <button
        // ...
    >
        {lang === 'es' ? '🇪🇸 Español' : lang === 'en' ? '🇺🇸 Inglés' : lang === 'ja' ? '🇯🇵 日本語' : '🇫🇷 Français'}
    </button>
))}
```
