# 阶段一：基础架构与核心属性实现规划

## 1. 概述
阶段一（1-2周）的核心目标是搭建项目基础架构并实现人物与宗门的核心属性系统，为后续功能模块提供数据基础和UI框架。

## 2. 数据类型设计

### 2.1 人物属性数据模型
```typescript
// src/types/Character.ts
interface CharacterBaseAttributes {
  id: string;               // 唯一标识符
  name: string;             // 角色名称
  
  // 修炼体系核心属性
  level: number;            // 等级境界(1-100，对应具体修炼阶段)
  cultivation: number;      // 修炼值(1-1000000000)
  cultivationStage: string; // 修炼阶段(练气/筑基/开光等)
  
  // 五行属性体系
  affinity: {              // 五行亲和度
    metal: number;          // 金系亲和度(0-100)
    wood: number;           // 木系亲和度(0-100)
    water: number;          // 水系亲和度(0-100)
    fire: number;           // 火系亲和度(0-100)
    earth: number;          // 土系亲和度(0-100)
  };
  
  // 核心战斗属性
  health: number;           // 当前血量
  maxHealth: number;       // 最大血量
  mana: number;             // 当前灵力
  maxMana: number;         // 最大灵力
  spirit: number;          // 当前精神力
  maxSpirit: number;       // 最大精神力
  
  // 基础属性
  soulStrength: number;    // 灵魂强度(1-1000，影响突破成功率)
  physique: number;        // 体质(1-1000，影响修炼速度)
  vitality: number;        // 生命力(1-100000，技能消耗基数)
  
  // 战斗属性
  attack: number;          // 攻击力
  defense: number;         // 防御力
  speed: number;           // 速度
  critRate: number;        // 暴击率(百分比)
  dodgeRate: number;       // 闪避率(百分比)
}

interface CharacterDerivedAttributes {
  totalAttack: number;      // 总攻击力(基础+装备+功法加成)
  totalDefense: number;     // 总防御力(基础+装备+功法加成)
  damageMultiplier: number; // 伤害倍率(受五行亲和度影响)
  survivalRating: number;   // 生存评分
  cultivationSpeed: number; // 修炼速度(受体质、心法、环境等影响)
  breakthroughChance: number; // 突破成功率(受灵魂强度影响)
}

interface CharacterTitle {
  id: string;
  name: string;
  description: string;
  type: 'clan' | 'world';   // 头衔类型：宗门/世界
  attributeBonuses: {
    cultivationSpeed?: number;
    breakthroughChance?: number;
    affinity?: Partial<CharacterBaseAttributes['affinity']>;
  };
  requirements: {
    level?: number;
    cultivation?: number;
    reputation?: number;
    clanContribution?: number;
  };
}

interface CharacterCurrency {
  // 基础货币
  copper: number;           // 铜币
  silver: number;          // 银币
  gold: number;            // 金币
  
  // 灵石系统
  lowSpiritStone: number;   // 下品灵石
  midSpiritStone: number;   // 中品灵石
  highSpiritStone: number;  // 上品灵石
  topSpiritStone: number;   // 极品灵石
  
  // 特殊货币
  clanContribution: number; // 宗门贡献点
  worldReputation: number;  // 世界声望币
}

interface CharacterReputation {
  fame: number;            // 名誉值(-10000-10000)
  factionReputation: {     // 各门派友好度
    [factionName: string]: number; // -1000-1000
  };
}

interface Character {
  baseAttrs: CharacterBaseAttributes;
  derivedAttrs: CharacterDerivedAttributes;
  titles: CharacterTitle[]; // 已获得的头衔列表
  activeTitle: CharacterTitle | null; // 当前激活的头衔
  reputation: CharacterReputation;
  currency: CharacterCurrency;
  territory: {              // 势力归属
    region: string;         // 地域
    country: string;        // 国家
    clan: string;          // 宗门
  };
  lastActive: Date;
  createdAt: Date;
}
```

