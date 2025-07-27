/**
 * 宗门等级信息接口
 * 定义宗门的等级、经验和升级相关数据
 */
export interface ClanLevelInfo {
  /** 宗门当前等级 */
  level: number;
  /** 宗门当前经验值 */
  exp: number;
  /** 升级到下一等级所需经验值 */
  expToNextLevel: number;
}

/**
 * 宗门资源产出接口
 * 定义宗门各种资源的产出效率和加成
 */
export interface ClanResourceProduction {
  /** 灵石产出率 (每小时) */
  spiritStoneRate: number;
  /** 材料产出率 (每小时) */
  materialRate: number;
  /** 贡献点产出率 (每小时) */
  contributionRate: number;
  /** 经验加成百分比，影响成员修炼经验获取 */
  expBonus: number;
}

/**
 * 宗门防御系统接口
 * 定义宗门的防御能力和安全等级
 */
export interface ClanDefense {
  /** 阵法强度，影响整体防御力 */
  formationStrength: number;
  /** 建筑防御值，各建筑防御力总和 */
  buildingDefense: number;
  /** 反击能力，遭受攻击时的反击强度 */
  counterAttack: number;
  /** 警戒等级 (1-5)，影响对威胁的感知和响应 */
  alertLevel: number;
}

/**
 * 宗门建筑接口
 * 定义宗门内各种建筑的属性和状态
 */
export interface Building {
  /** 建筑唯一标识符 */
  id: string;
  /** 建筑类型，如"炼丹房"、"藏书阁"、"演武场" */
  type: string;
  /** 建筑名称 */
  name: string;
  /** 建筑等级，影响功能效果 */
  level: number;
  /** 建筑防御值，贡献给宗门总防御力 */
  defenseValue: number;
  /** 是否正常运作，损坏的建筑需要修复 */
  isFunctional: boolean;
  /** 最后维修时间，用于计算建筑损耗 */
  lastRepaired: Date;
}

/**
 * 宗门主接口
 * 定义完整的宗门信息，包括基本信息、成员、资源、领地、生产和防御等
 */
export interface Clan {
  /** 宗门唯一标识符 */
  id: string;
  /** 宗门名称 */
  name: string;
  /** 宗门等级信息 */
  levelInfo: ClanLevelInfo;
  /** 当前成员数量 */
  memberCount: number;
  /** 最大成员容量 */
  maxMembers: number;
  /** 活跃成员数量 (最近7天内登录) */
  activeMembers: number;
  /** 资源存储 */
  resourceStorage: {
    /** 灵石储量 */
    spiritStones: number;
    /** 各种材料储量，键为材料名称，值为数量 */
    materials: Record<string, number>;
  };
  /** 领地面积 (平方公里) */
  territoryArea: number;
  /** 资源产出配置 */
  production: ClanResourceProduction;
  /** 防御系统配置 */
  defense: ClanDefense;
  /** 宗门建筑列表 */
  buildings: Building[];
}