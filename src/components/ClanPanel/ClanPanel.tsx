import React from 'react';
import { useClan, ClanData } from '../../contexts/ClanContext';
import styles from './ClanPanel.module.scss';

const ClanPanel: React.FC = () => {
  const { data: clan, loading, error } = useClan();

  if (loading) return <div className={styles.loading}>加载中...</div>;
  if (error) return <div className={styles.error}>错误: {error}</div>;
  if (!clan) return null;

  const { baseAttrs = {}, battleAttrs = {}, specialAttrs = {}, buildings = [], resources = {} } = clan;

  return (
    <div className={styles.clanPanel}>
      <div className={styles.header}>
        <h2>宗门属性</h2>
        <span className={styles.infoIcon}>ⓘ</span>
      </div>

      <div className={styles.clanInfo}>
        <div className={styles.banner}>
          <div className={styles.bannerContent}>
            <h3>{baseAttrs?.name}</h3>
            <div className={styles.levelInfo}>等级: {baseAttrs?.level}</div>
            <div className={styles.reputationInfo}>声望: {specialAttrs?.reputation}</div>
          </div>
        </div>
      </div>

      <div className={styles.attributesGrid}>
        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>基础规模</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>弟子数量</span>
              <span className={styles.attributeValue}>{baseAttrs?.memberCount}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>领地面积</span>
              <span className={styles.attributeValue}>{baseAttrs?.territorySize}亩</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>建筑数量</span>
              <span className={styles.attributeValue}>{baseAttrs?.buildingCount}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>资源点</span>
              <span className={styles.attributeValue}>{baseAttrs?.resourcePoints}</span>
            </div>
          </div>
        </div>

        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>资源产出</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>灵石/小时</span>
              <span className={styles.attributeValue}>{resources.spiritStoneProduction}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>药材/小时</span>
              <span className={styles.attributeValue}>{resources.medicineProduction}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>矿石/小时</span>
              <span className={styles.attributeValue}>{resources.oreProduction}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>木材/小时</span>
              <span className={styles.attributeValue}>{resources.woodProduction}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.defenseSection}>
        <h4 className={styles.sectionTitle}>防御与战争</h4>
        <div className={styles.defenseGrid}>
          <div className={styles.defenseItem}>
            <span className={styles.defenseName}>宗门防御</span>
            <span className={styles.defenseValue}>{battleAttrs.clanDefense}</span>
          </div>
          <div className={styles.defenseItem}>
            <span className={styles.defenseName}>战争属性</span>
            <span className={styles.defenseValue}>{battleAttrs.warAttr}</span>
          </div>
          <div className={styles.defenseItem}>
            <span className={styles.defenseName}>阵法等级</span>
            <span className={styles.defenseValue}>{battleAttrs.formationLevel}</span>
          </div>
          <div className={styles.defenseItem}>
            <span className={styles.defenseName}>护山大阵</span>
            <span className={styles.defenseValue}>{battleAttrs.mountainProtection}</span>
          </div>
        </div>
      </div>

      <div className={styles.buildingsSection}>
        <h4 className={styles.sectionTitle}>主要建筑</h4>
        <div className={styles.buildingsList}>
          {buildings.map((building: ClanData['buildings'][0], index: number) => (
            <div key={index} className={styles.buildingItem}>
              <span className={styles.buildingName}>{building.name}</span>
              <div className={styles.buildingProgress}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${building.level / building.maxLevel * 100}%` }}
                ></div>
              </div>
              <span className={styles.buildingLevel}>
                Lv.{building.level}/{building.maxLevel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton}>管理弟子</button>
        <button className={styles.actionButton}>升级建筑</button>
        <button className={styles.actionButton}>宗门科技</button>
        <button className={styles.actionButton}>外交关系</button>
      </div>
    </div>
  );
};

export default ClanPanel;