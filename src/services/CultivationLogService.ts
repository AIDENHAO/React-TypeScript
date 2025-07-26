import { CultivationLog, CultivationLogConfig, CultivationLogFilter } from '../types/CultivationLog';
import { BaseDataService } from './BaseDataService';

/**
 * 修炼日志服务类 - 管理修炼日志的增删改查
 */
export class CultivationLogService extends BaseDataService<CultivationLog> {
  private static instance: CultivationLogService;
  private config: CultivationLogConfig = {
    maxLogCount: 1000,
    autoSave: true,
    storageKey: 'cultivation_logs'
  };

  protected storageKey = 'cultivation_logs';
  
  /**
   * 获取单例实例
   */
  public static getInstance(): CultivationLogService {
    if (!CultivationLogService.instance) {
      CultivationLogService.instance = new CultivationLogService();
    }
    return CultivationLogService.instance;
  }

  /**
   * 验证日志数据格式
   */
  protected validateData(log: CultivationLog): boolean {
    return !!(log?.id && log?.characterId && log?.type && log?.message);
  }
  
  /**
   * 获取默认日志数据
   */
  protected getDefaultData(): CultivationLog[] {
    return [];
  }
  
  /**
   * 初始化日志服务
   */
  public initialize(config?: Partial<CultivationLogConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
      this.storageKey = this.config.storageKey;
    }
  }

  /**
   * 添加修炼日志
   */
  public addLog(logData: Omit<CultivationLog, 'id' | 'timestamp'> | CultivationLog): void {
    const log: CultivationLog = 'id' in logData ? logData : {
      id: this.generateLogId(),
      timestamp: new Date(),
      ...logData
    };

    // 获取现有日志
    const logs = this.getAll();
    logs.unshift(log); // 新日志添加到开头

    // 限制日志数量
    if (logs.length > this.config.maxLogCount) {
      const trimmedLogs = logs.slice(0, this.config.maxLogCount);
      this.clear();
      trimmedLogs.forEach(l => this.save(l, (log) => log.id));
    } else {
      this.save(log, (log) => log.id);
    }
  }

  /**
   * 获取所有日志
   */
  public getAllLogs(): CultivationLog[] {
    return this.getAll().map(log => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }));
  }

  /**
   * 根据过滤条件获取日志
   */
  public getFilteredLogs(filter: CultivationLogFilter): CultivationLog[] {
    let filteredLogs = this.getAllLogs();

    // 按角色ID过滤
    if (filter.characterId) {
      filteredLogs = filteredLogs.filter(log => log.characterId === filter.characterId);
    }

    // 按类型过滤
    if (filter.type) {
      filteredLogs = filteredLogs.filter(log => log.type === filter.type);
    }

    // 按时间范围过滤
    if (filter.dateRange) {
      filteredLogs = filteredLogs.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
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
   * 获取指定角色的日志
   */
  public getLogs(characterId: string, limit?: number): CultivationLog[] {
    const logs = this.getFilteredLogs({ characterId });
    return limit ? logs.slice(0, limit) : logs;
  }
  
  /**
   * 获取最近的日志
   */
  public getRecentLogs(count: number = 10): CultivationLog[] {
    return this.getAllLogs().slice(0, count);
  }

  /**
   * 清空指定角色的日志
   */
  public clearLogs(characterId: string): void {
    const allLogs = this.getAll();
    const otherLogs = allLogs.filter(log => log.characterId !== characterId);
    this.clear();
    otherLogs.forEach(log => this.save(log, (l) => l.id));
  }
  
  /**
   * 清空所有日志
   */
  public clearAllLogs(): void {
    this.clear();
  }

  /**
   * 删除指定日志
   */
  public deleteLog(logId: string): boolean {
    return this.delete(logId, (log) => log.id);
  }

  /**
   * 获取指定角色的日志统计信息
   */
  public getLogStats(characterId: string): {
    total: number;
    cultivation: number;
    breakthrough: number;
    insight: number;
    today: number;
  } {
    const logs = this.getLogs(characterId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats = {
      total: logs.length,
      cultivation: 0,
      breakthrough: 0,
      insight: 0,
      today: 0
    };

    logs.forEach(log => {
      switch (log.type) {
        case 'cultivation':
          stats.cultivation++;
          break;
        case 'breakthrough':
          stats.breakthrough++;
          break;
        case 'insight':
          stats.insight++;
          break;
      }
      
      if (new Date(log.timestamp) >= today) {
        stats.today++;
      }
    });

    return stats;
  }



  /**
   * 生成日志ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 导出日志数据
   */
  public exportLogs(): string {
    return this.export();
  }

  /**
   * 导入日志数据
   */
  public importLogs(jsonData: string): boolean {
    return this.import(jsonData);
  }
}