import { Character } from '../types/Character';
import charactersData from '../data/characters.json';
import { BaseDataService } from './BaseDataService';

/**
 * 数据服务类 - 处理角色数据的持久化存储
 */
export class DataService extends BaseDataService<Character> {
  private static readonly SETTINGS_KEY = 'cultivation_game_settings';
  private static readonly CURRENT_CHARACTER_KEY = 'cultivation_game_current_character';
  private static instance: DataService;
  
  protected storageKey = 'cultivation_game_characters';
  
  /**
   * 获取单例实例
   */
  private static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  /**
   * 验证角色数据格式
   */
  protected validateData(character: Character): boolean {
    return !!(character?.baseAttrs?.id && character?.baseAttrs?.name);
  }
  
  /**
   * 获取默认角色数据
   */
  protected getDefaultData(): Character[] {
    return this.transformDefaultCharacters();
  }
  
  /**
   * 保存单个角色数据
   */
  static saveCharacter(character: Character): void {
    try {
      // 更新最后活跃时间
      character.lastActive = new Date();
      
      const instance = DataService.getInstance();
      instance.save(character, (char) => char.baseAttrs.id);
      console.log(`角色 ${character.baseAttrs.name} 数据已保存`);
    } catch (error) {
      console.error('保存角色数据失败:', error);
      throw new Error('保存角色数据失败');
    }
  }

  /**
   * 加载指定ID的角色数据
   */
  static loadCharacter(id: string): Character | null {
    try {
      const instance = DataService.getInstance();
      const character = instance.findById(id, (char) => char.baseAttrs.id);
      
      if (character) {
        // 确保日期对象正确转换
        character.lastActive = new Date(character.lastActive);
        console.log(`角色 ${character.baseAttrs.name} 数据已加载`);
      }
      
      return character;
    } catch (error) {
      console.error('加载角色数据失败:', error);
      return null;
    }
  }

  /**
   * 加载所有角色数据
   */
  static getAllCharacters(): Character[] {
    try {
      const instance = DataService.getInstance();
      const characters = instance.getAll();
      
      // 确保日期对象正确转换
      return characters.map(char => ({
        ...char,
        lastActive: new Date(char.lastActive)
      }));
    } catch (error) {
      console.error('加载角色数据失败:', error);
      return [];
    }
  }
  
  /**
   * 加载所有角色数据（别名方法，保持向后兼容）
   */
  static loadAllCharacters(): Character[] {
    return this.getAllCharacters();
  }

  /**
   * 转换默认角色数据
   */
  private transformDefaultCharacters(): Character[] {
    return charactersData.map(charData => ({
      baseAttrs: {
        id: charData.id,
        name: charData.name,
        level: charData.level,
        exp: charData.exp,
        expToNextLevel: charData.expToNextLevel,
        cultivation: charData.cultivation,
        cultivationStage: charData.cultivationStage,
        affinity: charData.affinity,
        health: charData.health,
        maxHealth: charData.maxHealth,
        mana: charData.mana,
        maxMana: charData.maxMana,
        spirit: charData.spirit,
        maxSpirit: charData.maxSpirit,
        soulStrength: charData.soulStrength,
        physique: charData.physique,
        vitality: charData.vitality,
        attack: charData.attack,
        defense: charData.defense,
        speed: charData.speed,
        critRate: charData.critRate,
        dodgeRate: charData.dodgeRate
      },
      derivedAttrs: {
        totalAttack: charData.attack + Math.floor(charData.attack * 0.2),
        totalDefense: charData.defense + Math.floor(charData.defense * 0.2),
        damageMultiplier: 1 + (charData.critRate / 100),
        survivalRating: Math.floor((charData.health + charData.defense) / 20),
        cultivationSpeed: charData.cultivationSpeed,
        breakthroughChance: charData.breakthroughChance
      },
      title: charData.title ? {
        id: `title_${charData.title.sect}`,
        name: charData.title.sect,
        description: `宗门头衔：${charData.title.sect}`,
        attributeBonuses: {
          attack: 10,
          defense: 5
        },
        requirements: {
          level: charData.level,
          reputation: charData.reputation
        }
      } : null,
      reputation: charData.reputation,
      currency: {
        gold: charData.currency.gold,
        gems: charData.currency.spiritStones.low,
        contribution: charData.currency.contribution
      },
      lastActive: new Date(charData.lastActive)
    }));
  }

  /**
   * 删除角色数据
   */
  static deleteCharacter(id: string): boolean {
    try {
      const instance = DataService.getInstance();
      const success = instance.delete(id, (char) => char.baseAttrs.id);
      
      if (success) {
        console.log(`角色 ${id} 已删除`);
      } else {
        console.warn(`未找到ID为 ${id} 的角色`);
      }
      
      return success;
    } catch (error) {
      console.error('删除角色数据失败:', error);
      return false;
    }
  }

  /**
   * 设置当前活跃角色
   */
  static setCurrentCharacter(id: string): void {
    try {
      localStorage.setItem(this.CURRENT_CHARACTER_KEY, id);
    } catch (error) {
      console.error('设置当前角色失败:', error);
    }
  }

  /**
   * 设置当前活跃角色ID（别名方法）
   */
  static setCurrentCharacterId(id: string): void {
    this.setCurrentCharacter(id);
  }

  /**
   * 获取当前活跃角色ID
   */
  static getCurrentCharacterId(): string | null {
    try {
      return localStorage.getItem(this.CURRENT_CHARACTER_KEY);
    } catch (error) {
      console.error('获取当前角色失败:', error);
      return null;
    }
  }

  /**
   * 获取当前活跃角色数据
   */
  static getCurrentCharacter(): Character | null {
    const currentId = this.getCurrentCharacterId();
    if (!currentId) {
      // 如果没有设置当前角色，返回第一个角色
      const allCharacters = this.getAllCharacters();
      if (allCharacters.length > 0) {
        this.setCurrentCharacter(allCharacters[0].baseAttrs.id);
        return allCharacters[0];
      }
      return null;
    }
    return this.loadCharacter(currentId);
  }

  /**
   * 创建新角色
   */
  static createCharacter(name: string, customAttributes?: Partial<Character['baseAttrs']>): Character {
    const newId = `char_${Date.now()}`;
    
    const defaultAttributes = {
      id: newId,
      name: name,
      level: 1,
      exp: 0,
      expToNextLevel: 1000,
      cultivation: 1,
      cultivationStage: '练气·初期',
      affinity: {
        metal: 50,
        wood: 50,
        water: 50,
        fire: 50,
        earth: 50
      },
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      spirit: 30,
      maxSpirit: 30,
      soulStrength: 50,
      physique: 50,
      vitality: 1000,
      attack: 10,
      defense: 8,
      speed: 10,
      critRate: 5,
      dodgeRate: 5
    };

    const newCharacter: Character = {
      baseAttrs: {
        ...defaultAttributes,
        ...customAttributes
      },
      derivedAttrs: {
        totalAttack: 12,
        totalDefense: 10,
        damageMultiplier: 1.05,
        survivalRating: 5,
        cultivationSpeed: 10,
        breakthroughChance: 60
      },
      title: null,
      reputation: 0,
      currency: {
        gold: 100,
        gems: 10,
        contribution: 0
      },
      lastActive: new Date()
    };

    this.saveCharacter(newCharacter);
    console.log(`新角色 ${name} 创建成功`);
    return newCharacter;
  }

  /**
   * 导出角色数据
   */
  static exportCharacterData(id: string): string | null {
    try {
      const character = this.loadCharacter(id);
      if (!character) {
        console.warn(`未找到ID为 ${id} 的角色`);
        return null;
      }
      
      return JSON.stringify(character, null, 2);
    } catch (error) {
      console.error('导出角色数据失败:', error);
      return null;
    }
  }

  /**
   * 导入角色数据
   */
  static importCharacterData(jsonData: string): boolean {
    try {
      const character = JSON.parse(jsonData) as Character;
      
      // 验证数据格式
      if (!character.baseAttrs || !character.baseAttrs.id || !character.baseAttrs.name) {
        throw new Error('无效的角色数据格式');
      }
      
      this.saveCharacter(character);
      console.log(`角色 ${character.baseAttrs.name} 导入成功`);
      return true;
    } catch (error) {
      console.error('导入角色数据失败:', error);
      return false;
    }
  }

  /**
   * 清空所有数据
   */
  static clearAllData(): void {
    try {
      const instance = DataService.getInstance();
      instance.clear();
      localStorage.removeItem(this.CURRENT_CHARACTER_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      console.log('所有游戏数据已清空');
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  }

  /**
   * 获取数据统计信息
   */
  static getDataStats(): {
    totalCharacters: number;
    totalStorageSize: number;
    lastSaveTime: Date | null;
  } {
    try {
      const instance = DataService.getInstance();
      const stats = instance.getStats();
      const characters = instance.getAll();
      const lastSaveTime = characters.length > 0 
        ? new Date(Math.max(...characters.map(c => new Date(c.lastActive).getTime())))
        : null;
      
      return {
        totalCharacters: stats.total,
        totalStorageSize: stats.storageSize,
        lastSaveTime
      };
    } catch (error) {
      console.error('获取数据统计失败:', error);
      return {
        totalCharacters: 0,
        totalStorageSize: 0,
        lastSaveTime: null
      };
    }
  }

  /**
   * 自动保存功能
   */
  static enableAutoSave(character: Character, intervalMs: number = 30000): number {
    return window.setInterval(() => {
      this.saveCharacter(character);
      console.log('自动保存完成');
    }, intervalMs);
  }

  /**
   * 停止自动保存
   */
  static disableAutoSave(intervalId: number): void {
    clearInterval(intervalId);
    console.log('自动保存已停止');
  }
}