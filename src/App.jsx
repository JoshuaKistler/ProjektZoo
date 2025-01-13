import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [name, setName] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      slot: String.fromCharCode(65 + Math.floor(index / 5)) + ((index % 5) + 1),
      isBooked: false,
      isReserved: false,
      reservedBy: "",
    }))
  );

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:6001/reservations"); // Ändern Sie den Port hier
        const reservations = await response.json();
        setParkingSpaces((prevSpaces) =>
          prevSpaces.map((space) => {
            const reservation = reservations.find(
              (res) => res.slot === space.slot
            );
            return reservation
              ? { ...space, isReserved: true, reservedBy: reservation.name }
              : space;
          })
        );
      } catch (error) {
        console.error("Fehler beim Laden der Reservierungen:", error);
      }
    };

    fetchReservations();
  }, []);

<<<<<<< HEAD
  // Handle Reservation
  const handleReservation = async () => {
    if (selectedParkingSpace !== null && name.trim() !== "") {
      try {
        const response = await fetch("http://localhost:6001/reserve", { // Ändern Sie den Port hier
=======
  const handleBooking = (id) => {
    if (!parkingSpaces[id - 1].isReserved) {
      setSelectedParkingSpace(id);
    }
  };

  const handleReservation = async () => {
    if (selectedParkingSpace !== null && name.trim() !== "") {
      // 1. Reservierung an das Backend senden
      try {
        const response = await fetch("http://localhost:5000/reserve", {
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
<<<<<<< HEAD
            slot: selectedParkingSpace, // Parkplatz-ID als Slot übergeben
            name: name, // Name des Benutzers
=======
            parkingSpaceId: selectedParkingSpace,
            reservedBy: name,
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
          }),
        });

        const data = await response.json();
        if (data.id) {
<<<<<<< HEAD
          alert(`Reservierung erfolgreich für Parkplatz ${data.slot}.`);
          // Lokale Aktualisierung der Parkplätze
          setParkingSpaces((prevSpaces) =>
            prevSpaces.map((space) =>
              space.slot === selectedParkingSpace
                ? { ...space, isReserved: true, reservedBy: name }
                : space
            )
          );
          setSelectedParkingSpace(null); // Auswahl zurücksetzen
          setName(""); // Eingabefeld zurücksetzen
=======
          alert(`Reservierung erfolgreich für Parkplatz A${selectedParkingSpace}.`);
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
        } else {
          alert("Fehler bei der Reservierung.");
        }
      } catch (error) {
        alert("Es gab einen Fehler bei der Verbindung zum Server.");
        console.error(error);
      }
<<<<<<< HEAD
=======

      // 2. Lokale Aktualisierung der Reservierung
      setParkingSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space.id === selectedParkingSpace
            ? { ...space, isReserved: true, reservedBy: name } // Status als reserviert setzen
            : space
        )
      );
      setSelectedParkingSpace(null); // Auswahl zurücksetzen
      setName(""); // Eingabefeld zurücksetzen
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
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
<<<<<<< HEAD
              className={`parking-space ${space.isReserved ? "reserved" : space.isBooked ? "booked" : selectedParkingSpace === space.slot ? "selected" : ""}`}
              onClick={() => !space.isReserved && setSelectedParkingSpace(space.slot)} // Parking space selection
=======
              className={`parking-space ${space.isReserved ? "reserved" : space.isBooked ? "booked" : selectedParkingSpace === space.id ? "selected" : ""}`}
              onClick={() => handleBooking(space.id)} // Parkplatz auswählen
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
              style={{ cursor: space.isReserved ? "not-allowed" : "pointer" }}
              data-name={space.isReserved ? space.reservedBy : ""}
            >
              <div className="parking-icon">
                <span>{space.slot}</span>
              </div>
              {space.isBooked && !space.isReserved && (
                <button
                  className="reserve-button"
                  onClick={(e) => {
                    e.stopPropagation();
<<<<<<< HEAD
                    setSelectedParkingSpace(space.slot); // Select parking space for reservation
=======
                    handleBooking(space.id); // Parkplatz für Reservierung auswählen
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
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
<<<<<<< HEAD
=======

      {/* Hintergrundbild div */}
      <div
        className="imgs"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Das zufällige Hintergrundbild setzen
        }}
      ></div>
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 3b601ab2807d1a7457df8c51be6d76cdbadd2d92
