# Bloomy
Hola 🥸
Esta es un aplicación web para recomendaciones agrícolas inteligentes y gestión de usuarios con flujos premium. Bloomy combina generación de reportes personalizados con IA, verificación de correo, recuperación de contraseña, pagos (Stripe) y autenticación tradicional y con Google.

## Características Principales

1. Generación de Reporte Agrícola con IA (Gemini)
	- Reporte Markdown enriquecido según ubicación seleccionada en mapa (Leaflet).
	- Diferenciación de contenido para usuarios Premium vs No Premium.
	- Indicadores de carga (spinner + "¿Sabías que?") durante la generación.

2. Mapa Interactivo
	- Selección de coordenadas geográficas para el terreno.
	- Dimensiones y disposición del terreno como parámetros extra para usuarios Premium.

3. Flujo de Suscripción Premium (Stripe)
	- Checkout de suscripción (Stripe Checkout).
	- Webhook para actualizar estado `isPremium` del usuario.
	- Fallback de confirmación en entorno local si el webhook no llega.

4. Autenticación y Gestión de Cuenta
	- Registro con verificación de correo vía código (Nodemailer + registro condicional).
	- Login tradicional (correo + contraseña) con JWT httpOnly cookie.
	- Login con Google (Google Identity Services + validación ID Token servidor).
	- Cambio de contraseña autenticado.
	- Flujo "Olvidé contraseña" con código temporal y restablecimiento.

5. Navegación Condicional / UI Dinámica
	- Navbar adaptativa según ruta (Home, Dashboard, Consejos) y estado Premium.
	- Tema oscuro principal + toggle de tema (extensible).
	- Página de Consejos Premium con secciones navegables.

6. Seguridad y Buenas Prácticas
	- Cookies httpOnly para JWT (prevención XSS). SameSite configurado según entorno.
	- Verificación de firma Stripe con cuerpo raw antes de `express.json`.
	- Validación de ID Token Google en servidor (no se confía solo en el cliente).
	- Exigencia de verificación de correo antes de crear cuenta local.

## Stack Tecnológico

Frontend:
- React + Vite
- React Router
- Axios (consumo de API con cookies)
- React Markdown + remark-gfm (renderizado del reporte IA)
- Leaflet (mapa y selección de ubicación)

Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) para sesión
- Stripe (suscripción Premium)
- Nodemailer (códigos de verificación / reset)
- Google Identity (google-auth-library para validar tokens)
- Google Generative AI (Gemini) para generación de reporte

Infra / Otros:
- Variables de entorno separadas cliente (.env) y servidor (.env)
- Webhook Stripe con firma (raw body parsing)
- Arquitectura modular (controllers / routes / models / services)

## Estructura de Carpetas

```
client/
  bloom y-project/
	 src/
		components/ (Navbar, ThemeToggle, GoogleLoginButton, etc.)
		pages/ (HomeBloomy, Dashboard, Consejos, Login, Register, ForgotPassword)
		services/ (auth.js, stripe.js, ai.js)
		hooks/ (useAuth)
server/
  controllers/ (auth.controller.js, stripe.controller.js, ai.controller.js ...)
  models/ (User.js, EmailVerification.js, PasswordReset.js)
  routes/ (auth.routes.js, stripe.routes.js, ai.routes.js)
  services/ (jwt.js, mailer.js)
  index.js
```

## Variables de Entorno

Servidor (`server/.env`):
```
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=app_password_sin_espacios
SMTP_FROM="Bloomy <tu_correo@gmail.com>"
GOOGLE_API_KEY=AIza... (Gemini)
GOOGLE_MODEL=gemini-2.5-flash
GOOGLE_CLIENT_ID=692467173645-...apps.googleusercontent.com
```

Cliente (`client/bloomy-project/.env`):
```
VITE_GOOGLE_CLIENT_ID=692467173645-...apps.googleusercontent.com
# VITE_API_URL opcional si no usas proxy de Vite
```

## Comandos de Desarrollo

Servidor:
```powershell
cd server
npm install
npm run dev
```

Cliente:
```powershell
cd client/bloomy-project
npm install
npm run dev
```

Stripe Webhook (opcional para pruebas locales):
```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Usa el `Signing secret` que entrega el CLI como `STRIPE_WEBHOOK_SECRET` y reinicia el servidor.

## Flujo de Autenticación

1. Usuario local se registra: debe verificar correo (envío código + confirmación) antes de completar registro.
2. Login local emite cookie `bloomy_token` (httpOnly).
3. Login con Google: botón obtiene `credential` (ID Token) y se envía a `/api/auth/google`.
4. Cierre de sesión limpia cookie.

## Suscripción Premium

1. Usuario (no premium) pulsa "Mejorar a Premium".
2. Se crea sesión de Checkout con Stripe (mode=subscription, price). Success URL incluye `session_id`.
3. Webhook `checkout.session.completed` marca `isPremium=true`.
4. Fallback `/api/stripe/confirm` valida sesión si el webhook no llega en dev.

## Flujo de Recuperación de Contraseña

1. Solicitud: usuario ingresa correo → se envía código.
2. Verificación: ingresa código válido.
3. Reset: establece nueva contraseña.

## Generación del Reporte IA

1. Usuario selecciona punto en mapa → se habilita "Generar Reporte".
2. Backend construye prompt diferenciando Premium (más detalles y cultivos). 
3. Respuesta en Markdown → render con `react-markdown` + `remark-gfm`.

## Extensiones Futuras (Ideas)

- Exportar Reporte a PDF.
- Rate limiting y caching de reportes IA para optimizar costo/performance.
- Panel de administración (usuarios, suscripciones, métricas de uso).
- Internacionalización (i18n) y soporte multilenguaje.
- Notificaciones email programadas (ej. recomendaciones periódicas).

## Consideraciones de Seguridad

- JWT en cookie httpOnly previene acceso JS directo a token.
- Verificación de firmas Stripe asegura integridad de eventos.
- Verificación de ID Token Google evita suplantación de identidad.
- Bcrypt para almacenamiento de contraseñas locales.
- Limpieza de registros de verificación tras uso reduce superficie de datos.

## Contribución

1. Crear branch feature/nombre-descriptivo.
2. Añadir tests/unit (pendiente incorporar framework) para lógica crítica.
3. Crear PR describiendo cambios y pasos de prueba.

## Troubleshooting Rápido

- ECONNRESET tras login Google: reintentar (botón Reintentar agregado) o verificar que el servidor no esté reiniciando.
- Webhook Stripe no actualiza Premium: confirmar `stripe listen` activo y `STRIPE_WEBHOOK_SECRET` correcto; usar fallback `/api/stripe/confirm`.
- Email no llega: revisar SMTP_PASS (App Password Gmail sin espacios) y logs en servidor.

## Licencia

Proyecto académico lol.
