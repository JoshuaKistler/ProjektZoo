import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [name, setName] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      isBooked: false,
      isReserved: false,
      reservedBy: "",
    }))
  );

  const handleBooking = (id) => {
    if (!parkingSpaces[id - 1].isReserved) {
      setSelectedParkingSpace(id);
    }
  };

  const handleReservation = () => {
    if (selectedParkingSpace !== null && name.trim() !== "") {
      setParkingSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space.id === selectedParkingSpace
            ? { ...space, isReserved: true, reservedBy: name } 
            : space
        )
      );
      setSelectedParkingSpace(null);
      setName("");
    } else {
      alert("Bitte geben Sie Ihren Namen ein.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Zoo<span style={{color:"red"}}>h</span>! Parkplatz-Reservierung</h1>
      </header>

      <main className="content">
        <h2>Wählen Sie einen Parkplatz aus und klicken Sie auf 'Parkplatz reservieren'.</h2>
        <p>Geben Sie danach Ihren Namen ein, um den Parkplatz zu reservieren.</p>

        <div className="parking-lot">
          {parkingSpaces.map((space) => (
            <div
              key={space.id}
              className={`parking-space ${
                space.isReserved
                  ? "reserved"
                  : space.isBooked
                  ? "booked"
                  : selectedParkingSpace === space.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleBooking(space.id)}
              style={{
                cursor: space.isReserved ? "not-allowed" : "pointer",
              }}
              data-name={space.isReserved ? space.reservedBy : ""}
            >
              <div className="parking-icon">
                <span>{space.id}</span>
              </div>
              {space.isBooked && !space.isReserved && (
                <button
                  className="reserve-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(space.id);
                  }}
                >
                  Buchen
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedParkingSpace && (
          <div className="reservation-form">
            <input
              type="text"
              placeholder="Geben Sie Ihren Namen ein"
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
            <button onClick={handleReservation}>Parkplatz reservieren</button>
          </div>
        )}
      </main>
    </div>
  );
};
const handleReservation = async () => {
  if (selectedParkingSpace !== null && name.trim() !== "") {
    // 1. Zuerst die Reservierung an das Backend senden
    try {
      const response = await fetch("http://localhost:5000/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slot: `A${selectedParkingSpace}`, // Parkplatzzahlung: A1, A2, ...
          name: name,
        }),
      });
      
      const data = await response.json();
      if (data.id) {
        alert(`Reservierung erfolgreich für Parkplatz A${selectedParkingSpace}.`);
      } else {
        alert("Fehler bei der Reservierung.");
      }
    } catch (error) {
      alert("Es gab einen Fehler bei der Verbindung zum Server.");
      console.error(error);
    }

    // 2. Danach die Reservierung lokal im Zustand aktualisieren
    setParkingSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.id === selectedParkingSpace
          ? { ...space, isReserved: true, reservedBy: name } // Status als reserviert setzen
          : space
      )
    );
    setSelectedParkingSpace(null); // Auswahl zurücksetzen
    setName(""); // Eingabefeld zurücksetzen
  } else {
    alert("Bitte geben Sie Ihren Namen ein.");
  }
};
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [name, setName] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      isBooked: true, // Initial als verfügbar markiert
      isReserved: false,
      reservedBy: "",
    }))
  );

  // Hole alle Reservierungen beim Laden der Seite
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5000/reservations");
        const data = await response.json();
        // Aktualisiere den Status der Parkplätze basierend auf den Reservierungen
        setParkingSpaces((prevSpaces) =>
          prevSpaces.map((space) => {
            const reservation = data.find(
              (reservation) => reservation.slot === `A${space.id}`
            );
            if (reservation) {
              return {
                ...space,
                isReserved: true,
                reservedBy: reservation.name,
              };
            }
            return space;
          })
        );
      } catch (error) {
        console.error("Fehler beim Abrufen der Reservierungen", error);
      }
    };

    fetchReservations();
  }, []);

  const handleBooking = (id) => {
    if (!parkingSpaces[id - 1].isReserved) {
      setSelectedParkingSpace(id);
    }
  };

  const handleReservation = async () => {
    if (selectedParkingSpace !== null && name.trim() !== "") {
      // Sende die Reservierung an den Backend-Server
      try {
        const response = await fetch("http://localhost:5000/reserve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slot: `A${selectedParkingSpace}`,
            name: name,
          }),
        });

        const data = await response.json();
        if (data.id) {
          alert(`Reservierung erfolgreich für Parkplatz A${selectedParkingSpace}.`);
        } else {
          alert("Fehler bei der Reservierung.");
        }
      } catch (error) {
        alert("Es gab einen Fehler bei der Verbindung zum Server.");
        console.error(error);
      }

      // Aktualisiere den lokalen Zustand nach der Reservierung
      setParkingSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space.id === selectedParkingSpace
            ? { ...space, isReserved: true, reservedBy: name }
            : space
        )
      );
      setSelectedParkingSpace(null);
      setName("");
    } else {
      alert("Bitte geben Sie Ihren Namen ein.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          Zoo<span style={{ color: "red" }}>h</span>! Parkplatz-Reservierung
        </h1>
      </header>

      <main className="content">
        <h2>Wählen Sie einen Parkplatz aus und klicken Sie auf 'Parkplatz reservieren'.</h2>
        <p>Geben Sie danach Ihren Namen ein, um den Parkplatz zu reservieren.</p>

        <div className="parking-lot">
          {parkingSpaces.map((space) => (
            <div
              key={space.id}
              className={`parking-space ${
                space.isReserved
                  ? "reserved"
                  : space.isBooked
                  ? "booked"
                  : selectedParkingSpace === space.id
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleBooking(space.id)}
              style={{
                cursor: space.isReserved ? "not-allowed" : "pointer",
              }}
              data-name={space.isReserved ? space.reservedBy : ""}
            >
              <div className="parking-icon">
                <span>{space.id}</span>
              </div>
              {space.isBooked && !space.isReserved && (
                <button
                  className="reserve-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(space.id);
                  }}
                >
                  Buchen
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedParkingSpace && (
          <div className="reservation-form">
            <input
              type="text"
              placeholder="Geben Sie Ihren Namen ein"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleReservation}>Parkplatz reservieren</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;


export default App;
