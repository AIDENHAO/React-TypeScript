import React, { useState } from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import { ClanProvider } from './contexts/ClanContext';
import CharacterPanel from './components/CharacterPanel/CharacterPanel';
import ClanPanel from './components/ClanPanel/ClanPanel';
import TestPage from './pages/TestPage';
import styles from './App.module.scss';

type PageType = 'main' | 'test';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');

  const renderPage = () => {
    switch (currentPage) {
      case 'test':
        return <TestPage />;
      case 'main':
      default:
        return (
          <div className={styles.mainContent}>
            <h1 className={styles.pageTitle}>修仙宗门模拟器</h1>
            <div className={styles.panelsContainer}>
              <CharacterPanel />
              <ClanPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.appContainer}>
      <CharacterProvider>
        <ClanProvider>
          {/* 导航栏 */}
          <nav className={styles.navigation}>
            <div className={styles.navContainer}>
              <div className={styles.navBrand}>
                <span className={styles.brandIcon}>⚡</span>
                <span className={styles.brandText}>修仙模拟器</span>
              </div>
              <div className={styles.navLinks}>
                <button 
                  className={`${styles.navButton} ${currentPage === 'main' ? styles.active : ''}`}
                  onClick={() => setCurrentPage('main')}
                >
                  🏠 主页面
                </button>
                <button 
                  className={`${styles.navButton} ${currentPage === 'test' ? styles.active : ''}`}
                  onClick={() => setCurrentPage('test')}
                >
                  🧪 功能测试
                </button>
              </div>
            </div>
          </nav>
          
          {/* 页面内容 */}
          {renderPage()}
        </ClanProvider>
      </CharacterProvider>
    </div>
  );
}

export default App;