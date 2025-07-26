import React from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import { ClanProvider } from './contexts/ClanContext';
import CharacterPanel from './components/CharacterPanel/CharacterPanel';
import ClanPanel from './components/ClanPanel/ClanPanel';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.appContainer}>
      <CharacterProvider>
        <ClanProvider>
          <div className={styles.mainContent}>
            <h1 className={styles.pageTitle}>修仙宗门模拟器</h1>
            <div className={styles.panelsContainer}>
              <CharacterPanel />
              <ClanPanel />
            </div>
          </div>
        </ClanProvider>
      </CharacterProvider>
    </div>
  );
}

export default App;