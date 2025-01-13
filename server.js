const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 6001; // Ändern Sie den Port hier

// Middleware
app.use(bodyParser.json());
app.use(cors());

// SQLite-Datenbankverbindung
const db = new sqlite3.Database("C:/Schule/ProjektZoo/parking_reservations.db", (err) => {
  if (err) {
    console.error("Fehler beim Verbinden mit der Datenbank:", err.message);
  } else {
    console.log("Erfolgreich mit der SQLite-Datenbank verbunden.");
    // Tabelle erstellen, falls sie nicht existiert
    db.run(
      `CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slot TEXT UNIQUE,
        name TEXT,
        reservation_date TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error("Fehler beim Erstellen der Tabelle:", err.message);
        } else {
          console.log("Tabelle 'reservations' erfolgreich erstellt oder existiert bereits.");
        }
      }
    );
  }
});

// Route: Parkplatz reservieren
app.post("/reserve", (req, res) => {
  const { slot, name } = req.body;

  if (!slot || !name) {
    return res.status(400).json({ error: "Slot und Name sind erforderlich." });
  }

  const query = "INSERT INTO reservations (slot, name) VALUES (?, ?)";
  db.run(query, [slot, name], function (err) {
    if (err) {
      console.error("Fehler beim Einfügen der Reservierung:", err.message);
      res.status(500).json({ error: "Fehler beim Speichern der Reservierung." });
    } else {
      res.status(201).json({ id: this.lastID, slot, name });
    }
  });
});

// Route: Alle Reservierungen anzeigen
app.get("/reservations", (req, res) => {
  const query = "SELECT * FROM reservations";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Fehler beim Abrufen der Reservierungen:", err.message);
      res.status(500).json({ error: "Fehler beim Abrufen der Reservierungen." });
    } else {
      res.json(rows);
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft unter http://localhost:${PORT}`);
});