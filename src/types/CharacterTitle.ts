// 角色头衔类型定义
export interface CharacterTitle {
  id: string;
  name: string;
  description: string;
  attributeBonuses: {
    [key: string]: number;
  };
  requirements: {
    level: number;
    reputation: number;
    [key: string]: any;
  };
}

// 头衔类别枚举
export enum TitleCategory {
  SECT = '宗门',           // 宗门头衔
  WORLD = '世界',         // 世界头衔
  ACHIEVEMENT = '成就', // 成就头衔
  SPECIAL = '特殊'      // 特殊头衔
}

// 头衔等级枚举
export enum TitleRank {
  COMMON = '普通',       // 普通
  RARE = '稀有',          // 稀有
  EPIC = '史诗',          // 史诗
  LEGENDARY = '传说'  // 传说
}

// 完整头衔信息接口
export interface FullCharacterTitle extends CharacterTitle {
  category: TitleCategory;
  rank: TitleRank;
  isActive: boolean;
  obtainedAt: Date;
  expiresAt?: Date;
}