import React, { useState } from 'react';
import styles from './GameMainScene.module.scss';

/**
 * 游戏主场景界面组件
 * 实现修仙游戏的主界面，包含人物信息、地图场景、导航等功能
 * @returns {JSX.Element} 游戏主场景组件
 */
const GameMainScene: React.FC = () => {
  // 当前选中的地图区域
  const [selectedArea, setSelectedArea] = useState<string>('');
  
  // 底部导航选中状态
  const [activeTab, setActiveTab] = useState<string>('map');

  /**
   * 处理地图区域点击事件
   * @param {string} areaName - 区域名称
   */
  const handleAreaClick = (areaName: string) => {
    setSelectedArea(areaName);
    console.log(`选择了区域: ${areaName}`);
  };

  /**
   * 处理底部导航点击事件
   * @param {string} tabName - 导航标签名称
   */
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    console.log(`切换到: ${tabName}`);
  };

  return (
    <div className={styles.gameMainScene}>
      {/* 顶部人物信息栏 */}
      <div className={styles.topBar}>
        <div className={styles.characterInfo}>
          {/* 人物头像 */}
          <div className={styles.avatarContainer}>
            <img 
              src="/images/character-avatar.svg" 
              alt="人物头像" 
              className={styles.avatar}
            />
            <div className={styles.avatarFrame}></div>
          </div>
          
          {/* 人物基本信息 */}
          <div className={styles.characterDetails}>
            <h2 className={styles.characterName}>徐日仙</h2>
            <div className={styles.characterLevel}>凡人阶段 · 练气</div>
          </div>
        </div>
        
        {/* 战务力显示 */}
        <div className={styles.powerDisplay}>
          <div className={styles.powerLabel}>战务力</div>
          <div className={styles.powerValue}>1234</div>
          <div className={styles.powerProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width: '65%'}}></div>
            </div>
          </div>
        </div>
        
        {/* 顶部功能按钮 */}
        <div className={styles.topActions}>
          <button className={styles.actionBtn}>练武场</button>
          <button className={styles.actionBtn}>炼丹房</button>
          <button className={styles.actionBtn}>+</button>
        </div>
      </div>

      {/* 宗门标识 */}
      <div className={styles.sectionLabel}>
        <div className={styles.labelText}>徐日仙宗门</div>
        <div className={styles.labelIcon}>⚡</div>
      </div>

      {/* 主地图区域 */}
      <div className={styles.mapContainer}>
        <div className={styles.mapBackground}>
          {/* 地图各个区域点 */}
          <div 
            className={`${styles.mapArea} ${styles.area1}`}
            onClick={() => handleAreaClick('修炼室')}
          >
            <div className={styles.areaIcon}>🏠</div>
            <div className={styles.areaName}>修炼室</div>
          </div>
          
          <div 
            className={`${styles.mapArea} ${styles.area2}`}
            onClick={() => handleAreaClick('藏书阁')}
          >
            <div className={styles.areaIcon}>📚</div>
            <div className={styles.areaName}>藏书阁</div>
          </div>
          
          <div 
            className={`${styles.mapArea} ${styles.area3}`}
            onClick={() => handleAreaClick('炼器房')}
          >
            <div className={styles.areaIcon}>⚒️</div>
            <div className={styles.areaName}>炼器房</div>
          </div>
          
          <div 
            className={`${styles.mapArea} ${styles.area4}`}
            onClick={() => handleAreaClick('灵药园')}
          >
            <div className={styles.areaIcon}>🌿</div>
            <div className={styles.areaName}>灵药园</div>
          </div>
          
          <div 
            className={`${styles.mapArea} ${styles.area5}`}
            onClick={() => handleAreaClick('宗门大殿')}
          >
            <div className={styles.areaIcon}>🏛️</div>
            <div className={styles.areaName}>宗门大殿</div>
          </div>
          
          <div 
            className={`${styles.mapArea} ${styles.area6}`}
            onClick={() => handleAreaClick('后山秘境')}
          >
            <div className={styles.areaIcon}>⛰️</div>
            <div className={styles.areaName}>后山秘境</div>
          </div>
        </div>
      </div>

      {/* 底部圆形导航按钮 */}
      <div className={styles.bottomNavigation}>
        <button 
          className={`${styles.navBtn} ${activeTab === 'character' ? styles.active : ''}`}
          onClick={() => handleTabClick('character')}
        >
          <div className={styles.navIcon}>👤</div>
        </button>
        
        <button 
          className={`${styles.navBtn} ${activeTab === 'inventory' ? styles.active : ''}`}
          onClick={() => handleTabClick('inventory')}
        >
          <div className={styles.navIcon}>🎒</div>
        </button>
        
        <button 
          className={`${styles.navBtn} ${activeTab === 'shop' ? styles.active : ''}`}
          onClick={() => handleTabClick('shop')}
        >
          <div className={styles.navIcon}>🛒</div>
        </button>
        
        <button 
          className={`${styles.navBtn} ${activeTab === 'clan' ? styles.active : ''}`}
          onClick={() => handleTabClick('clan')}
        >
          <div className={styles.navIcon}>🏰</div>
        </button>
        
        <button 
          className={`${styles.navBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => handleTabClick('settings')}
        >
          <div className={styles.navIcon}>⚙️</div>
        </button>
      </div>

      {/* 底部信息面板 */}
      <div className={styles.bottomPanel}>
        <div className={styles.panelTabs}>
          <button className={`${styles.panelTab} ${styles.active}`}>修炼日志</button>
          <button className={styles.panelTab}>大事纪要</button>
          <button className={styles.panelTab}>世界动向</button>
        </div>
        
        <div className={styles.panelContent}>
          <div className={styles.newsItem}>
            <img src="/images/news-avatar.svg" alt="头像" className={styles.newsAvatar} />
            <div className={styles.newsText}>
              <div className={styles.newsTitle}>世界新闻：苍穹内宗道统失守</div>
              <div className={styles.newsTime}>刚刚</div>
            </div>
            <button className={styles.newsAction}>前往</button>
          </div>
          
          <div className={styles.newsItem}>
            <div className={styles.newsText}>
              <div className={styles.newsTitle}>内容内容新闻标题</div>
              <div className={styles.newsSubtitle}>作者名称</div>
            </div>
            <button className={styles.newsAction}>前往</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMainScene;