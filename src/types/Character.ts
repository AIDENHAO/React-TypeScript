import { CharacterTitle } from './CharacterTitle';

export interface CharacterBaseAttributes {
  id: string;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  // 新增修炼相关属性
  cultivation: number;              // 修炼值
  cultivationStage: string;         // 修炼阶段(练气/筑基等)
  
  // 新增五行亲和度属性
  affinity: {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
  
  // 完善生命/法力相关属性
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  
  // 新增精神力属性
  spirit: number;
  maxSpirit: number;
  
  // 新增基础修炼属性
  soulStrength: number;             // 灵魂强度
  physique: number;                 // 体质
  vitality: number;                 // 生命力
  
  // 原有属性
  attack: number;
  defense: number;
  speed: number;
  critRate: number;
  dodgeRate: number;
}

export interface CharacterDerivedAttributes {
  totalAttack: number;
  totalDefense: number;
  damageMultiplier: number;
  survivalRating: number;
  // 新增修炼衍生属性
  cultivationSpeed: number;         // 修炼速度
  breakthroughChance: number;       // 突破成功率
}

export interface Character {
  baseAttrs: CharacterBaseAttributes;
  derivedAttrs: CharacterDerivedAttributes;
  title: CharacterTitle | null;
  reputation: number;
  currency: {
    gold: number;
    gems: number;
    contribution: number;
  };
  lastActive: Date;
}