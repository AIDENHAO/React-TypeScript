import { BaseDataService } from './BaseDataService';

/**
 * 宗门数据接口
 */
export interface Clan {
  id: string;
  name: string;
  description: string;
  level: number;
  members: number;
  maxMembers: number;
  resources: {
    spirit: number;
    gold: number;
    reputation: number;
  };
  buildings: {
    hall: number;
    library: number;
    treasury: number;
    training: number;
  };
  createdAt: Date;
  lastActive: Date;
}

/**
 * 宗门数据服务类
 */
export class ClanDataService extends BaseDataService<Clan> {
  private static instance: ClanDataService;
  
  protected storageKey = 'cultivation_game_clans';
  
  /**
   * 获取单例实例
   */
  public static getInstance(): ClanDataService {
    if (!ClanDataService.instance) {
      ClanDataService.instance = new ClanDataService();
    }
    return ClanDataService.instance;
  }
  
  /**
   * 验证宗门数据格式
   */
  protected validateData(clan: Clan): boolean {
    return !!(clan?.id && clan?.name);
  }
  
  /**
   * 获取默认宗门数据
   */
  protected getDefaultData(): Clan[] {
    return [
      {
        id: 'default-clan-1',
        name: '青云宗',
        description: '修仙界知名宗门，以剑道闻名',
        level: 1,
        members: 1,
        maxMembers: 10,
        resources: {
          spirit: 1000,
          gold: 500,
          reputation: 100
        },
        buildings: {
          hall: 1,
          library: 1,
          treasury: 1,
          training: 1
        },
        createdAt: new Date(),
        lastActive: new Date()
      }
    ];
  }
  
  /**
   * 保存宗门数据
   */
  public saveClan(clan: Clan): void {
    clan.lastActive = new Date();
    this.save(clan, (c) => c.id);
  }
  
  /**
   * 获取宗门数据
   */
  public getClan(id: string): Clan | null {
    const clan = this.findById(id, (c) => c.id);
    if (clan) {
      // 确保日期对象正确转换
      clan.createdAt = new Date(clan.createdAt);
      clan.lastActive = new Date(clan.lastActive);
    }
    return clan;
  }
  
  /**
   * 获取所有宗门
   */
  public getAllClans(): Clan[] {
    const clans = this.getAll();
    return clans.map(clan => ({
      ...clan,
      createdAt: new Date(clan.createdAt),
      lastActive: new Date(clan.lastActive)
    }));
  }
  
  /**
   * 删除宗门
   */
  public deleteClan(id: string): boolean {
    return this.delete(id, (c) => c.id);
  }
  
  /**
   * 创建新宗门
   */
  public createClan(name: string, description: string = ''): Clan {
    const newClan: Clan = {
      id: `clan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      level: 1,
      members: 1,
      maxMembers: 10,
      resources: {
        spirit: 1000,
        gold: 500,
        reputation: 100
      },
      buildings: {
        hall: 1,
        library: 1,
        treasury: 1,
        training: 1
      },
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    this.saveClan(newClan);
    return newClan;
  }
}