### 2.2 宗门属性数据模型
```typescript
// src/types/Clan.ts
interface ClanLevelInfo {
  level: number;            // 宗门等级(1-10)
  exp: number;              // 当前经验
  expToNextLevel: number;   // 升级所需经验
}

interface ClanResourceProduction {
  spiritStoneRate: number;  // 灵石每小时产出
  materialRate: number;     // 材料产出效率(百分比)
  contributionRate: number; // 贡献获取速度(百分比)
  expBonus: number;         // 经验加成(百分比)
}

interface ClanDefense {
  formationStrength: number; // 护宗大阵强度
  buildingDefense: number;   // 建筑总防御值
  counterAttack: number;     // 自动反击伤害
  alertLevel: number;        // 警戒等级(百分比)
}

interface Clan {
  id: string;
  name: string;
  levelInfo: ClanLevelInfo;
  memberCount: number;      // 当前成员数
  maxMembers: number;       // 成员上限
  activeMembers: number;    // 活跃成员数
  resourceStorage: {
    spiritStones: number;
    materials: Record<string, number>;
  };
  territoryArea: number;    // 领地面积(㎡)
  production: ClanResourceProduction;
  defense: ClanDefense;
  buildings: Building[];     // 建筑列表
}

interface Building {
  id: string;
  type: string;             // 建筑类型(招新广场/资源仓库等)
  level: number;
  defenseValue: number;
  isFunctional: boolean;    // 是否正常运作
  lastRepaired: Date;
}
```

## 3. UI设计

