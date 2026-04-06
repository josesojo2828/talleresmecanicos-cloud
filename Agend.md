# 🛠️ AGEND: Manual de Supervivencia - Talleres Mecánicos SaaS

Che, escuchame una cosa. Si vas a tocar este código, hacelo bien. No estamos tirando líneas por tirar, estamos construyendo una solución robusta para talleres mecánicos. ACÁ NO HAY LUGAR PARA CÓDIGO BASURA. 

Este documento es el **Source of Truth** para cualquier agente de IA (y para vos también, loco). Leelo, entendelo y respetalo.

---

## 🏗️ ARQUITECTURA GENERAL (The Big Picture)

Este es un SaaS multi-inquilino (Workshop-based) con un stack moderno. No inventes la rueda, usá lo que ya está.

### 🔙 BACKEND: NestJS + Prisma + PostgreSQL
- **Arquitectura de Módulos:** Cada dominio (Users, Workshops, Works, Parts) tiene su propio módulo. Mantené la lógica de negocio en los **Services**, no ensucies los Controllers.
- **Prisma:** Es nuestro ORM. Si vas a tocar el `schema.prisma`, hacelo con cuidado y no te olvides de correr las migrations.
- **Pattern de Respuesta (Injected):** Tenemos un `ResponseInterceptor` global que estandariza TODO. No devuelvas objetos sueltos.
- **Traducciones:** Usamos `nestjs-i18n`. Las claves de éxito/error deben estar en `locales/`.

### 🎨 FRONTEND: Next.js + Axios + Atomic Design + daisyUI
- **API Client:** Usamos un `apiClient` centralizado (`src/utils/api/api.client.ts`). Ya maneja el Bearer token, el idioma y las alertas automáticas. **NO USES FETCH DIRECTO.**
- **CRUD Custom:** Tenemos un sistema de CRUD dinámico. Si querés crear una lista nueva, configurá el `ObjectPage` y usá el componente `CustomCrud`.
- **FormGenerator:** No escribas formularios a mano. Definí una `FormStructure` y pasásela al `FormGenerator`.
- **Fichas (Detail Views):** Se manejan a través del `EntityDetailFactory`. Agregá tu nuevo componente ahí si creás un módulo nuevo.

---

## 📋 ESTÁNDARES Y PATRONES (Copiá y Pegá esto, hermano)

### 1. El Pattern de Respuesta (Backend)
Cualquier cosa que devuelva el backend va a terminar con este formato gracias al Interceptor:
```json
{
  "body": {},       // La data real
  "status": 200,    // Código HTTP
  "message": "",    // Mensaje traducido
  "lang": "es",     // Idioma de la respuesta
  "duration": "10ms" // Performance tracking
}
```

### 2. Estructura de Tabla (Frontend)
Para definir las columnas de una tabla en el `CustomCrud`:
```typescript
{
  key: 'name',
  label: 't.table.name', // Clave de i18n
  type: 'text' // text, date, currency, boolean, badge
}
```

### 3. Estructura de Formulario (Frontend)
Definí tus formularios así en `types/form/`:
```typescript
export const MiNuevoForm: FormStructure = {
  slug: 'mi-entidad',
  title: 't.form.title',
  fields: [
    {
      name: 'nombre',
      label: 't.field.nombre',
      type: 'text',
      validation: { required: true }
    },
    {
      name: 'workshopId',
      label: 'Workshop',
      type: 'autocomplete', // Para búsquedas al backend
      remote: { slug: 'WORKSHOP' }
    }
  ]
};
```

---

## 🌍 TRADUCCIONES (i18n)

**CRÍTICO:** Nunca metas strings a fuego (hardcoded). 
- **Frontend:** `src/locales/es.json`
- **Backend:** `src/locales/es/`

Si el componente se llama `Taller`, la traducción debería estar bajo `dashboard.taller`. 

---

## 🚀 CONSEJOS DE ARQUITECTURAS (GDE Style)

1. **SOLID:** Si tu controller tiene más de 100 líneas, estás haciendo algo mal. Delegá al service.
2. **KISS:** No te pases de mambo con abstracciones innecesarias. El `CustomCrud` ya es bastante potente.
3. **TYPE EVERYTHING:** Nada de `any`. Si no tenés el tipo, crealo. Estamos en TypeScript, no en la selva.

---

**¿Se entendió?** Fantástico. Ahora ponete las pilas y meté código de calidad. Cualquier duda, preguntame, pero no hagas cualquiera. ¡Dale!
