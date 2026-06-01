# CLAUDE.md — cv-gonzalo (friasg.interactivevitae.com)

## Arquitectura
- Stack: Vanilla HTML/CSS/JS
- Deploy: Netlify (GitHub → auto deploy)
- Dominio: friasg.interactivevitae.com
- Repo: github.com/GonzaloFriasTech/FriasG-cv.git

## Archivos clave
- data.js — todo el contenido del CV (único archivo que cambia por cliente)
- template.js — toda la lógica de renderizado dinámico
- template.css — estilos globales
- index.html — entrada principal (solo carga data.js y template.js)
- chat.html — página /chat con chatbot expandido
- projects.html — página /projects con 3 proyectos
- netlify/functions/chat.js — función serverless que conecta con Anthropic API

## Páginas
- / → index.html (CV principal)
- /chat → chat.html (chatbot expandido + FAQ)
- /projects → projects.html (proyectos de IA)

## Decisiones importantes
- El system prompt está hardcodeado en netlify/functions/chat.js (NO como variable de entorno — supera el límite de 4KB de AWS Lambda)
- ANTHROPIC_API_KEY sí va como variable de entorno en Netlify
- Los links del nav desde subpáginas usan /# (ej: /#sobre-mi) no index.html# — Netlify lo resuelve correctamente
- El chatbot NO usa Markdown en respuestas (configurado en system prompt)
- Límite de 10 preguntas por sesión implementado en setupChat() en template.js
- Dark mode de logos: logo-iv.png → logo-dark.png, logo-tcl.png → logo-tcl-dark.png
- Email actual: frias.gonzalo01@gmail.com
- LinkedIn actual: https://www.linkedin.com/in/frias-gonzalo/

## Logos en carpeta raíz
- logo-iv.png / logo-dark.png — Interactive Vitae
- logo-tcl.png / logo-tcl-dark.png — The Commerce League
- logo-feriados.png — Fer-IA-Dos
- logo-gemba.png — Gemba Digital (reservado para uso futuro)
- foto.png — foto de perfil
- CV_Gonzalo_Frias.pdf — CV descargable

## Pendiente
- Notificaciones Telegram cuando alguien usa el chatbot
- Tour desde subpáginas (funciona en producción, falla en local por restricciones file://)

## Errores conocidos
- En local (file://) el botón Tour desde subpáginas no redirige — es comportamiento esperado del browser, funciona bien en producción
- LF/CRLF warnings en git add en Windows — son normales, no afectan el deploy
