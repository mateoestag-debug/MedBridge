# MedBridge — Guía de despliegue (5 minutos)

## Lo que incluye
- ✅ Auth real (email/password) con Supabase
- ✅ Base de datos compartida en la nube
- ✅ Actualización en tiempo real entre promotor y médico
- ✅ Entrevista clínica con IA (Claude)
- ✅ Reportes de triaje automáticos
- ✅ Panel del médico supervisor con notas
- ✅ Alertas WhatsApp vía Twilio (opcional)
- ✅ Diseño mobile-first, funciona en cualquier teléfono

---

## Paso 1 — Configurar Supabase (2 min)

1. Ve a [supabase.com](https://supabase.com) y abre tu proyecto
2. En el menú izquierdo: **SQL Editor → New query**
3. Pega todo el contenido de `supabase-schema.sql` y haz clic en **Run**
4. Ve a **Settings → API** y copia:
   - `Project URL` → el que termina en `.supabase.co`
   - `anon public` key

5. Abre `index.html` y reemplaza las líneas:
```js
const SUPABASE_URL  = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_ANON = 'TU_ANON_KEY';
```

6. En Supabase: **Database → Replication → Source** → activa la tabla `cases`

---

## Paso 2 — Desplegar en Vercel (2 min)

### Opción A — Desde GitHub (recomendado)
1. Sube esta carpeta a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa el repo
3. Haz clic en **Deploy** — listo

### Opción B — Desde terminal
```bash
npm i -g vercel
cd medbridge
vercel --prod
```

Tu app quedará en `https://tu-proyecto.vercel.app`

---

## Paso 3 — Alertas WhatsApp con Twilio (opcional)

### Crear cuenta Twilio
1. Ve a [twilio.com](https://twilio.com) → crea cuenta gratis
2. Activa el **WhatsApp Sandbox** en Messaging → Try it out
3. Guarda tu Account SID y Auth Token

### Configurar variables en Vercel
Ve a **Vercel → Settings → Environment Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `TWILIO_ACCOUNT_SID` | Tu Account SID |
| `TWILIO_AUTH_TOKEN` | Tu Auth Token |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` (sandbox) |
| `DOCTOR_WHATSAPP_TO` | `whatsapp:+521XXXXXXXXXX` |

Después haz un **Redeploy** en Vercel para que tome las variables.

Las alertas se envían automáticamente cuando se crea un caso URGENTE o MODERADO.

---

## Flujo de uso

### Promotor de salud
1. Entra a la URL de la app en el teléfono
2. Se registra con email/contraseña (solo la primera vez)
3. Toca **+ Nueva evaluación**
4. Llena los datos del paciente → selecciona síntoma → responde 6 preguntas de la IA
5. La IA genera el reporte de triaje y lo guarda automáticamente
6. Si el caso es URGENTE o MODERADO, el médico recibe un WhatsApp

### Médico supervisor
1. Entra a la misma URL desde cualquier dispositivo
2. Se registra seleccionando el rol **Médico supervisor**
3. Ve todos los casos en tiempo real, ordenados por urgencia
4. Abre cualquier caso, agrega una nota clínica, marca como revisado
5. El promotor puede ver la nota en su historial de casos

---

## Agregar a pantalla de inicio (app nativa)

### iPhone
1. Abre la URL en Safari
2. Toca el ícono de compartir → **Agregar a pantalla de inicio**
3. Ya funciona como app nativa

### Android
1. Abre la URL en Chrome
2. Toca los tres puntos → **Agregar a pantalla de inicio**

---

## Estructura del proyecto

```
medbridge/
├── index.html          ← App completa (auth + promotor + médico)
├── api/
│   └── notify.js       ← Serverless function para alertas WhatsApp
├── supabase-schema.sql ← Schema de la base de datos
└── README.md           ← Esta guía
```

---

## Preguntas frecuentes

**¿Cuánto cuesta?**
- Supabase: gratis hasta 500MB y 50,000 usuarios
- Vercel: gratis para proyectos personales
- Twilio WhatsApp: ~$0.005 USD por mensaje (prácticamente gratis)
- Total estimado para un piloto: **$0**

**¿Los datos son privados?**
Sí. Supabase usa Row Level Security — solo usuarios autenticados pueden ver los casos.

**¿Funciona sin internet?**
La entrevista de IA requiere internet. Los datos se sincronizan en tiempo real.

**¿Cómo agrego más médicos o promotores?**
Cada persona se registra con su propio email y elige su rol.

---

*MedBridge — Triaje clínico con IA para comunidades sin acceso médico.*
