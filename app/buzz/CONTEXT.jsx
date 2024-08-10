import React, { createContext, useContext, useState } from 'react';

// Create the context
const BuzzerContext = createContext();

// Provider component to wrap around Host and Player
export const BuzzerProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [buzzes, setBuzzes] = useState([]);
    const [playSound, setPlaySound] = useState(false);
    const [locked, setLocked] = useState(false);

    const addPlayer = (name) => {
        setPlayers([...players, { name, id: Date.now() }]);
    };

    const addBuzz = (playerName) => {
        if (!locked) {
            const newBuzz = { playerName, timestamp: new Date().getTime() };
            setBuzzes([...buzzes, newBuzz]);
            if (playSound) {
                // Logic to play sound
                new Audio('/buzz-sound.mp3').play(); // Assuming you have a sound file
            }
        }
    };

    const clearBuzzes = () => {
        setBuzzes([]);
    };

    const kickPlayer = (id) => {
        setPlayers(players.filter(player => player.id !== id));
    };

    return (
        <BuzzerContext.Provider value={{
            players,
            buzzes,
            playSound,
            locked,
            addPlayer,
            addBuzz,
            clearBuzzes,
            kickPlayer,
            setPlaySound,
            setLocked
        }}>
            {children}
        </BuzzerContext.Provider>
    );
};

export const useBuzzerContext = () => useContext(BuzzerContext);
