import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ClanDataService, Clan } from '../services/ClanDataService';

/**
 * 宗门上下文接口定义
 */
interface ClanContextType {
  /** 当前选中的宗门 */
  currentClan: Clan | null;
  /** 所有宗门列表 */
  clans: Clan[];
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 选择宗门 */
  selectClan: (clanId: string) => void;
  /** 创建新宗门 */
  createClan: (name: string, description?: string) => Promise<Clan>;
  /** 更新宗门信息 */
  updateClan: (clan: Clan) => Promise<void>;
  /** 删除宗门 */
  deleteClan: (clanId: string) => Promise<void>;
  /** 刷新宗门数据 */
  refreshClan: () => Promise<void>;
}

/**
 * 宗门上下文
 */
const ClanContext = createContext<ClanContextType | undefined>(undefined);

/**
 * 宗门提供者组件属性
 */
interface ClanProviderProps {
  children: ReactNode;
}

/**
 * 宗门上下文提供者组件
 * 管理全局宗门状态和操作
 */
export const ClanProvider: React.FC<ClanProviderProps> = ({ children }) => {
  const [currentClan, setCurrentClan] = useState<Clan | null>(null);
  const [clans, setClans] = useState<Clan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clanService = ClanDataService.getInstance();
  const SELECTED_CLAN_KEY = 'cultivation_game_selected_clan';

  /**
   * 初始化宗门数据
   */
  useEffect(() => {
    loadClans();
  }, []);
  
  /**
   * 当宗门列表加载完成后，恢复选中的宗门
   */
  useEffect(() => {
    if (clans.length > 0 && !currentClan) {
      const savedSelectedClanId = localStorage.getItem(SELECTED_CLAN_KEY);
      if (savedSelectedClanId) {
        const savedClan = clans.find(c => c.id === savedSelectedClanId);
        if (savedClan) {
          setCurrentClan(savedClan);
        }
      }
    }
  }, [clans, currentClan]);

  /**
   * 加载所有宗门数据
   */
  const loadClans = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedClans = clanService.getAllClans();
      setClans(loadedClans);
    } catch (err) {
      setError('加载宗门数据失败');
      console.error('加载宗门数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理错误的辅助函数
   * @param error 错误对象
   * @param message 错误消息
   */
  const handleError = (error: any, message: string): void => {
    console.error(message, error);
    setError(message);
  };

  /**
   * 选择宗门
   * @param clanId 宗门ID
   */
  const selectClan = (clanId: string) => {
    try {
      const clan = clans.find(c => c.id === clanId);
      if (clan) {
        setCurrentClan(clan);
        localStorage.setItem(SELECTED_CLAN_KEY, clanId);
      }
    } catch (err) {
      handleError(err, '选择宗门失败');
    }
  };

  /**
   * 创建新宗门
   * @param name 宗门名称
   * @param description 宗门描述
   */
  const createClan = async (name: string, description: string = ''): Promise<Clan> => {
    try {
      setError(null);
      
      const newClan = clanService.createClan(name, description);
      const updatedClans = [...clans, newClan];
      setClans(updatedClans);
      setCurrentClan(newClan);
      
      return newClan;
    } catch (err) {
      handleError(err, '创建宗门失败');
      throw err;
    }
  };

  /**
   * 更新宗门信息
   * @param clan 更新后的宗门数据
   */
  const updateClan = async (clan: Clan): Promise<void> => {
    try {
      setError(null);
      
      clanService.saveClan(clan);
      
      const updatedClans = clans.map(c => c.id === clan.id ? clan : c);
      setClans(updatedClans);
      
      // 如果更新的是当前宗门，同步更新当前宗门状态
      if (currentClan && currentClan.id === clan.id) {
        setCurrentClan(clan);
      }
    } catch (err) {
      handleError(err, '更新宗门失败');
      throw err;
    }
  };

  /**
   * 删除宗门
   * @param clanId 宗门ID
   */
  const deleteClan = async (clanId: string): Promise<void> => {
    try {
      setError(null);
      
      const success = clanService.deleteClan(clanId);
      if (success) {
        const filteredClans = clans.filter(c => c.id !== clanId);
        setClans(filteredClans);
        
        // 如果删除的是当前宗门，清空当前宗门或选择其他宗门
        if (currentClan && currentClan.id === clanId) {
          setCurrentClan(filteredClans.length > 0 ? filteredClans[0] : null);
          localStorage.removeItem(SELECTED_CLAN_KEY);
        }
      } else {
        throw new Error('删除宗门失败');
      }
    } catch (err) {
      handleError(err, '删除宗门失败');
      throw err;
    }
  };

  /**
   * 刷新当前宗门数据
   */
  const refreshClan = async (): Promise<void> => {
    await loadClans();
  };

  const value: ClanContextType = {
    currentClan,
    clans,
    isLoading,
    error,
    selectClan,
    createClan,
    updateClan,
    deleteClan,
    refreshClan,
  };

  return (
    <ClanContext.Provider value={value}>
      {children}
    </ClanContext.Provider>
  );
};

/**
 * 使用宗门上下文的Hook
 * @returns 宗门上下文
 * @throws 如果在ClanProvider外部使用会抛出错误
 */
export const useClan = (): ClanContextType => {
  const context = useContext(ClanContext);
  if (context === undefined) {
    throw new Error('useClan must be used within a ClanProvider');
  }
  return context;
};

export default ClanContext;