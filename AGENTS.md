<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Workflow & Paths (Nostos Project)

- **Git Executable Location**: `C:\Users\ameto\.git-portable\cmd\git.exe`
- **Important**: `git` is NOT added to the global system `%PATH%`. Do NOT attempt to run plain `git` commands or search the filesystem for git.
- Always execute git commands using the full path:
  - Check status: `& "C:\Users\ameto\.git-portable\cmd\git.exe" status`
  - Stage changes: `& "C:\Users\ameto\.git-portable\cmd\git.exe" add .`
  - Commit: `& "C:\Users\ameto\.git-portable\cmd\git.exe" commit -m "<commit message>"`
  - Push to remote: `& "C:\Users\ameto\.git-portable\cmd\git.exe" push origin main`

