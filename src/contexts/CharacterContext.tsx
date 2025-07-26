import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Character } from '../types/Character';

// 定义Action类型
type CharacterAction = 
  | { type: 'FETCH_CHARACTER_START' }
  | { type: 'FETCH_CHARACTER_SUCCESS'; payload: Character }
  | { type: 'FETCH_CHARACTER_ERROR'; payload: string }
  | { type: 'UPDATE_CHARACTER_ATTRIBUTES'; payload: Partial<Character['baseAttrs']> }
  | { type: 'UPDATE_CHARACTER_TITLE'; payload: Character['title'] }
  | { type: 'CULTIVATE' }
  | { type: 'BREAKTHROUGH_ATTEMPT' }
  | { type: 'BREAKTHROUGH_SUCCESS' }
  | { type: 'BREAKTHROUGH_FAILURE' };

// 定义Context类型
interface CharacterContextType {
  data: Character | null;
  loading: boolean;
  error: string | null;
  updateAttributes: (attrs: Partial<Character['baseAttrs']>) => void;
  updateTitle: (title: Character['title']) => void;
  cultivate: () => void;
  breakthrough: () => void;
}

// 初始状态定义与类型
interface CharacterState {
  data: Character | null;
  loading: boolean;
  error: string | null;
}

const initialState: CharacterState = {
  data: null,
  loading: false,
  error: null
};

// 创建Context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// 确保Context类型安全的辅助函数
const useSafeContext = <T,>(context: React.Context<T | undefined>, name: string): T => {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(`use${name} must be used within a ${name}Provider`);
  }
  return value;
}

// Reducer函数 - 修复所有类型错误
function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_CHARACTER_ATTRIBUTES':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          },
          derivedAttrs: calculateDerivedAttributes({
            ...state.data.baseAttrs,
            ...action.payload
          })
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'INCREASE_CHARACTER_LEVEL':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          level: state.data.level + 1,
          cultivationStage: getNextCultivationStage(state.data.level + 1)
        }
      };
    case 'UPDATE_CHARACTER_REPUTATION':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          reputation: (state.data.reputation || 0) + action.payload
        }
      };
    default:
      return state;
  }
}
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    case 'FETCH_CHARACTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      case 'UPDATE_CHARACTER_ATTRIBUTES': {
      if (!state.data) return state;
      const updatedData = {
        ...state.data,
        baseAttrs: {
          ...state.data.baseAttrs,
          ...action.payload
        }
      };
      return { ...state, data: updatedData };
    }
    case 'UPDATE_CHARACTER_TITLE': {
      if (!state.data) return state;
      const updatedData = {
        ...state.data,
        title: action.payload
      };
      return { ...state, data: updatedData };
    }
    case 'CULTIVATE': {
      if (!state.data) return state;
      // 计算修炼增加值 (修炼速度 * 基础值)
      const cultivationGain = Math.floor(100 * (state.data.derivedAttrs.cultivationSpeed / 100 + 1));
      const updatedBaseAttrs = {
        ...state.data.baseAttrs,
        cultivation: Math.min(
          state.data.baseAttrs.cultivation + cultivationGain,
          state.data.baseAttrs.expToNextLevel
        )
      };
      const updatedData = {
        ...state.data,
        baseAttrs: updatedBaseAttrs
      };
      return { ...state, data: updatedData };
    }
    case 'BREAKTHROUGH_SUCCESS': {
      if (!state.data) return state;
      // 突破成功 - 升级并重置修炼值
      const updatedBaseAttrs = {
        ...state.data.baseAttrs,
        level: state.data.baseAttrs.level + 1,
        cultivationStage: getNextCultivationStage(state.data.baseAttrs.cultivationStage),
        cultivation: 0,
        expToNextLevel: Math.floor(state.data.baseAttrs.expToNextLevel * 1.5)
      };
      const updatedData = {
        ...state.data,
        baseAttrs: updatedBaseAttrs
      };
      return { ...state, data: updatedData };
    }
    case 'BREAKTHROUGH_FAILURE': {
      if (!state.data) return state;
      // 突破失败 - 损失部分修炼值
      const updatedBaseAttrs = {
        ...state.data.baseAttrs,
        cultivation: Math.floor(state.data.baseAttrs.cultivation * 0.7)
      };
      const updatedData = {
        ...state.data,
        baseAttrs: updatedBaseAttrs
      };
      return { ...state, data: updatedData };
    }
    default:
      return state;
  }
}

