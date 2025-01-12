import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parkingSpaces, setParkingSpaces] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      isBooked: false,
      isReserved: false,
    }))
  );
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleBooking = (id) => {
    setSelectedParkingSpace(id);
  };

  const handleReservation = () => {
    if (selectedParkingSpace) {
      setParkingSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space.id === selectedParkingSpace
            ? { ...space, isReserved: true, isBooked: true }
            : space
        )
      );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Parkplatzreservierung</h1>
        <button className="menu-button" onClick={toggleModal}>
          <div className="burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </header>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={toggleModal}>
              &times;
            </button>
            <nav className="menu">
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      <main className="content">
        <h2>Parkplatz auswählen und dann buchen</h2>
        
        <div className="parking-lot">
          {parkingSpaces.map((space) => (
            <div
              key={space.id}
              className={`parking-space ${space.isReserved ? "reserved" : space.isBooked ? "booked" : ""}`}
              onClick={() => handleBooking(space.id)}
            >
              <span className="parking-number">{space.id}</span>
            </div>
          ))}
        </div>

        {/* Button wird erst aktiv, wenn ein Parkplatz ausgewählt ist */}
        {selectedParkingSpace && (
          <div className="confirmation">
            <button 
              onClick={handleReservation} 
              disabled={parkingSpaces[selectedParkingSpace - 1].isReserved}
            >
              {parkingSpaces[selectedParkingSpace - 1].isReserved ? "Bereits reserviert" : "Parkplatz buchen"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
