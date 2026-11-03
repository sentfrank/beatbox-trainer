# Beatbox-Trainer

Web-App, um in 8 Wochen Beatboxen für die A-cappella-Gruppe zu lernen.

- Klang-Bibliothek: Kick, Hi-Hat, offene Hi-Hat, Pf-Snare, K-Snare, Inward K, gesummter Bass, Lip Roll – mit Anleitung, typischen Fehlern und Demo-Klang
- Groove-Trainer: 24 Patterns (Grundbeats, Stile, Fills, A-cappella-Grooves) mit Lauflicht, Tempo, Swing, Tap-Tempo
- Modi: Vormachen · Mitmachen · Solo + Klick
- Mikro-Analyse: misst Timing (zu früh / zu spät), Trefferquote und Sterne; Aufnahme zum Anhören
- 8-Wochen-Plan (3 × 30 Min pro Woche), Fortschritt lokal im Browser

Lokal starten: `npm install && npm run dev`

## Deployment
Bei jedem Push auf `main` baut GitHub Actions die App und veröffentlicht sie auf GitHub Pages
und per SFTP auf Strato im Ordner `w-esel/beatbox-trainer` → https://w-esel.de/beatbox-trainer

Repository-Secrets (Settings → Secrets and variables → Actions) wie beim Klavier-Trainer:
- `STRATO_SFTP_USER`, `STRATO_SFTP_PASSWORD`
- optional `STRATO_SFTP_HOST` (Standard `ssh.strato.de`) und Variable `STRATO_TARGET_DIR`
