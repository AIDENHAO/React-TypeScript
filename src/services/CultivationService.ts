import { Character, CharacterBaseAttributes } from '../types/Character';
import cultivationStagesData from '../data/cultivationStages.json';

/**
 * 修炼境界接口定义
 */
export interface CultivationStage {
  id: string;
  name: string;
  phase: 'mortal' | 'cultivator' | 'immortal';
  majorLevel: string;
  minorLevel: string;
  subLevel: string;
  level: number;
  minCultivation: number;
  maxCultivation: number;
  breakthroughRequirements: {
    soulStrength: number;
    items?: string[];
    tasks?: string[];
  };
  bonuses: {
    baseAttributes: number;
    skillPoints?: number;
  };
  description: string;
}

/**
 * 修炼结果接口
 */
export interface CultivationResult {
  success: boolean;
  cultivationGain: number;
  enlightenment: boolean;
  message: string;
  newStage?: string;
}

/**
 * 突破结果接口
 */
export interface BreakthroughResult {
  success: boolean;
  newStage?: CultivationStage;
  penalties?: {
    cultivationLoss?: number;
    soulStrengthLoss?: number;
    vitalityLoss?: number;
  };
  message: string;
}

/**
 * 修炼服务类 - 处理所有修炼相关的业务逻辑
 */
export class CultivationService {
  private static stages: CultivationStage[] = cultivationStagesData.stages;
  private static phaseDescriptions = cultivationStagesData.phaseDescriptions;
  private static failurePenalties = cultivationStagesData.breakthroughFailurePenalties;

  /**
   * 根据修炼值获取当前境界
   */
  static getCurrentStage(cultivation: number): CultivationStage | null {
    return this.stages.find(stage => 
      cultivation >= stage.minCultivation && cultivation <= stage.maxCultivation
    ) || null;
  }

  /**
   * 根据境界名称获取境界信息
   */
  static getStageByName(stageName: string): CultivationStage | null {
    return this.stages.find(stage => stage.name === stageName) || null;
  }

  /**
   * 获取下一个境界
   */
  static getNextStage(currentStage: CultivationStage): CultivationStage | null {
    const currentIndex = this.stages.findIndex(stage => stage.id === currentStage.id);
    return currentIndex >= 0 && currentIndex < this.stages.length - 1 
      ? this.stages[currentIndex + 1] 
      : null;
  }

  /**
   * 计算修炼速度
   */
  static calculateCultivationSpeed(character: Character): number {
    const baseSpeed = 100; // 基础修炼速度
    const physiqueBonus = Math.floor(character.baseAttrs.physique / 20) * 10; // 体质加成
    const affinityBonus = this.getHighestAffinity(character.baseAttrs.affinity) * 0.5; // 亲和度加成
    const titleBonus = character.title?.attributeBonuses?.cultivationSpeed || 0; // 头衔加成
    
    return baseSpeed + physiqueBonus + affinityBonus + titleBonus;
  }

  /**
   * 获取最高五行亲和度
   */
  private static getHighestAffinity(affinity: CharacterBaseAttributes['affinity']): number {
    return Math.max(affinity.metal, affinity.wood, affinity.water, affinity.fire, affinity.earth);
  }

  /**
   * 检查是否触发顿悟
   */
  static checkEnlightenment(character: Character): boolean {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) return false;

    const progress = (character.baseAttrs.cultivation - currentStage.minCultivation) / 
                    (currentStage.maxCultivation - currentStage.minCultivation);
    
