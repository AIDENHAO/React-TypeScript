import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Character } from '../types/Character';
import { CultivationService } from '../services/CultivationService';
import { DataService } from '../services/DataService';
import type { CultivationResult, BreakthroughResult } from '../services/CultivationService';

// 定义Action类型
type CharacterAction = 
  | { type: 'FETCH_CHARACTER_START' }
  | { type: 'FETCH_CHARACTER_SUCCESS'; payload: Character }
  | { type: 'FETCH_CHARACTER_ERROR'; payload: string }
  | { type: 'UPDATE_CHARACTER_ATTRIBUTES'; payload: Partial<Character['baseAttrs']> }
  | { type: 'UPDATE_CHARACTER_TITLE'; payload: Character['title'] }
  | { type: 'CULTIVATE_SUCCESS'; payload: CultivationResult }
  | { type: 'BREAKTHROUGH_SUCCESS'; payload: BreakthroughResult }
  | { type: 'BREAKTHROUGH_FAILURE'; payload: BreakthroughResult }
  | { type: 'SAVE_CHARACTER' };

// 定义Context类型
interface CharacterContextType {
  data: Character | null;
  loading: boolean;
  error: string | null;
  lastCultivationResult: CultivationResult | null;
  lastBreakthroughResult: BreakthroughResult | null;
  updateAttributes: (attrs: Partial<Character['baseAttrs']>) => void;
  updateTitle: (title: Character['title']) => void;
  cultivate: () => void;
  breakthrough: () => void;
  saveCharacter: () => void;
  switchCharacter: (id: string) => void;
  createNewCharacter: (characterData: Omit<Character, 'baseAttrs'> & { baseAttrs: Omit<Character['baseAttrs'], 'id'> }) => void;
}

// 初始状态定义与类型
interface CharacterState {
  data: Character | null;
  loading: boolean;
  error: string | null;
  lastCultivationResult: CultivationResult | null;
  lastBreakthroughResult: BreakthroughResult | null;
}

const initialState: CharacterState = {
  data: null,
  loading: false,
  error: null,
  lastCultivationResult: null,
  lastBreakthroughResult: null
};

// 创建Context
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// 计算衍生属性的辅助函数
function calculateDerivedAttributes(baseAttrs: Character['baseAttrs'], character?: Character): Character['derivedAttrs'] {
  // 创建一个临时的Character对象用于计算
  const tempCharacter: Character = character || {
    baseAttrs,
    derivedAttrs: {
      totalAttack: 0,
      totalDefense: 0,
      damageMultiplier: 0,
      survivalRating: 0,
      cultivationSpeed: 0,
      breakthroughChance: 0
    },
    title: null,
    reputation: 0,
    currency: { gold: 0, gems: 0, contribution: 0 },
    lastActive: new Date()
  };

  return {
    totalAttack: baseAttrs.attack + Math.floor(baseAttrs.attack * 0.2),
    totalDefense: baseAttrs.defense + Math.floor(baseAttrs.defense * 0.2),
    damageMultiplier: 1 + (baseAttrs.critRate / 100),
    survivalRating: Math.floor((baseAttrs.health + baseAttrs.defense) / 20),
    cultivationSpeed: CultivationService.calculateCultivationSpeed(tempCharacter),
    breakthroughChance: CultivationService.calculateBreakthroughChance(tempCharacter)
  };
}

// Reducer函数
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
      const updatedBaseAttrs = {
        ...state.data.baseAttrs,
        ...action.payload
      };
      const updatedCharacter = {
        ...state.data,
        baseAttrs: updatedBaseAttrs
      };
      return {
        ...state,
        data: {
          ...updatedCharacter,
          derivedAttrs: calculateDerivedAttributes(updatedBaseAttrs, updatedCharacter)
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
    case 'CULTIVATE_SUCCESS':
      if (!state.data) return state;
      const newCultivation = state.data.baseAttrs.cultivation + action.payload.cultivationGain;
      const updatedAttrsAfterCultivation = {
        ...state.data.baseAttrs,
        cultivation: newCultivation
      };
      const updatedCharacterAfterCultivation = {
        ...state.data,
        baseAttrs: updatedAttrsAfterCultivation
      };
      return {
        ...state,
        data: {
          ...updatedCharacterAfterCultivation,
          derivedAttrs: calculateDerivedAttributes(updatedAttrsAfterCultivation, updatedCharacterAfterCultivation)
        },
        lastCultivationResult: action.payload
      };
    case 'BREAKTHROUGH_SUCCESS':
      if (!state.data || !action.payload.newStage) return state;
      const breakthroughAttrs = {
        ...state.data.baseAttrs,
        cultivation: action.payload.newStage.minCultivation,
        cultivationStage: action.payload.newStage.name,
        level: action.payload.newStage.level
      };
      const updatedCharacterAfterBreakthrough = {
        ...state.data,
        baseAttrs: breakthroughAttrs
      };
      return {
        ...state,
        data: {
          ...updatedCharacterAfterBreakthrough,
          derivedAttrs: calculateDerivedAttributes(breakthroughAttrs, updatedCharacterAfterBreakthrough)
        },
        lastBreakthroughResult: action.payload
      };
    case 'BREAKTHROUGH_FAILURE':
      if (!state.data || !action.payload.penalties) return state;
      const penaltyAttrs = {
        ...state.data.baseAttrs,
        cultivation: Math.max(0, state.data.baseAttrs.cultivation - (action.payload.penalties.cultivationLoss || 0)),
        soulStrength: Math.max(0, state.data.baseAttrs.soulStrength - (action.payload.penalties.soulStrengthLoss || 0)),
        vitality: action.payload.penalties.vitalityLoss 
          ? Math.max(0, state.data.baseAttrs.vitality - action.payload.penalties.vitalityLoss)
          : state.data.baseAttrs.vitality
      };
      const updatedCharacterAfterFailure = {
        ...state.data,
        baseAttrs: penaltyAttrs
      };
      return {
        ...state,
        data: {
          ...updatedCharacterAfterFailure,
          derivedAttrs: calculateDerivedAttributes(penaltyAttrs, updatedCharacterAfterFailure)
        },
        lastBreakthroughResult: action.payload
      };
    case 'SAVE_CHARACTER':
      if (state.data) {
        DataService.saveCharacter(state.data);
      }
      return state;
    default:
      return state;
  }
}

