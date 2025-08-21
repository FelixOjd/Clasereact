import React, { useState } from 'react';

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [winners, setWinners] = useState([]);

  const handleInputChange = (e) => {
    setNewParticipant(e.target.value);
  };

  const addParticipant = () => {
    if (newParticipant.trim() !== '') {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  // Función para realizar el sorteo
  const handleRaffle = () => {
    if (participants.length < 5) {
      alert('Necesitas al menos 5 participantes para sortear 5 ganadores.');
      return;
    }

    const shuffledParticipants = [...participants];

    for (let i = shuffledParticipants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledParticipants[i], shuffledParticipants[j]] = [shuffledParticipants[j], shuffledParticipants[i]];
    }

    // Seleccionar los primeros 5 ganadores
    const selectedWinners = shuffledParticipants.slice(0, 5);
    setWinners(selectedWinners);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Sorteo de Ganadores </h1>
        
        {/* Sección para agregar participantes */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="text"
            value={newParticipant}
            onChange={handleInputChange}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Introduce un nombre"
          />
          <button
            onClick={addParticipant}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar
          </button>
        </div>

        {/* Lista de participantes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Participantes ({participants.length})</h2>
          <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-50">
            {participants.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-left">
                {participants.map((name, index) => (
                  <li key={index} className="text-gray-600">{name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No hay participantes aún.</p>
            )}
          </div>
        </div>

        {/* Botón para sortear */}
        <button
          onClick={handleRaffle}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          ¡Sortear Ganadores!
        </button>
        
        {/* Lista de ganadores */}
        {winners.length > 0 && (
          <div className="mt-8 p-6 bg-yellow-100 rounded-2xl border-2 border-yellow-400">
            <h2 className="text-2xl font-bold mb-4 text-yellow-800">¡Los 5 Ganadores son! 🏆</h2>
            <ul className="list-decimal list-inside text-left font-medium space-y-2">
              {winners.map((winner, index) => (
                <li key={index} className="text-gray-800 text-lg">
                  {winner}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