    // 当修炼进度达到90%时，有10%概率触发顿悟
    if (progress >= 0.9 && Math.random() < 0.1) {
      return true;
    }
    return false;
  }

  /**
   * 执行修炼
   */
  static cultivate(character: Character): CultivationResult {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) {
      return {
        success: false,
        cultivationGain: 0,
        enlightenment: false,
        message: '无法确定当前境界，修炼失败'
      };
    }

    // 计算修炼增益
    const baseGain = 50; // 基础修炼增益
    const speedMultiplier = this.calculateCultivationSpeed(character) / 100;
    const enlightenment = this.checkEnlightenment(character);
    const enlightenmentMultiplier = enlightenment ? 1.5 : 1;
    
    const cultivationGain = Math.floor(baseGain * speedMultiplier * enlightenmentMultiplier);
    const newCultivation = Math.min(
      character.baseAttrs.cultivation + cultivationGain,
      currentStage.maxCultivation
    );

    let message = `修炼获得 ${cultivationGain} 点修炼值`;
    if (enlightenment) {
      message += '，触发顿悟！修炼效果提升50%';
    }

    return {
      success: true,
      cultivationGain: newCultivation - character.baseAttrs.cultivation,
      enlightenment,
      message
    };
  }

  /**
   * 计算突破成功率
   */
  static calculateBreakthroughChance(character: Character): number {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) return 0;

    const nextStage = this.getNextStage(currentStage);
    if (!nextStage) return 0;

    // 基础成功率
    let baseChance = 50;
    
    // 灵魂强度影响
    const soulStrengthRatio = character.baseAttrs.soulStrength / nextStage.breakthroughRequirements.soulStrength;
    const soulStrengthBonus = Math.min(50, (soulStrengthRatio - 1) * 100);
    
    // 修炼值影响（必须达到当前境界上限才能突破）
    if (character.baseAttrs.cultivation < currentStage.maxCultivation) {
      return 0;
    }
    
    // 体质影响
    const physiqueBonus = Math.floor(character.baseAttrs.physique / 100) * 5;
    
    const totalChance = Math.max(0, Math.min(95, baseChance + soulStrengthBonus + physiqueBonus));
    return totalChance;
  }

  /**
   * 检查突破条件
   */
  static checkBreakthroughRequirements(character: Character): { canBreakthrough: boolean; missingRequirements: string[] } {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) {
      return { canBreakthrough: false, missingRequirements: ['无法确定当前境界'] };
    }

    const nextStage = this.getNextStage(currentStage);
    if (!nextStage) {
      return { canBreakthrough: false, missingRequirements: ['已达到最高境界'] };
    }

    const missingRequirements: string[] = [];

    // 检查修炼值
    if (character.baseAttrs.cultivation < currentStage.maxCultivation) {
      missingRequirements.push(`修炼值不足，需要 ${currentStage.maxCultivation} 点`);
    }

    // 检查灵魂强度
    if (character.baseAttrs.soulStrength < nextStage.breakthroughRequirements.soulStrength) {
      missingRequirements.push(`灵魂强度不足，需要 ${nextStage.breakthroughRequirements.soulStrength} 点`);
    }

    // 检查物品需求（这里简化处理，实际项目中需要检查背包）
    if (nextStage.breakthroughRequirements.items && nextStage.breakthroughRequirements.items.length > 0) {
      missingRequirements.push(`需要物品：${nextStage.breakthroughRequirements.items.join('、')}`);
    }

    // 检查任务需求（这里简化处理，实际项目中需要检查任务完成状态）
    if (nextStage.breakthroughRequirements.tasks && nextStage.breakthroughRequirements.tasks.length > 0) {
      missingRequirements.push(`需要完成任务：${nextStage.breakthroughRequirements.tasks.join('、')}`);
    }

    return {
      canBreakthrough: missingRequirements.length === 0,
      missingRequirements
    };
  }

  /**
   * 尝试突破
   */
  static attemptBreakthrough(character: Character): BreakthroughResult {
    const { canBreakthrough, missingRequirements } = this.checkBreakthroughRequirements(character);
    
    if (!canBreakthrough) {
      return {
        success: false,
        message: `突破条件不满足：${missingRequirements.join('；')}`
      };
    }

    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation)!;
    const nextStage = this.getNextStage(currentStage)!;
    const successChance = this.calculateBreakthroughChance(character);
    const isSuccess = Math.random() * 100 < successChance;

    if (isSuccess) {
      return {
        success: true,
        newStage: nextStage,
        message: `突破成功！进入 ${nextStage.name} 境界！`
      };
    } else {
      // 突破失败，计算惩罚
      const penalties = this.calculateBreakthroughPenalties(currentStage);
      return {
        success: false,
        penalties,
        message: `突破失败！修炼值损失 ${penalties.cultivationLoss || 0}，灵魂强度损失 ${penalties.soulStrengthLoss || 0}`
      };
    }
  }

  /**
   * 计算突破失败惩罚
   */
  private static calculateBreakthroughPenalties(currentStage: CultivationStage): BreakthroughResult['penalties'] {
    const phasePenalty = this.failurePenalties[currentStage.phase];
    
    return {
      cultivationLoss: Math.floor(currentStage.maxCultivation * (1 - phasePenalty.cultivationLoss)),
      soulStrengthLoss: phasePenalty.soulStrengthLoss,
      vitalityLoss: phasePenalty.vitalityLoss ? Math.floor(currentStage.maxCultivation * phasePenalty.vitalityLoss) : undefined
    };
  }

  /**
   * 获取境界描述
   */
  static getStageDescription(stage: CultivationStage): string {
    const phaseDesc = this.phaseDescriptions[stage.phase];
    return `${stage.description}\n\n${phaseDesc.description}`;
  }

  /**
   * 获取所有境界列表
   */
  static getAllStages(): CultivationStage[] {
    return [...this.stages];
  }

  /**
   * 根据阶段获取境界列表
   */
  static getStagesByPhase(phase: 'mortal' | 'cultivator' | 'immortal'): CultivationStage[] {
    return this.stages.filter(stage => stage.phase === phase);
  }

  /**
   * 计算到达指定境界所需的修炼值
   */
  static calculateRequiredCultivation(targetStage: CultivationStage): number {
    return targetStage.minCultivation;
  }

  /**
   * 获取境界进度百分比
   */
  static getStageProgress(character: Character): number {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) return 0;

    const progress = (character.baseAttrs.cultivation - currentStage.minCultivation) / 
                    (currentStage.maxCultivation - currentStage.minCultivation);
    return Math.min(100, Math.max(0, progress * 100));
  }

  /**
   * 应用境界加成到角色属性
   */
  static applyStageBonus(character: Character): Partial<CharacterBaseAttributes> {
    const currentStage = this.getCurrentStage(character.baseAttrs.cultivation);
    if (!currentStage) return {};

    const bonusMultiplier = currentStage.bonuses.baseAttributes / 100;
    
    return {
      attack: Math.floor(character.baseAttrs.attack * (1 + bonusMultiplier)),
      defense: Math.floor(character.baseAttrs.defense * (1 + bonusMultiplier)),
      maxHealth: Math.floor(character.baseAttrs.maxHealth * (1 + bonusMultiplier)),
      maxMana: Math.floor(character.baseAttrs.maxMana * (1 + bonusMultiplier)),
      maxSpirit: Math.floor(character.baseAttrs.maxSpirit * (1 + bonusMultiplier))
    };
  }
}