# Workflow

Flujo simple para publicar cambios en el portafolio.

1. Trabajar en los cambios
2. git add .
3. git status / git diff  → una mirada rápida para no subir nada por accidente (console.log, imágenes pesadas, API keys)
4. git commit -m "feat: descripción clara del cambio"
5. git push
6. Abrir la URL de Vercel y confirmar que se ve bien en vivo

## Notas
- Mensajes de commit claros: son para mi yo del futuro, no para impresionar.
- Mirar el diff antes de commitear es el paso que evita errores tontos.
- "Funciona en local" no garantiza que se vea bien publicado: siempre revisar el deploy.
