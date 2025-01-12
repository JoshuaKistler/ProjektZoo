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

export default App;
