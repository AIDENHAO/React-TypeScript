import React from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { useCultivation } from '../hooks/useCultivation';
import './CharacterPanelCompact.css';

const CharacterPanelCompact: React.FC = () => {
  const { state, attemptBreakthrough } = useCharacter();
  const { character } = state;
  const { startCultivation, stopCultivation, isCultivating, cultivationProgress, breakthroughReady } = useCultivation();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getAffinityBar = (value: number) => {
    const filled = Math.round((value / 100) * 5);
    return '█'.repeat(filled) + '░'.repeat(5 - filled);
  };

  return (
    <div className="character-panel">
      {/* 头部信息 */}
      <div className="info-header">
        <div className="character-info">
          <span className="avatar">🗡️</span>
          <span className="name">{character.name}</span>
          <span className="realm">{character.realm}</span>
          <span className="title">{character.titles.join(' · ')}</span>
        </div>
        <div className="actions">
          <button 
            className="action-btn cultivate"
            onClick={() => isCultivating ? stopCultivation() : startCultivation()}
            disabled={false}
          >
            {isCultivating ? '停止修炼' : '开始修炼'}
          </button>
          <button 
            className="action-btn breakthrough"
            onClick={() => attemptBreakthrough()}
            disabled={!breakthroughReady}
          >
            突破
          </button>
        </div>
      </div>

      {/* 修炼体系 */}
      <div className="cultivation-section">
        <h3>修炼体系</h3>
        <div className="stat-grid">
          <div className="stat">
            <label>修炼进度</label>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${cultivationProgress}%` }}
              />
            </div>
            <span>{formatNumber(character.cultivationValue)}/{formatNumber(character.maxCultivationValue)}</span>
          </div>
          <div className="stat">
            <label>灵魂强度</label>
            <span>{character.soulStrength}/1000</span>
          </div>
          <div className="stat">
            <label>体质</label>
            <span>{character.constitution}/1000</span>
          </div>
          <div className="stat">
            <label>修炼速度</label>
            <span>+{character.cultivationSpeed}%/h</span>
          </div>
          <div className="stat">
            <label>突破几率</label>
            <span>{Math.round(character.breakthroughChance * 100)}%</span>
          </div>
          <div className="stat">
            <label>生命力</label>
            <span>{formatNumber(character.vitality)}</span>
          </div>
        </div>
      </div>

      {/* 五行亲和 */}
      <div className="affinity-section">
        <h3>五行亲和</h3>
        <div className="affinity-grid">
          {Object.entries(character.elementalAffinity).map(([element, value]) => (
            <div key={element} className="affinity">
              <label>{element}</label>
              <div className="affinity-bar">
                <span className="bar">{getAffinityBar(value)}</span>
                <span className="value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 战斗属性 */}
      <div className="combat-section">
        <h3>战斗属性</h3>
        <div className="stat-grid">
          <div className="stat">
            <label>生命</label>
            <span>{formatNumber(character.currentHP)}/{formatNumber(character.maxHP)}</span>
          </div>
          <div className="stat">
            <label>灵力</label>
            <span>{formatNumber(character.currentMP)}/{formatNumber(character.maxMP)}</span>
          </div>
          <div className="stat">
            <label>精神</label>
            <span>{formatNumber(character.currentSP)}/{formatNumber(character.maxSP)}</span>
          </div>
          <div className="stat">
            <label>攻击</label>
            <span>{character.attack}</span>
          </div>
          <div className="stat">
            <label>防御</label>
            <span>{character.defense}</span>
          </div>
          <div className="stat">
            <label>暴击</label>
            <span>{Math.round(character.critRate * 100)}%</span>
          </div>
        </div>
      </div>

      {/* 资源概览 */}
      <div className="resources-section">
        <h3>资源概览</h3>
        <div className="resource-grid">
          <div className="resource">
            <label>铜币</label>
            <span>{formatNumber(character.currencies.copper)}</span>
          </div>
          <div className="resource">
            <label>银币</label>
            <span>{formatNumber(character.currencies.silver)}</span>
          </div>
          <div className="resource">
            <label>灵石</label>
            <span>{formatNumber(character.currencies.spiritStones)}</span>
          </div>
          <div className="resource">
            <label>宗门贡献</label>
            <span>{formatNumber(character.sectContribution)}</span>
          </div>
          <div className="resource">
            <label>世界声望</label>
            <span>{formatNumber(character.worldReputation)}</span>
          </div>
        </div>
      </div>

      {/* 势力归属 */}
      <div className="territory-footer">
        <div className="territory-info">
          <span>地域: {character.territory.region}</span>
          <span>国家: {character.territory.country}</span>
          <span>宗门: {character.territory.sect}</span>
        </div>
        <div className="quick-actions">
          <button className="mini-btn">功法</button>
          <button className="mini-btn">装备</button>
          <button className="mini-btn">宗门</button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPanelCompact;