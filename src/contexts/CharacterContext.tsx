import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Character } from '../types/Character';
import { DataService } from '../services/DataService';

/**
 * 角色上下文接口定义
 */
interface CharacterContextType {
  /** 当前选中的角色 */
  currentCharacter: Character | null;
  /** 所有角色列表 */
  characters: Character[];
  /** 选择角色 */
  selectCharacter: (characterId: string) => void;
  /** 创建新角色 */
  createCharacter: (character: Character) => void;
  /** 更新角色信息 */
  updateCharacter: (character: Character) => void;
  /** 删除角色 */
  deleteCharacter: (characterId: string) => void;
  /** 刷新角色数据 */
  refreshCharacter: () => void;
}

/**
 * 角色上下文
 */
const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

/**
 * 角色提供者组件属性
 */
interface CharacterProviderProps {
  children: ReactNode;
}

/**
 * 角色上下文提供者组件
 * 管理全局角色状态和操作
 */
export const CharacterProvider: React.FC<CharacterProviderProps> = ({ children }) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  /**
   * 初始化角色数据
   */
  useEffect(() => {
    loadCharacters();
  }, []);

  /**
   * 加载所有角色数据
   */
  const loadCharacters = async () => {
    try {
      const loadedCharacters = DataService.getAllCharacters();
      setCharacters(loadedCharacters);
      
      // 如果有角色且没有当前选中角色，选择第一个
      if (loadedCharacters.length > 0 && !currentCharacter) {
        setCurrentCharacter(loadedCharacters[0]);
      }
    } catch (error) {
      console.error('加载角色数据失败:', error);
    }
  };

  /**
   * 选择角色
   * @param characterId 角色ID
   */
  const selectCharacter = (characterId: string) => {
    const character = characters.find(c => c.baseAttrs.id === characterId);
    if (character) {
      setCurrentCharacter(character);
    }
  };

  /**
   * 创建新角色
   * @param character 角色数据
   */
  const createCharacter = async (character: Character) => {
    try {
      DataService.saveCharacter(character);
      setCharacters(prev => [...prev, character]);
      setCurrentCharacter(character);
    } catch (error) {
      console.error('创建角色失败:', error);
    }
  };

  /**
   * 更新角色信息
   * @param character 更新后的角色数据
   */
  const updateCharacter = async (character: Character) => {
    try {
      DataService.saveCharacter(character);
      setCharacters(prev => 
        prev.map(c => c.baseAttrs.id === character.baseAttrs.id ? character : c)
      );
      
      // 如果更新的是当前角色，同步更新当前角色状态
      if (currentCharacter && currentCharacter.baseAttrs.id === character.baseAttrs.id) {
        setCurrentCharacter(character);
      }
    } catch (error) {
      console.error('更新角色失败:', error);
    }
  };

  /**
   * 删除角色
   * @param characterId 角色ID
   */
  const deleteCharacter = async (characterId: string) => {
    try {
      DataService.deleteCharacter(characterId);
      setCharacters(prev => prev.filter(c => c.baseAttrs.id !== characterId));
      
      // 如果删除的是当前角色，清空当前角色或选择其他角色
      if (currentCharacter && currentCharacter.baseAttrs.id === characterId) {
        const remainingCharacters = characters.filter(c => c.baseAttrs.id !== characterId);
        setCurrentCharacter(remainingCharacters.length > 0 ? remainingCharacters[0] : null);
      }
    } catch (error) {
      console.error('删除角色失败:', error);
    }
  };

  /**
   * 刷新当前角色数据
   */
  const refreshCharacter = () => {
    if (currentCharacter) {
      loadCharacters();
    }
  };

  const value: CharacterContextType = {
    currentCharacter,
    characters,
    selectCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refreshCharacter,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

/**
 * 使用角色上下文的Hook
 * @returns 角色上下文
 * @throws 如果在CharacterProvider外部使用会抛出错误
 */
export const useCharacter = (): CharacterContextType => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export default CharacterContext;