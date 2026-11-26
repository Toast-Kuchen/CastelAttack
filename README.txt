CASTLE ATTACK 2 REMAKE – iOS-PWA (Fan-Remake, eigene Grafik & Sound)

DATEIEN (alle flach im Stammverzeichnis)
index.html, styles.css, config.js (Balancing), audio.js (Sound/Musik, per Web Audio erzeugt),
game.js (Simulation, Rendering, Eingabe, UI), service-worker.js, manifest.webmanifest, Icons.
Kein Build-Schritt nötig: reines HTML/CSS/JavaScript.

LOKAL ENTWICKELN
  python3 -m http.server 8080   (im entpackten Ordner)  ->  http://localhost:8080
  (localhost erlaubt Service Worker auch ohne HTTPS)

HOSTING (HTTPS Pflicht)
  Ordnerinhalt unverändert hochladen, z. B. Netlify Drop, GitHub Pages, Cloudflare Pages.
  Funktioniert auch in einem Unterpfad, da alle Pfade relativ sind.

INSTALLATION AUF DEM IPHONE
  1. URL in Safari öffnen, warten bis im Menü „✓ Offline spielbereit“ steht.
  2. Teilen -> „Zum Home-Bildschirm“.  3. Vom Home-Bildschirm starten – läuft danach offline.
  Querformat empfohlen. Ton startet nach dem ersten Antippen (iOS-Vorgabe).

UPDATES
  Nach Änderungen in service-worker.js die Konstante V (und SWV in game.js) erhöhen,
  z. B. 'ca2-v2'. Die App zeigt dann „Update installieren“.

STEUERUNG
  ▲▼ Winkel, 🏹 halten = feuern, +🏹/−🏹 Bogenschützen, Öl / Mangonel / Stämme, ❚❚ Pause.
  Tastatur: Pfeiltasten, Leertaste, A/D, 1/2/3, P.
