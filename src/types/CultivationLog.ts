/**
 * 修炼日志相关类型定义
 */

/**
 * 修炼日志条目接口
 */
export interface CultivationLog {
  /** 日志唯一标识 */
  id: string;
  /** 时间戳 */
  timestamp: Date;
  /** 日志类型 */
  type: 'cultivate' | 'breakthrough_success' | 'breakthrough_failure' | 'enlightenment' | 'stage_change';
  /** 日志消息 */
  message: string;
  /** 修炼收益详情 */
  gains?: {
    /** 修炼值增长 */
    cultivation?: number;
    /** 属性变化 */
    attributes?: Record<string, number>;
    /** 境界变化 */
    stageChange?: {
      from: string;
      to: string;
    };
  };
  /** 损失详情（突破失败时） */
  losses?: {
    /** 修炼值损失 */
    cultivation?: number;
    /** 灵魂强度损失 */
    soulStrength?: number;
    /** 生命力损失 */
    vitality?: number;
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
  /** 日志类型过滤 */
  types?: CultivationLog['type'][];
  /** 时间范围过滤 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** 关键词搜索 */
  keyword?: string;
}