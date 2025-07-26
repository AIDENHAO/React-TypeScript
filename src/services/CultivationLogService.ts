import { CultivationLog, CultivationLogConfig, CultivationLogFilter } from '../types/CultivationLog';

/**
 * 修炼日志服务类 - 管理修炼日志的增删改查
 */
export class CultivationLogService {
  private static config: CultivationLogConfig = {
    maxLogCount: 1000,
    autoSave: true,
    storageKey: 'cultivation_logs'
  };

  private static logs: CultivationLog[] = [];

  /**
   * 初始化日志服务
   */
  static initialize(config?: Partial<CultivationLogConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.loadLogs();
  }

  /**
   * 添加修炼日志
   */
  static addLog(logData: Omit<CultivationLog, 'id' | 'timestamp'>): void {
    const log: CultivationLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      ...logData
    };

    this.logs.unshift(log); // 新日志添加到开头

    // 限制日志数量
    if (this.logs.length > this.config.maxLogCount) {
      this.logs = this.logs.slice(0, this.config.maxLogCount);
    }

    if (this.config.autoSave) {
      this.saveLogs();
    }
  }

  /**
   * 获取所有日志
   */
  static getAllLogs(): CultivationLog[] {
    return [...this.logs];
  }

  /**
   * 根据过滤条件获取日志
   */
  static getFilteredLogs(filter: CultivationLogFilter): CultivationLog[] {
    let filteredLogs = [...this.logs];

    // 按类型过滤
    if (filter.types && filter.types.length > 0) {
      filteredLogs = filteredLogs.filter(log => filter.types!.includes(log.type));
    }

    // 按时间范围过滤
    if (filter.dateRange) {
      filteredLogs = filteredLogs.filter(log => {
        const logTime = log.timestamp.getTime();
        return logTime >= filter.dateRange!.start.getTime() && 
               logTime <= filter.dateRange!.end.getTime();
      });
    }

    // 按关键词搜索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(keyword)
      );
    }

    return filteredLogs;
  }

  /**
   * 获取最近的日志
   */
  static getRecentLogs(count: number = 10): CultivationLog[] {
    return this.logs.slice(0, count);
  }

  /**
   * 清空所有日志
   */
  static clearLogs(): void {
    this.logs = [];
    if (this.config.autoSave) {
      this.saveLogs();
    }
  }

  /**
   * 删除指定日志
   */
  static deleteLog(logId: string): boolean {
    const index = this.logs.findIndex(log => log.id === logId);
    if (index !== -1) {
      this.logs.splice(index, 1);
      if (this.config.autoSave) {
        this.saveLogs();
      }
      return true;
    }
    return false;
  }

  /**
   * 获取日志统计信息
   */
  static getLogStatistics(): {
    total: number;
    byType: Record<CultivationLog['type'], number>;
    today: number;
    thisWeek: number;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byType: Record<CultivationLog['type'], number> = {
      cultivate: 0,
      breakthrough_success: 0,
      breakthrough_failure: 0,
      enlightenment: 0,
      stage_change: 0
    };

    let todayCount = 0;
    let weekCount = 0;

    this.logs.forEach(log => {
      byType[log.type]++;
      
      if (log.timestamp >= today) {
        todayCount++;
      }
      if (log.timestamp >= weekAgo) {
        weekCount++;
      }
    });

    return {
      total: this.logs.length,
      byType,
      today: todayCount,
      thisWeek: weekCount
    };
  }

  /**
   * 保存日志到本地存储
   */
  private static saveLogs(): void {
    try {
      const logsData = this.logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString() // 序列化时间
      }));
      localStorage.setItem(this.config.storageKey, JSON.stringify(logsData));
    } catch (error) {
      console.error('保存修炼日志失败:', error);
    }
  }

  /**
   * 从本地存储加载日志
   */
  private static loadLogs(): void {
    try {
      const data = localStorage.getItem(this.config.storageKey);
      if (data) {
        const logsData = JSON.parse(data);
        this.logs = logsData.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp) // 反序列化时间
        }));
      }
    } catch (error) {
      console.error('加载修炼日志失败:', error);
      this.logs = [];
    }
  }

  /**
   * 生成日志ID
   */
  private static generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 导出日志数据
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导入日志数据
   */
  static importLogs(jsonData: string): boolean {
    try {
      const importedLogs = JSON.parse(jsonData);
      if (Array.isArray(importedLogs)) {
        this.logs = importedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        if (this.config.autoSave) {
          this.saveLogs();
        }
        return true;
      }
    } catch (error) {
      console.error('导入修炼日志失败:', error);
    }
    return false;
  }
}