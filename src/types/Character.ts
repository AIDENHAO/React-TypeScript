import { CharacterTitle } from './CharacterTitle';

/**
 * 角色基础属性接口
 * 定义角色的所有基础属性，包括基本信息、修炼相关、五行亲和度、生命法力、战斗属性等
 */
export interface CharacterBaseAttributes {
  /** 角色唯一标识符 */
  id: string;
  /** 角色姓名 */
  name: string;
  /** 角色等级 */
  level: number;
  /** 当前经验值 */
  exp: number;
  /** 升级所需经验值 */
  expToNextLevel: number;
  
  // 修炼相关属性
  /** 修炼值/修为点数，用于境界提升 */
  cultivation: number;
  /** 修炼境界名称，如"练气·初期"、"筑基·中期" */
  cultivationStage: string;
  
  // 五行亲和度属性
  /** 五行亲和度，影响对应属性功法的修炼效果 */
  affinity: {
    /** 金系亲和度 (0-100) */
    metal: number;
    /** 木系亲和度 (0-100) */
    wood: number;
    /** 水系亲和度 (0-100) */
    water: number;
    /** 火系亲和度 (0-100) */
    fire: number;
    /** 土系亲和度 (0-100) */
    earth: number;
  };
  
  // 生命/法力相关属性
  /** 当前生命值 */
  health: number;
  /** 最大生命值 */
  maxHealth: number;
  /** 当前法力值 */
  mana: number;
  /** 最大法力值 */
  maxMana: number;
  
  // 精神力属性
  /** 当前精神力，影响法术释放和意识强度 */
  spirit: number;
  /** 最大精神力 */
  maxSpirit: number;
  
  // 基础修炼属性
  /** 灵魂强度，影响突破成功率和抗性 */
  soulStrength: number;
  /** 体质，影响修炼速度和生命力 */
  physique: number;
  /** 生命力，影响生存能力和恢复速度 */
  vitality: number;
  
  // 战斗属性
  /** 基础攻击力 */
  attack: number;
  /** 基础防御力 */
  defense: number;
  /** 速度，影响行动顺序和闪避 */
  speed: number;
  /** 暴击率 (百分比) */
  critRate: number;
  /** 闪避率 (百分比) */
  dodgeRate: number;
}

/**
 * 角色衍生属性接口
 * 基于基础属性计算得出的衍生属性，用于战斗和修炼系统
 */
export interface CharacterDerivedAttributes {
  /** 总攻击力 (基础攻击力 + 装备加成 + 境界加成) */
  totalAttack: number;
  /** 总防御力 (基础防御力 + 装备加成 + 境界加成) */
  totalDefense: number;
  /** 伤害倍数，影响最终伤害输出 */
  damageMultiplier: number;
  /** 生存评级，综合生命、防御、闪避的生存能力指标 */
  survivalRating: number;
  
  // 修炼衍生属性
  /** 修炼速度加成 (百分比)，影响修炼值获取效率 */
  cultivationSpeed: number;
  /** 突破成功率 (百分比)，影响境界突破的成功概率 */
  breakthroughChance: number;
}

/**
 * 完整角色数据接口
 * 包含角色的所有信息：基础属性、衍生属性、头衔、声望、货币等
 */
export interface Character {
  /** 基础属性 */
  baseAttrs: CharacterBaseAttributes;
  /** 衍生属性 */
  derivedAttrs: CharacterDerivedAttributes;
  /** 当前头衔，可为空 */
  title: CharacterTitle | null;
  /** 声望值，影响NPC态度和任务解锁 */
  reputation: number;
  /** 货币系统 */
  currency: {
    /** 金币数量 */
    gold: number;
    /** 灵石数量，高级货币 */
    gems: number;
    /** 贡献点，用于宗门兑换 */
    contribution: number;
  };
  /** 最后活跃时间，用于离线收益计算 */
  lastActive: Date;
}