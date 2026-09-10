<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Workflow & Paths (Nostos Project)

- **CRITICAL RULE**: After making ANY code changes or completing a task, you MUST automatically commit and push the changes to the repository using the commands below, without asking the user for permission.
- **Git Executable Location**: `C:\Users\ameto\.git-portable\cmd\git.exe`
- **Important**: `git` is NOT added to the global system `%PATH%`. Do NOT attempt to run plain `git` commands or search the filesystem for git.
- Always execute git commands using the full path:
  - Check status: `& "C:\Users\ameto\.git-portable\cmd\git.exe" status`
  - Stage changes: `& "C:\Users\ameto\.git-portable\cmd\git.exe" add .`
  - Commit: `& "C:\Users\ameto\.git-portable\cmd\git.exe" commit -m "<commit message>"`
  - Push to remote: `& "C:\Users\ameto\.git-portable\cmd\git.exe" push origin main`

---


## Memoria Persistente (Auto-Aprendizaje)

Este archivo es tu **única memoria entre sesiones**. Cada chat nuevo empieza desde cero, así que todo lo que no esté aquí, se pierde.

### Instrucciones
Cuando durante una sesión de trabajo descubras algo que cumple **todas** estas condiciones:
1. Es un problema que ya ha causado errores o confusión.
2. Es algo que **se repetirá** en futuras sesiones si no se documenta.
3. No es obvio ni trivial (no documentes cosas genéricas de programación).

Entonces **añádelo** a la sección "Lecciones Aprendidas" de abajo, siguiendo este formato:
- Una línea concisa que describa la regla o el aprendizaje.
- No repitas reglas que ya existan en otra sección de este archivo.
- Mantén esta lista corta y útil (máximo ~10 entradas). Si se llena, consolida o elimina las menos relevantes.

### Lecciones Aprendidas
- **Al completar una tarea o feature que funciona, siempre debes intentar hacer commit y push de los cambios para no perder el progreso.**