// Provider组件
export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  // 模拟数据加载
  useEffect(() => {
    dispatch({ type: 'FETCH_CHARACTER_START' });
    // 实际项目中这里会是API调用
    setTimeout(() => {
      // 从demo.json加载模拟数据
      const mockData: Character = {
        baseAttrs: {
          id: 'char_001',
          name: '剑仙李白',
          level: 15,
          exp: 1250,
          expToNextLevel: 2000,
          // 修炼体系核心属性
          cultivation: 8547,
          cultivationStage: '筑基·中期',
          // 五行属性体系
          affinity: {
            metal: 75,
            wood: 45,
            water: 60,
            fire: 85,
            earth: 30
          },
          // 核心战斗属性
          health: 1250,
          maxHealth: 1250,
          mana: 850,
          maxMana: 850,
          spirit: 350,
          maxSpirit: 350,
          // 基础属性
          soulStrength: 245,
          physique: 180,
          vitality: 18000,
          // 战斗属性
          attack: 185,
          defense: 105,
          speed: 92,
          critRate: 12.5,
          dodgeRate: 8.3
        },
        derivedAttrs: {
          totalAttack: 256,
          totalDefense: 142,
          damageMultiplier: 1.2,
          survivalRating: 78,
          cultivationSpeed: 15, // 修炼速度 +15%/h
          breakthroughChance: 75 // 突破成功率 75%
        },
        title: {
          id: 'title_003',
          name: '江湖小虾',
          description: '初入江湖的修行者',
          attributeBonuses: {
            attack: 10,
            defense: 5
          },
          requirements: {
            level: 10,
            reputation: 1000
          }
        },
        reputation: 1250,
        currency: {
          gold: 12500,
          gems: 850,
          contribution: 320
        },
        lastActive: new Date()
      };
      dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: mockData });
    }, 1000);
  }, []);

  // 定义更新函数
  const updateAttributes = (attrs: Partial<Character['baseAttrs']>) => {
    dispatch({ type: 'UPDATE_CHARACTER_ATTRIBUTES', payload: attrs });
  };

  const updateTitle = (title: Character['title']) => {
    dispatch({ type: 'UPDATE_CHARACTER_TITLE', payload: title });
  };

  // 添加修炼和突破方法
  const cultivate = () => {
    dispatch({ type: 'CULTIVATE' });
  };
  
  const breakthrough = () => {
    dispatch({ type: 'BREAKTHROUGH_ATTEMPT' });
  };
  
  return (
    <CharacterContext.Provider value={{ 
      ...state, 
      updateAttributes, 
      updateTitle,
      cultivate,  // 暴露修炼方法
      breakthrough  // 暴露突破方法
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

// 自定义Hook
export function useCharacter() {
  return useSafeContext(CharacterContext, 'Character');
}

// 辅助函数：获取下一个修炼阶段
const getNextCultivationStage = (currentStage: string): string => {
  const stages = ['练气·初期', '练气·中期', '练气·后期', '筑基·初期', '筑基·中期', '筑基·后期', '开光·初期'];
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex >= 0 && currentIndex < stages.length - 1 
    ? stages[currentIndex + 1] 
    : currentStage;
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            ...action.payload
          }
        }
      };
    case 'UPDATE_CHARACTER_TITLE':
      if (!state.data) return state;
      return {
        ...state,
        data: {
          ...state.data,
          title: action.payload
        }
      };
    case 'CULTIVATE':
      if (!state.data) return state;
      // 计算修炼增加值 (修炼速度 * 基础值)
      const cultivationGain = Math.floor(100 * (state.data.derivedAttrs.cultivationSpeed / 100 + 1));
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            cultivation: Math.min(
              state.data.baseAttrs.cultivation + cultivationGain,
              state.data.baseAttrs.expToNextLevel
            )
          }
        }
      };
      
    case 'BREAKTHROUGH_SUCCESS':
      if (!state.data) return state;
      // 突破成功 - 升级并重置修炼值
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            level: state.data.baseAttrs.level + 1,
            cultivationStage: getNextCultivationStage(state.data.baseAttrs.cultivationStage),
            cultivation: 0,
            expToNextLevel: Math.floor(state.data.baseAttrs.expToNextLevel * 1.5)
          }
        }
      };
      
    case 'BREAKTHROUGH_FAILURE':
      if (!state.data) return state;
      // 突破失败 - 损失部分修炼值
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            cultivation: Math.floor(state.data.baseAttrs.cultivation * 0.7)
          }
        }
      };
    default:
      return state;
  }
}
