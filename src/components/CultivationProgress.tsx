import React from 'react';
import { Character } from '../types/Character';
import { CultivationService } from '../services/CultivationService';
import './CultivationProgress.css';

interface CultivationProgressProps {
  character: Character;
}

export const CultivationProgress: React.FC<CultivationProgressProps> = ({ character }) => {
  const currentStage = CultivationService.getCurrentStage(character.baseAttrs.cultivation);
  const nextStage = currentStage ? CultivationService.getNextStage(currentStage) : null;
  
  if (!currentStage) {
    return (
      <div className="cultivation-progress error">
        <p>无法确定当前境界</p>
      </div>
    );
  }

  const progressPercentage = currentStage.maxCultivation > 0 
    ? ((character.baseAttrs.cultivation - currentStage.minCultivation) / 
       (currentStage.maxCultivation - currentStage.minCultivation)) * 100
    : 0;

  const canBreakthrough = CultivationService.checkBreakthroughRequirements(character).canBreakthrough;
  const breakthroughChance = CultivationService.calculateBreakthroughChance(character);
  const cultivationSpeed = CultivationService.calculateCultivationSpeed(character);

  return (
    <div className="cultivation-progress">
      <div className="stage-info">
        <h3 className="current-stage">{currentStage.name}</h3>
        <div className="stage-description">{currentStage.description}</div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">修炼进度</span>
          <span className="progress-value">
            {character.baseAttrs.cultivation} / {currentStage.maxCultivation}
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="progress-percentage">{progressPercentage.toFixed(1)}%</div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">修炼速度</span>
          <span className="stat-value">{cultivationSpeed.toFixed(1)}%</span>
        </div>
        
        {nextStage && (
          <div className="stat-item">
            <span className="stat-label">下一境界</span>
            <span className="stat-value">{nextStage.name}</span>
          </div>
        )}
        
        <div className="stat-item">
          <span className="stat-label">突破成功率</span>
          <span className={`stat-value ${canBreakthrough ? 'can-breakthrough' : 'cannot-breakthrough'}`}>
            {canBreakthrough ? `${breakthroughChance.toFixed(1)}%` : '条件不足'}
          </span>
        </div>
      </div>

      {progressPercentage >= 100 && (
        <div className="breakthrough-ready">
          <div className="breakthrough-icon">⚡</div>
          <div className="breakthrough-text">
            {canBreakthrough ? '可以尝试突破！' : '修炼值已满，但突破条件不足'}
          </div>
        </div>
      )}
    </div>
  );
};

export default CultivationProgress;