### 3.1 核心界面布局
![UI布局示意图](https://i.imgur.com/xxxxxx.png) <!-- 实际项目中替换为真实图片链接 -->

#### 3.1.1 主界面结构
- **顶部导航栏**：显示玩家信息、货币、主要功能入口
- **左侧边栏**：系统菜单(人物/背包/宗门/任务等)
- **中央区域**：当前活动界面(默认显示人物属性面板)
- **右侧信息栏**：通知、快捷功能
- **底部状态栏**：在线状态、系统设置

### 3.2 关键界面设计

#### 3.2.1 人物属性面板（单屏完整版）
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [头像] 剑仙李白 │ 筑基·中期 │ 天剑门·内门弟子 │ ⓘ                         │
│ 修炼: 8,547/9,761 (87.6%) │ 突破准备中 │ [修炼] [突破] [功法] [装备]    │
├─────────────────────────────────────────────────────────────────────────┤
│ 修炼体系    │ 五行亲和      │ 战斗属性      │ 资源概览                    │
│ ┌─────────┐ │ 金:75 █████   │ 生命:12.4K/12.4K │ 铜币: 125K                │
│ │灵魂强度│ │ 木:45 ███░░   │ 灵力:9.7K/9.7K    │ 银币: 85K                 │
│ │ 245/1000│ │ 水:60 ████░   │ 精神:1.4K/1.4K    │ 灵石: 450                 │
│ │ 体质    │ │ 火:85 ██████  │ 攻击:856          │ 宗门贡献: 3.2K            │
│ │ 180/1000│ │ 土:30 ██░░░   │ 防御:623          │ 世界声望: 8.5K            │
│ │ 修炼速度│ │               │ 暴击:12.5%        │                           │
│ │ +15%/h  │ │               │ 闪避:8.3%         │                           │
│ │ 生命力  │ │               │ 速度:92           │                           │
│ │ 18.0K   │ │               │                   │                           │
│ └─────────┘ │               │                   │                           │
├─────────────────────────────────────────────────────────────────────────┤
│ 头衔: [天剑门·内门弟子] [新秀剑客] │ 地域:青岚山脉 │ 国家:大夏王朝 │ 宗门:天剑门 │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 紧凑网格布局（响应式设计）
```css
/* 单屏完整布局 - 4列网格 */
.character-panel {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 8px;
  max-height: 100vh;
  padding: 8px;
}

.info-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 12px;
  border-radius: 8px;
}

.cultivation-section {
  background: rgba(30, 30, 50, 0.8);
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
}

.affinity-section {
  background: rgba(40, 40, 60, 0.8);
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
}

.combat-section {
  background: rgba(50, 30, 30, 0.8);
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
}

.resources-section {
  background: rgba(30, 50, 30, 0.8);
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
}

.territory-footer {
  grid-column: 1 / -1;
  background: rgba(20, 20, 40, 0.9);
  border-radius: 6px;
  padding: 8px;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
}
```

#### 3.2.2 宗门信息面板
```
+------------------------------------------------+-
| 宗门信息                                        | ⓘ
+------------------------------------------------+-
| [宗门图标] 青云宗                   等级: 3     |
| 宗主: 剑仙李白                  成员: 85/100   |
| 领地: 3000㎡                    声望等级: 2     |
+------------------------------------------------+-
| ▼ 资源状态                     ▼ 产出效率       |
| 灵石: 12500/50000              灵石: 500/小时  |
| 木材: 8500/20000               材料: 120%      |
| 矿石: 5200/20000               贡献: 115%      |
| 药材: 3800/15000               经验: 25%       |
+------------------------------------------------+-
| ▼ 防御能力                     ▼ 建筑状态       |
| 大阵强度: 850                  护宗大阵: Lv.3   |
| 建筑防御: 1250                 资源仓库: Lv.4   |
| 警戒等级: 75%                  招新广场: Lv.2   |
| 反击伤害: 120                  修炼场: Lv.3     |
+------------------------------------------------+-
| [成员管理] [建筑升级] [科技研发] [宗门战争]      |
+------------------------------------------------+-
```

#### 3.2.3 技术实现要点
- **单屏完整布局**：4列网格设计，确保1080p分辨率下完整显示
- **响应式字体**：使用相对单位确保不同分辨率下的可读性
- **数据格式化**：智能K/M单位转换，保持数值简洁
- **紧凑设计**：8px间距+12px字体，最大化信息密度
- **性能优化**：React.memo + CSS Grid重排最小化

#### 3.2.4 使用示例
```typescript
// 在主应用中使用
import CharacterPanelCompact from './components/CharacterPanelCompact';

function App() {
  return (
    <div style={{ height: '100vh', background: '#000' }}>
      <CharacterPanelCompact />
    </div>
  );
}

// 确保父容器高度为100vh
```

#### 3.2.5 响应式断点
- **桌面端**：4列网格 (1080p+)
- **平板端**：2列网格 (768px-1200px)
- **移动端**：1列网格 (<768px)
- **高分辨率**：字体和间距放大 (2K/4K)

### 3.3 UI组件层次结构
```
App
├── Layout
│   ├── Header (导航栏)
│   ├── Sidebar (侧边菜单)
│   ├── MainContent
│   │   ├── CharacterPanel
│   │   │   ├── BaseInfoSection
│   │   │   ├── AttributesSection
│   │   │   ├── CurrencySection
│   │   │   └── ActionButtons
│   │   └── ClanPanel
│   │       ├── ClanInfoSection
│   │       ├── ResourcesSection
│   │       ├── DefenseSection
│   │       └── BuildingStatusSection
│   ├── RightSidebar (信息栏)
│   └── Footer (状态栏)
├── ContextProviders
│   ├── CharacterContext
│   ├── ClanContext
│   └── UIModeContext
└── CommonComponents
    ├── AttributeDisplay
    ├── ResourceIndicator
    ├── ProgressBar
    ├── TabControl
    └── Tooltip
```

## 4. 状态管理设计

### 4.1 全局状态结构
```typescript
// src/store/rootState.ts
interface RootState {
  character: {
    data: Character | null;
    loading: boolean;
    error: string | null;
    cultivationState: {
      isCultivating: boolean;
      cultivationSpeed: number;
      remainingTime: number;
      breakthroughReady: boolean;
    };
    lastUpdated: Date | null;
  };
  clan: {
    data: Clan | null;
    loading: boolean;
    error: string | null;
    members: ClanMember[];
  };
  ui: {
    activePanel: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: Notification[];
    sidebarCollapsed: boolean;
    cultivationMode: 'auto' | 'manual' | 'offline';
  };
}
```

### 4.2 主要Context设计
```typescript
// src/contexts/CharacterContext.tsx
import React, { createContext, useReducer, useContext } from 'react';
import { Character } from '../types/Character';

// 定义Action类型
type CharacterAction = 
  | { type: 'FETCH_CHARACTER_START' }
  | { type: 'FETCH_CHARACTER_SUCCESS'; payload: Character }
  | { type: 'FETCH_CHARACTER_ERROR'; payload: string }
  | { type: 'UPDATE_CHARACTER_ATTRIBUTES'; payload: Partial<Character['baseAttrs']> }
  | { type: 'UPDATE_CHARACTER_TITLE'; payload: CharacterTitle | null }
  | { type: 'START_CULTIVATION'; payload: { speed: number; duration: number } }
  | { type: 'STOP_CULTIVATION' }
  | { type: 'COMPLETE_CULTIVATION'; payload: { cultivationGained: number } }
  | { type: 'ATTEMPT_BREAKTHROUGH' }
  | { type: 'BREAKTHROUGH_SUCCESS'; payload: { newLevel: number; newStage: string } }
  | { type: 'BREAKTHROUGH_FAILURE'; payload: { penalty: number } };

// 初始状态
const initialState = {
  data: null,
  loading: false,
  error: null,
  cultivationState: {
    isCultivating: false,
    cultivationSpeed: 0,
    remainingTime: 0,
    breakthroughReady: false
  },
  lastUpdated: null
};

// Reducer函数
function characterReducer(state, action) {
  switch (action.type) {
    case 'FETCH_CHARACTER_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_CHARACTER_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        cultivationState: {
          ...state.cultivationState,
          breakthroughReady: checkBreakthroughReady(action.payload)
        },
        lastUpdated: new Date()
      };
    case 'FETCH_CHARACTER_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'START_CULTIVATION':
      return {
        ...state,
        cultivationState: {
          isCultivating: true,
          cultivationSpeed: action.payload.speed,
          remainingTime: action.payload.duration,
          breakthroughReady: false
        }
      };
    case 'STOP_CULTIVATION':
      return {
        ...state,
        cultivationState: {
          ...state.cultivationState,
          isCultivating: false,
          cultivationSpeed: 0,
          remainingTime: 0
        }
      };
    case 'COMPLETE_CULTIVATION':
      const newCultivation = state.data.baseAttrs.cultivation + action.payload.cultivationGained;
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            cultivation: newCultivation
          }
        },
        cultivationState: {
          ...state.cultivationState,
          isCultivating: false,
          breakthroughReady: checkBreakthroughReady(state.data, newCultivation)
        }
      };
    case 'BREAKTHROUGH_SUCCESS':
      return {
        ...state,
        data: {
          ...state.data,
          baseAttrs: {
            ...state.data.baseAttrs,
            level: action.payload.newLevel,
            cultivationStage: action.payload.newStage,
            cultivation: getCultivationForNextStage(action.payload.newStage)
          }
        },
        cultivationState: {
          ...state.cultivationState,
          breakthroughReady: false
        }
      };
    // 其他case...
    default:
      return state;
  }
}

// 创建Context
const CharacterContext = createContext(null);

// Provider组件
export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  // 定义操作函数
  const fetchCharacter = async (characterId) => {
    dispatch({ type: 'FETCH_CHARACTER_START' });
    try {
      // API调用获取角色数据
      const data = await api.getCharacter(characterId);
      dispatch({ type: 'FETCH_CHARACTER_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_CHARACTER_ERROR', payload: error.message });
    }
  };

  const startCultivation = (speed, duration) => {
    dispatch({ type: 'START_CULTIVATION', payload: { speed, duration } });
  };

  const stopCultivation = () => {
    dispatch({ type: 'STOP_CULTIVATION' });
  };

  const attemptBreakthrough = () => {
    dispatch({ type: 'ATTEMPT_BREAKTHROUGH' });
    // 实际突破逻辑会通过API调用
  };

  const updateCharacterAttributes = (attributes) => {
    dispatch({ type: 'UPDATE_CHARACTER_ATTRIBUTES', payload: attributes });
  };

  return (
    <CharacterContext.Provider 
      value={{ 
        ...state, 
        dispatch, 
        fetchCharacter,
        startCultivation,
        stopCultivation,
        attemptBreakthrough,
        updateCharacterAttributes
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

// 自定义Hook
export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

// 辅助函数
function checkBreakthroughReady(character, cultivation = null) {
  if (!character) return false;
  const currentCultivation = cultivation || character.baseAttrs.cultivation;
  const nextStageThreshold = getCultivationThreshold(character.baseAttrs.cultivationStage);
  return currentCultivation >= nextStageThreshold * 0.9; // 90%时显示可突破
}
```

## 5. 实现步骤与时间规划

### 5.1 第1周：基础架构与数据模型
- **Day 1-2**: 项目框架搭建
  - 创建项目目录结构
  - 配置TypeScript、ESLint和Prettier
  - 设置基础UI组件库(自定义组件)
  - 配置修炼系统基础工具

- **Day 3-4**: 数据模型实现
  - 定义核心TypeScript接口(人物属性、五行系统、修炼体系)
  - 创建修炼值计算和境界转换工具
  - 实现五行亲和度计算逻辑
  - 创建模拟数据生成器(包含修炼系统)
  - 实现数据验证逻辑(Zod schema)

- **Day 5-7**: 状态管理实现
  - 创建React Context和useReducer
  - 实现修炼状态管理(开始/停止修炼、突破尝试)
  - 实现五行属性联动计算
  - 实现境界突破逻辑
  - 编写修炼系统单元测试

### 5.2 第2周：UI实现与集成
- **Day 8-9**: 实现单屏完整人物面板
  - 创建4列网格紧凑布局(1080p/2K/4K适配)
  - 实现响应式字体和间距缩放
  - 优化信息密度和可读性平衡
  - 实现五行亲和度进度条可视化

- **Day 10-11**: 动态数据展示与交互
  - 实时修炼进度可视化组件
  - 资源数值的K/M单位转换显示
  - 悬停提示和快速操作按钮
  - 突破准备状态指示器

- **Day 12-13**: 宗门面板与系统集成
  - 实现宗门信息紧凑面板
  - 建筑状态和资源产出实时显示
  - 连接UI组件与状态管理
  - 实现修炼动画和属性变化微反馈

- **Day 14**: 多端适配与测试
  - 响应式布局测试(桌面端优先)
  - 性能基准测试和优化
  - 用户体验最终调优
  - 编写系统使用文档

## 6. 技术选型与依赖
- **核心框架**: React 18, TypeScript 5.0
- **状态管理**: React Context API + useReducer
- **UI组件**: 自定义组件库(基础样式)
- **数据验证**: Zod
- **日期处理**: date-fns
- **样式解决方案**: CSS Modules + SCSS
- **动画库**: Framer Motion (修炼动画、突破特效)
- **图表可视化**: Recharts (五行亲和度雷达图)
- **测试工具**: Jest + React Testing Library
- **进度条组件**: @radix-ui/react-progress
- **滑块组件**: @radix-ui/react-slider (属性调整)

## 7. 风险与应对策略
- **风险**: 数据模型设计不足，导致后期重构
  **应对**: 前期进行充分评审，创建详细的数据字典，重点验证修炼值计算公式的准确性

- **风险**: UI组件设计不一致
  **应对**: 建立组件设计规范，创建Storybook文档，特别关注五行属性可视化的一致性

- **风险**: 状态管理复杂度超出预期(修炼状态、突破逻辑等)
  **应对**: 采用模块化设计，将修炼系统拆分为独立的子状态管理模块

- **风险**: 修炼数值平衡性问题
  **应对**: 建立数值测试框架，创建多个测试场景验证修炼速度和突破难度的合理性

- **风险**: 五行属性计算性能问题
  **应对**: 使用React.memo和useMemo优化计算密集型操作，建立性能监控

- **风险**: 开发进度延迟
  **应对**: 设置关键里程碑，预留2天缓冲期，优先实现核心修炼功能