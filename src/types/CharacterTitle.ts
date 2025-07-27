/**
 * 角色头衔基础接口
 * 定义头衔的基本信息、属性加成和获得条件
 */
export interface CharacterTitle {
  /** 头衔唯一标识符 */
  id: string;
  /** 头衔名称，如"剑道宗师"、"丹药大师" */
  name: string;
  /** 头衔描述，说明头衔的来源和意义 */
  description: string;
  /** 属性加成映射，键为属性名，值为加成数值 */
  attributeBonuses: {
    [key: string]: number;
  };
  /** 获得头衔的条件要求 */
  requirements: {
    /** 等级要求 */
    level: number;
    /** 声望要求 */
    reputation: number;
    /** 其他自定义条件，如完成特定任务、达成成就等 */
    [key: string]: any;
  };
}

/**
 * 头衔类别枚举
 * 定义头衔的不同来源和类型分类
 */
export enum TitleCategory {
  /** 宗门头衔，通过宗门活动和贡献获得 */
  SECT = '宗门',
  /** 世界头衔，通过世界级事件和成就获得 */
  WORLD = '世界',
  /** 成就头衔，通过完成特定成就获得 */
  ACHIEVEMENT = '成就',
  /** 特殊头衔，通过特殊途径或限时活动获得 */
  SPECIAL = '特殊'
}

/**
 * 头衔品质等级枚举
 * 定义头衔的稀有度和价值等级
 */
export enum TitleRank {
  /** 普通品质，容易获得的基础头衔 */
  COMMON = '普通',
  /** 稀有品质，需要一定条件才能获得 */
  RARE = '稀有',
  /** 史诗品质，难以获得的高级头衔 */
  EPIC = '史诗',
  /** 传说品质，极其稀有的顶级头衔 */
  LEGENDARY = '传说'
}

/**
 * 完整头衔信息接口
 * 继承基础头衔接口，添加分类、品质、状态和时间信息
 */
export interface FullCharacterTitle extends CharacterTitle {
  /** 头衔类别 */
  category: TitleCategory;
  /** 头衔品质等级 */
  rank: TitleRank;
  /** 是否为当前激活的头衔 */
  isActive: boolean;
  /** 获得头衔的时间 */
  obtainedAt: Date;
  /** 头衔过期时间，可选，某些限时头衔会有过期时间 */
  expiresAt?: Date;
}