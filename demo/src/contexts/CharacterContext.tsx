import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 类型定义
export interface CharacterState {
  character: {
    name: string;
    realm: string;
    titles: string[];
    cultivationValue: number;
    maxCultivationValue: number;
    soulStrength: number;
    constitution: number;
    cultivationSpeed: number;
    breakthroughChance: number;
    vitality: number;
    currentHP: number;
    maxHP: number;
    currentMP: number;
    maxMP: number;
    currentSP: number;
    maxSP: number;
    attack: number;
    defense: number;
    critRate: number;
    elementalAffinity: {
      金: number;
      木: number;
      水: number;
      火: number;
      土: number;
    };
    currencies: {
      copper: number;
      silver: number;
      spiritStones: number;
    };
    sectContribution: number;
    worldReputation: number;
    territory: {
      region: string;
      country: string;
      sect: string;
    };
  };
  cultivationState: {
    isCultivating: boolean;
    cultivationSpeed: number;
    remainingTime: number;
    breakthroughReady: boolean;
  };
}

export type CharacterAction =
  | { type: 'START_CULTIVATION' }
  | { type: 'STOP_CULTIVATION' }
  | { type: 'COMPLETE_CULTIVATION'; payload: number }
  | { type: 'ATTEMPT_BREAKTHROUGH' }
  | { type: 'BREAKTHROUGH_SUCCESS'; payload: { newRealm: string; newMaxCultivation: number } }
  | { type: 'BREAKTHROUGH_FAILURE'; payload: { penalty: number } }
  | { type: 'UPDATE_CULTIVATION_PROGRESS'; payload: number };

interface CharacterContextType {
  state: CharacterState;
  startCultivation: () => void;
  stopCultivation: () => void;
  attemptBreakthrough: () => void;
}

// 初始状态
const initialState: CharacterState = {
  character: {
    name: '剑仙李白',
    realm: '筑基·中期',
    titles: ['天剑门·内门弟子', '新秀剑客'],
    cultivationValue: 8547,
    maxCultivationValue: 9761,
    soulStrength: 245,
    constitution: 180,
    cultivationSpeed: 15,
    breakthroughChance: 0.78,
    vitality: 18000,
    currentHP: 12450,
    maxHP: 12450,
    currentMP: 9680,
    maxMP: 9680,
    currentSP: 1425,
    maxSP: 1425,
    attack: 856,
    defense: 623,
    critRate: 0.125,
    elementalAffinity: {
      金: 75,
      木: 45,
      水: 60,
      火: 85,
      土: 30,
    },
    currencies: {
      copper: 125000,
      silver: 85000,
      spiritStones: 450,
    },
    sectContribution: 3200,
    worldReputation: 8500,
    territory: {
      region: '青岚山脉',
      country: '大夏王朝',
      sect: '天剑门',
    },
  },
  cultivationState: {
    isCultivating: false,
    cultivationSpeed: 15,
    remainingTime: 0,
    breakthroughReady: true,
  },
};

// Reducer
const characterReducer = (
  state: CharacterState,
  action: CharacterAction
): CharacterState => {
  switch (action.type) {
    case 'START_CULTIVATION':
      return {
        ...state,
        cultivationState: {
          ...state.cultivationState,
          isCultivating: true,
          remainingTime: 3600, // 1小时
        },
      };
    case 'STOP_CULTIVATION':
      return {
        ...state,
        cultivationState: {
          ...state.cultivationState,
          isCultivating: false,
          remainingTime: 0,
        },
      };
    case 'COMPLETE_CULTIVATION':
      return {
        ...state,
        character: {
          ...state.character,
          cultivationValue: Math.min(
            state.character.cultivationValue + action.payload,
            state.character.maxCultivationValue
          ),
        },
        cultivationState: {
          ...state.cultivationState,
          isCultivating: false,
          remainingTime: 0,
        },
      };
    case 'ATTEMPT_BREAKTHROUGH':
      return {
        ...state,
        cultivationState: {
          ...state.cultivationState,
          breakthroughReady: false,
        },
      };
    case 'BREAKTHROUGH_SUCCESS':
      return {
        ...state,
        character: {
          ...state.character,
          realm: action.payload.newRealm,
          maxCultivationValue: action.payload.newMaxCultivation,
          cultivationValue: 0,
        },
      };
    case 'BREAKTHROUGH_FAILURE':
      return {
        ...state,
        character: {
          ...state.character,
          cultivationValue: Math.max(
            state.character.cultivationValue - action.payload.penalty,
            0
          ),
        },
        cultivationState: {
          ...state.cultivationState,
          breakthroughReady: false,
        },
      };
    case 'UPDATE_CULTIVATION_PROGRESS':
      return {
        ...state,
        cultivationState: {
          ...state.cultivationState,
          remainingTime: action.payload,
        },
      };
    default:
      return state;
  }
};

// Context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// Provider
export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  const startCultivation = () => {
    dispatch({ type: 'START_CULTIVATION' });
  };

  const stopCultivation = () => {
    dispatch({ type: 'STOP_CULTIVATION' });
  };

  const attemptBreakthrough = () => {
    if (state.character.cultivationValue >= state.character.maxCultivationValue) {
      dispatch({ type: 'ATTEMPT_BREAKTHROUGH' });
      
      // 模拟突破结果
      setTimeout(() => {
        const success = Math.random() < state.character.breakthroughChance;
        if (success) {
          dispatch({
            type: 'BREAKTHROUGH_SUCCESS',
            payload: {
              newRealm: '筑基·后期',
              newMaxCultivation: 12000,
            },
          });
        } else {
          dispatch({
            type: 'BREAKTHROUGH_FAILURE',
            payload: { penalty: 500 },
          });
        }
      }, 1000);
    }
  };

  return (
    <CharacterContext.Provider value={{ state, startCultivation, stopCultivation, attemptBreakthrough }}>
      {children}
    </CharacterContext.Provider>
  );
};

// Hook
export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};