// CharacterProvider组件
export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  // 初始化数据加载
  useEffect(() => {
    dispatch({ type: 'FETCH_CHARACTER_START' });
    
    // 尝试从本地存储加载当前角色
    const currentCharacterId = DataService.getCurrentCharacterId();
    if (currentCharacterId) {
      const character = DataService.loadCharacter(currentCharacterId);
      if (character) {
        dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: character });
        return;
      }
    }
    
    // 如果没有保存的角色，加载默认角色数据
    import('../data/characters.json').then(data => {
      const characters = data.default || data;
      if (characters.length > 0) {
        const defaultCharacter = characters[0];
        dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: defaultCharacter });
        DataService.saveCharacter(defaultCharacter);
        DataService.setCurrentCharacterId(defaultCharacter.baseAttrs.id);
      }
    }).catch(error => {
      dispatch({ type: 'FETCH_CHARACTER_ERROR', payload: '加载角色数据失败' });
    });
  }, []);

  // 更新角色属性
  const updateAttributes = useCallback((attributes: Partial<Character['baseAttrs']>) => {
    dispatch({ type: 'UPDATE_CHARACTER_ATTRIBUTES', payload: attributes });
    // 自动保存
    setTimeout(() => dispatch({ type: 'SAVE_CHARACTER' }), 100);
  }, []);

  // 更新角色头衔
  const updateTitle = useCallback((title: Character['title']) => {
    dispatch({ type: 'UPDATE_CHARACTER_TITLE', payload: title });
    setTimeout(() => dispatch({ type: 'SAVE_CHARACTER' }), 100);
  }, []);

  // 修炼功能
  const cultivate = useCallback(async () => {
    if (!state.data) return;
    
    try {
      const result = await CultivationService.cultivate(state.data);
      dispatch({ type: 'CULTIVATE_SUCCESS', payload: result });
      setTimeout(() => dispatch({ type: 'SAVE_CHARACTER' }), 100);
    } catch (error) {
      console.error('修炼失败:', error);
    }
  }, [state.data]);

  // 突破功能
  const breakthrough = useCallback(async () => {
    if (!state.data) return;
    
    try {
      const result = await CultivationService.attemptBreakthrough(state.data);
      
      if (result.success) {
        dispatch({ type: 'BREAKTHROUGH_SUCCESS', payload: result });
      } else {
        dispatch({ type: 'BREAKTHROUGH_FAILURE', payload: result });
      }
      
      setTimeout(() => dispatch({ type: 'SAVE_CHARACTER' }), 100);
    } catch (error) {
      console.error('突破失败:', error);
    }
  }, [state.data]);

  // 保存角色
  const saveCharacter = useCallback(() => {
    dispatch({ type: 'SAVE_CHARACTER' });
  }, []);

  // 切换角色
  const switchCharacter = useCallback((characterId: string) => {
    const character = DataService.loadCharacter(characterId);
    if (character) {
      dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: character });
      DataService.setCurrentCharacterId(characterId);
    }
  }, []);

  // 创建新角色
  const createNewCharacter = useCallback((characterData: Omit<Character, 'baseAttrs'> & { baseAttrs: Omit<Character['baseAttrs'], 'id'> }) => {
    const newCharacter: Character = {
      ...characterData,
      baseAttrs: {
        ...characterData.baseAttrs,
        id: Date.now().toString()
      }
    };
    
    DataService.saveCharacter(newCharacter);
    dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: newCharacter });
    DataService.setCurrentCharacterId(newCharacter.baseAttrs.id);
  }, []);

  const value: CharacterContextType = {
    ...state,
    updateAttributes,
    updateTitle,
    cultivate,
    breakthrough,
    saveCharacter,
    switchCharacter,
    createNewCharacter
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

// 自定义Hook
export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export default CharacterContext;
