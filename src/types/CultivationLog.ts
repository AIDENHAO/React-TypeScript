/**
 * 修炼日志相关类型定义
 */

/**
 * 修炼日志条目接口
 */
export interface CultivationLog {
  /** 日志唯一标识 */
  id: string;
  /** 角色ID */
  characterId: string;
  /** 时间戳 */
  timestamp: Date;
  /** 日志类型 */
  type: 'cultivation' | 'breakthrough' | 'insight' | 'stage_change';
  /** 日志消息 */
  message: string;
  /** 详细信息 */
  details?: {
    /** 修炼值增长 */
    cultivation?: number;
    /** 经验值增长 */
    experience?: number;
    /** 进度 */
    progress?: number;
    /** 属性变化 */
    attributes?: Record<string, number>;
    /** 境界变化 */
    stageChange?: {
      from: string;
      to: string;
    };
    /** 从境界 */
    fromRealm?: string;
    /** 到境界 */
    toRealm?: string;
    /** 成功标志 */
    success?: boolean;
  };
}

/**
 * 修炼日志管理器配置
 */
export interface CultivationLogConfig {
  /** 最大日志条数 */
  maxLogCount: number;
  /** 是否自动保存到本地存储 */
  autoSave: boolean;
  /** 本地存储键名 */
  storageKey: string;
}

/**
 * 修炼日志过滤器
 */
export interface CultivationLogFilter {
  /** 角色ID过滤 */
  characterId?: string;
  /** 日志类型过滤 */
  type?: CultivationLog['type'];
  /** 时间范围过滤 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** 关键词搜索 */
  keyword?: string;
}