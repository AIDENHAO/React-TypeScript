import React from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import CharacterPanelCompact from './components/CharacterPanelCompact';
import './App.css';

function App() {
  return (
    <CharacterProvider>
      <div className="App" style={{ height: '100vh', background: '#0a0a0a', margin: 0, padding: 0 }}>
        <CharacterPanelCompact />
      </div>
    </CharacterProvider>
  );
}

export default App;