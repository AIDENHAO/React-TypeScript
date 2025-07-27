import React from 'react';
import { Character } from '../types/Character';
import { CultivationService } from '../services/CultivationService';
import './CultivationProgress.css';

/**
 * 修炼进度组件的属性接口
 */
interface CultivationProgressProps {
  /** 角色数据对象 */
  character: Character;
}

/**
 * 修炼进度组件
 * 显示角色当前的修炼境界、进度条、修炼速度、突破成功率等信息
 * 当修炼值达到当前境界上限时，会显示突破提示
 * @param {CultivationProgressProps} props - 组件属性
 * @returns {JSX.Element} 修炼进度组件
 */
export const CultivationProgress: React.FC<CultivationProgressProps> = ({ character }) => {
  // 获取当前修炼境界
  const currentStage = CultivationService.getCurrentStage(character.baseAttrs.cultivation);
  // 获取下一个境界（如果存在）
  const nextStage = currentStage ? CultivationService.getNextStage(currentStage) : null;
  
  // 如果无法确定当前境界，显示错误信息
  if (!currentStage) {
    return (
      <div className="cultivation-progress error">
        <p>无法确定当前境界</p>
      </div>
    );
  }

  // 计算当前境界的修炼进度百分比
  const progressPercentage = currentStage.maxCultivation > 0 
    ? ((character.baseAttrs.cultivation - currentStage.minCultivation) / 
       (currentStage.maxCultivation - currentStage.minCultivation)) * 100
    : 0;

  // 检查是否满足突破条件
  const canBreakthrough = CultivationService.checkBreakthroughRequirements(character).canBreakthrough;
  // 计算突破成功率
  const breakthroughChance = CultivationService.calculateBreakthroughChance(character);
  // 计算修炼速度
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