import React, { useState } from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import { ClanProvider } from './contexts/ClanContext';
import CharacterPanel from './components/CharacterPanel/CharacterPanel';
import ClanPanel from './components/ClanPanel/ClanPanel';
import GameMainScene from './components/GameMainScene/GameMainScene';
import TestPage from './pages/TestPage';
import styles from './App.module.scss';

/**
 * 页面类型定义
 * @typedef {'main' | 'game' | 'test'} PageType
 */
type PageType = 'main' | 'game' | 'test';

/**
 * 应用程序主组件
 * 提供修仙宗门模拟器的主界面，包含导航栏和页面切换功能
 * @returns {JSX.Element} 应用程序根组件
 */
function App() {
  // 当前页面状态
  const [currentPage, setCurrentPage] = useState<PageType>('main');

  /**
   * 根据当前页面类型渲染对应的页面内容
   * @returns {JSX.Element} 页面内容组件
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'test':
        return <TestPage />;
      case 'game':
        return <GameMainScene />;
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
                  className={`${styles.navButton} ${currentPage === 'game' ? styles.active : ''}`}
                  onClick={() => setCurrentPage('game')}
                >
                  🎮 游戏场景
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