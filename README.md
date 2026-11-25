# 🖋️ Onide Tattoo — Full-Stack Portfolio & Automated Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI_Design-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Calendar API](https://img.shields.io/badge/Google_Calendar-Multi--Calendar_Sync-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-CI%2FCD_%26_Cron_Jobs-000000?style=for-the-badge&logo=vercel&logoColor=white)

Plataforma web comercial y sistema de agendamiento automatizado en producción para **Onide Tattoo** (Edmonton, Alberta, Canadá). Construida de cero con **Next.js** y **Tailwind CSS**, conectada a **Google Calendar API** y automatizada mediante **Vercel Cron Jobs**.

🌐 **Sitio en producción:** [onidetattoo.com](https://onidetattoo.com)

---

## 🎯 Problema de Negocio Resuelto
Un artista tatuador itinerante y con alta demanda necesitaba centralizar su portafolio visual por estilos y automatizar la gestión de consultas presenciales/virtuales evitando superposiciones de agenda y ausencias (*no-shows*), sin depender de plataformas SaaS con comisiones mensuales.

---

## 🏗️ Arquitectura y Funcionalidades Clave

### 1. Motor de Reservas Multi-Calendario (`Google Calendar API`)
- Integración backend segura mediante **IAM Service Account** con validación de disponibilidad en tiempo real sobre múltiples calendarios (`CALENDARS_TO_CHECK`) en bloques de 30 minutos.
- Flujo de aprobación/rechazo de consultas desde correo electrónico con creación automática del evento en agenda y enlaces directos a WhatsApp.

### 2. Recordatorios Automatizados (`Vercel Cron Jobs`)
- Endpoint programado (`/api/send-reminders`) ejecutado diariamente en Vercel que detecta turnos próximos y envía notificaciones automáticas con botones interactivos de confirmación de asistencia.

### 3. Experiencia Visual y Conversión (Frontend & SEO)
- Diseño editorial oscuro (*dark-mode*) con galerías categorizadas (*Black & Grey Realism*, *Neo Tribal*, *Cover-ups*, *Custom Projects*), previsualización de videos en hover y guía de cuidados posteriores (*Aftercare*).
- Integración de reseñas verificadas de Google, feed de Instagram, geolocalización del estudio en Edmonton y analítica de tráfico mediante **Google Analytics (`GA4`)**.

### 4. Despliegue Continuo (CI/CD)
- Pipeline automatizado en **Vercel** disparado por `git push` sobre la rama principal, con configuración DNS personalizada (`Namecheap` ➔ `Vercel DNS`).

---

## 🛠️ Stack Tecnológico
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend & APIs:** Next.js API Routes, Google Calendar API (Service Account), Nodemailer / Email Automation
- **Infraestructura & Analytics:** Vercel (Hosting + Cron Jobs), Namecheap DNS, Google Analytics 4