import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import clanData from '../../demo/demo.json';

// 为JSON导入添加类型定义
interface ClanDemoJson {
  baseAttrs: ClanBaseAttrs;
  battleAttrs: ClanBattleAttrs;
  specialAttrs: ClanSpecialAttrs;
  buildings: ClanBuilding[];
  resources: ClanResources;
  lastActive: string;
}

// 使用类型断言确保JSON数据类型安全
const clanDataTyped = clanData as unknown as ClanDemoJson;

// 定义宗门数据接口
interface ClanBaseAttrs {
  id: string;
  name: string;
  level: number;
  memberCount: number;
  territorySize: number;
  buildingCount: number;
  resourcePoints: number;
}

interface ClanBattleAttrs {
  clanDefense: number;
  warAttr: number;
  formationLevel: number;
  mountainProtection: number;
}

interface ClanSpecialAttrs {
  reputation: number;
  specialTitle: string | null;
  specialEffect: string | null;
}

interface ClanBuilding {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  status: 'normal' | 'upgrading' | 'damaged';
}

interface ClanResources {
  spiritStoneProduction: number;
  medicineProduction: number;
  oreProduction: number;
  woodProduction: number;
}

export interface ClanData {
  baseAttrs: ClanBaseAttrs;
  battleAttrs: ClanBattleAttrs;
  specialAttrs: ClanSpecialAttrs;
  buildings: ClanBuilding[];
  resources: ClanResources;
  lastActive: string;
}

export type { ClanBaseAttrs, ClanBattleAttrs, ClanSpecialAttrs, ClanBuilding, ClanResources };

// 定义Action类型
type ClanAction = 
  | { type: 'LOAD_CLAN_DATA'; payload: ClanData }
  | { type: 'UPDATE_BASE_ATTRS'; payload: Partial<ClanBaseAttrs> }
  | { type: 'UPDATE_BATTLE_ATTRS'; payload: Partial<ClanBattleAttrs> }
  | { type: 'UPDATE_SPECIAL_ATTRS'; payload: Partial<ClanSpecialAttrs> }
  | { type: 'UPDATE_BUILDING'; payload: { id: string; updates: Partial<ClanBuilding> } }
  | { type: 'UPDATE_RESOURCES'; payload: Partial<ClanResources> };

// 定义Context类型
interface ClanContextType {
  data: ClanData | null;
  loading: boolean;
  error: string | null;
  updateBaseAttrs: (attrs: Partial<ClanBaseAttrs>) => void;
  updateBattleAttrs: (attrs: Partial<ClanBattleAttrs>) => void;
  updateSpecialAttrs: (attrs: Partial<ClanSpecialAttrs>) => void;
  updateBuilding: (id: string, updates: Partial<ClanBuilding>) => void;
  updateResources: (resources: Partial<ClanResources>) => void;
}

// 初始状态
const initialState: Omit<ClanContextType, 'updateBaseAttrs' | 'updateBattleAttrs' | 'updateSpecialAttrs' | 'updateBuilding' | 'updateResources'> = {
  data: null,
  loading: true,
  error: null,
};

// 创建Context
const ClanContext = createContext<ClanContextType | undefined>(undefined);

// 确保Context类型安全的辅助函数
const useSafeContext = <T,>(context: React.Context<T | undefined>, name: string): T => {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(`use${name} must be used within a ${name}Provider`);
  }
  return value;
}

// Reducer函数
function clanReducer(state: Readonly<typeof initialState>, action: ClanAction): typeof initialState {
  switch (action.type) {
    case 'LOAD_CLAN_DATA':
      return {
        ...state,
        data: { ...action.payload },
        loading: false,
        error: null,
      };
    case 'UPDATE_BASE_ATTRS':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload,
          },
        },
      };
    case 'UPDATE_BATTLE_ATTRS':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          battleAttrs: {
            ...state.data.battleAttrs,
            ...action.payload,
          },
        },
      };
    case 'UPDATE_SPECIAL_ATTRS':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          specialAttrs: {
            ...state.data.specialAttrs,
            ...action.payload,
          },
        },
      };
    case 'UPDATE_BUILDING':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          buildings: state.data.buildings.map(building =>
            building.id === action.payload.id
              ? { ...building, ...action.payload.updates }
              : building
          ),
        },
      };
    case 'UPDATE_RESOURCES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          resources: {
            ...state.data.resources,
            ...action.payload,
          },
        },
      };
    default:
      return state;
  }
}

// Provider组件
export function ClanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(clanReducer, initialState);

  // 加载宗门数据
  useEffect(() => {
    const loadClanData = async () => {
      try {
        // 在实际项目中替换为API调用
        dispatch({ type: 'LOAD_CLAN_DATA', payload: clanDataTyped });
      } catch (err) {
        console.error('Failed to load clan data:', err);
        // 这里简化处理，实际项目中应该有更完善的错误处理
      }
    };

    loadClanData();
  }, []);

  // 定义更新函数
  const updateBaseAttrs = (attrs: Partial<ClanBaseAttrs>) => {
    dispatch({ type: 'UPDATE_BASE_ATTRS', payload: attrs });
  };

  const updateBattleAttrs = (attrs: Partial<ClanBattleAttrs>) => {
    dispatch({ type: 'UPDATE_BATTLE_ATTRS', payload: attrs });
  };

  const updateSpecialAttrs = (attrs: Partial<ClanSpecialAttrs>) => {
    dispatch({ type: 'UPDATE_SPECIAL_ATTRS', payload: attrs });
  };

  const updateBuilding = (id: string, updates: Partial<ClanBuilding>) => {
    dispatch({ type: 'UPDATE_BUILDING', payload: { id, updates } });
  };

  const updateResources = (resources: Partial<ClanResources>) => {
    dispatch({ type: 'UPDATE_RESOURCES', payload: resources });
  };

  const value: ClanContextType = {
    ...state,
    updateBaseAttrs,
    updateBattleAttrs,
    updateSpecialAttrs,
    updateBuilding,
    updateResources,
  };

  return <ClanContext.Provider value={value}>{children}</ClanContext.Provider>;
}

// 自定义Hook
export function useClan() {
  return useSafeContext(ClanContext, 'Clan');
}