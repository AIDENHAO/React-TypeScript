import React from 'react';
import { useCharacter } from '../../contexts/CharacterContext';
import CultivationProgress from '../CultivationProgress';
import CultivationLogComponent from '../CultivationLog';
import styles from './CharacterPanel.module.scss';

/**
 * 角色面板组件
 * 显示角色的详细属性信息，包括基础属性、修炼体系、五行亲和、战斗属性、货币等
 * 提供修炼、突破等操作按钮，以及修炼进度和日志显示
 * @returns {JSX.Element} 角色面板组件
 */
const CharacterPanel: React.FC = () => {
  // 从角色上下文获取角色数据和操作方法
  const { currentCharacter: character } = useCharacter();

  // 无角色数据时不渲染
  if (!character) {
    return (
      <div className={styles.characterPanel}>
        <div className={styles.noCharacter}>
          <p>请先选择或创建一个角色</p>
        </div>
      </div>
    );
  }

  // 解构角色数据
  const { baseAttrs, derivedAttrs, title, currency, reputation } = character;

  // 确保所有衍生属性都有安全的默认值，防止未定义错误
  const safeDerivedAttrs = derivedAttrs || { 
    totalAttack: 0, 
    totalDefense: 0, 
    damageMultiplier: 1, 
    survivalRating: 0, 
    cultivationSpeed: 0, 
    breakthroughChance: 0 
  };

  // 计算修炼进度百分比（0-100%）
  const cultivationProgress = baseAttrs.cultivation && baseAttrs.expToNextLevel ? 
    Math.min(100, Math.max(0, (baseAttrs.cultivation / baseAttrs.expToNextLevel) * 100)) : 0;

  return (
    <div className={styles.characterPanel}>
      <div className={styles.header}>
        <h2>人物属性</h2>
        <span className={styles.infoIcon}>ⓘ</span>
      </div>

      <div className={styles.characterInfo}>
        <div className={styles.avatar}>
          {/* 实际项目中替换为真实头像 */}
          <div className={styles.avatarPlaceholder}>{baseAttrs.name.charAt(0)}</div>
        </div>
        <div className={styles.basicInfo}>
          <h3>{baseAttrs.name}</h3>
          <div className={styles.levelInfo}>{baseAttrs.cultivationStage} (等级: {baseAttrs.level})</div>
          <div className={styles.titleInfo}>
            头衔: {title?.name || '无'}
          </div>
          <div className={styles.reputationInfo}>
            声望: {reputation}/{title?.requirements.reputation || '---'}
          </div>
          <div className={styles.cultivationInfo}>
            修炼: {baseAttrs.cultivation.toLocaleString()}/{baseAttrs.expToNextLevel.toLocaleString()} ({cultivationProgress.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className={styles.attributesGrid}>
        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>修炼体系</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>灵魂强度</span>
              <span className={styles.attributeValue}>{baseAttrs.soulStrength}/1000</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>体质</span>
              <span className={styles.attributeValue}>{baseAttrs.physique}/1000</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>生命力</span>
              <span className={styles.attributeValue}>{baseAttrs.vitality.toLocaleString()}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>修炼速度</span>
              <span className={styles.attributeValue}>+{derivedAttrs.cultivationSpeed || 0}%/h</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>突破成功率</span>
              <span className={styles.attributeValue}>{derivedAttrs.breakthroughChance || 0}%</span>
            </div>
          </div>
        </div>

        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>五行亲和</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>金</span>
              <span className={styles.attributeValue}>{baseAttrs.affinity.metal}/100</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>木</span>
              <span className={styles.attributeValue}>{baseAttrs.affinity.wood}/100</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>水</span>
              <span className={styles.attributeValue}>{baseAttrs.affinity.water}/100</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>火</span>
              <span className={styles.attributeValue}>{baseAttrs.affinity.fire}/100</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>土</span>
              <span className={styles.attributeValue}>{baseAttrs.affinity.earth}/100</span>
            </div>
          </div>
        </div>

        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>核心战斗属性</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>生命值</span>
              <span className={styles.attributeValue}>{baseAttrs.health}/{baseAttrs.maxHealth}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>法力值</span>
              <span className={styles.attributeValue}>{baseAttrs.mana}/{baseAttrs.maxMana}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>精神力</span>
              <span className={styles.attributeValue}>{baseAttrs.spirit}/{baseAttrs.maxSpirit}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>攻击力</span>
              <span className={styles.attributeValue}>{baseAttrs.attack}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>防御力</span>
              <span className={styles.attributeValue}>{baseAttrs.defense}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>速度</span>
              <span className={styles.attributeValue}>{baseAttrs.speed}</span>
            </div>
          </div>
        </div>

        <div className={styles.attributeSection}>
          <h4 className={styles.sectionTitle}>战斗属性</h4>
          <div className={styles.attributesList}>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>总攻击力</span>
              <span className={styles.attributeValue}>{derivedAttrs.totalAttack}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>总防御力</span>
              <span className={styles.attributeValue}>{derivedAttrs.totalDefense}</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>暴击率</span>
              <span className={styles.attributeValue}>{baseAttrs.critRate}%</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>闪避率</span>
              <span className={styles.attributeValue}>{baseAttrs.dodgeRate}%</span>
            </div>
            <div className={styles.attributeItem}>
              <span className={styles.attributeName}>伤害倍率</span>
              <span className={styles.attributeValue}>{derivedAttrs.damageMultiplier}x</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.resourcesSection}>
        <h4 className={styles.sectionTitle}>货币</h4>
        <div className={styles.resourcesGrid}>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>💰</span>
            <span className={styles.resourceName}>金币</span>
            <span className={styles.resourceValue}>{currency.gold}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>💎</span>
            <span className={styles.resourceName}>灵石</span>
            <span className={styles.resourceValue}>{currency.gems}</span>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>🎁</span>
            <span className={styles.resourceName}>贡献</span>
            <span className={styles.resourceValue}>{currency.contribution}</span>
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.actionButton} onClick={() => console.log('修炼功能待实现')}>修炼</button>
        <button className={styles.actionButton} onClick={() => console.log('突破功能待实现')}>突破</button>
        <button className={styles.actionButton}>属性加点</button>
        <button className={styles.actionButton}>装备</button>
        <button className={styles.actionButton}>技能</button>
        <button className={styles.actionButton}>头衔</button>
      </div>

      {/* 修炼进度组件 */}
      <CultivationProgress character={character} />

      {/* 修炼日志组件 */}
      <CultivationLogComponent maxHeight="300px" showFilters={true} />
    </div>
  );
};

export default CharacterPanel;