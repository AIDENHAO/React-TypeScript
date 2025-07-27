# 更新日志 (Changelog)

## [未发布] - 2024-12-19

### 新增功能 - StageOne 阶段完成
- **修炼日志系统**: 完整的修炼历史记录功能
  - 新增 `CultivationLog.ts` 类型定义，包含日志接口、配置和过滤器
  - 新增 `CultivationLogService.ts` 服务类，提供日志的增删改查、统计、导入导出功能
  - 支持修炼、顿悟、突破成功/失败、境界提升等多种日志类型
  - 提供时间范围、类型、关键词等多维度过滤功能

- **修炼进度可视化**: 全新的修炼进度组件
  - 新增 `CultivationProgress.tsx` 组件，实时显示修炼进度
  - 包含当前境界、修炼进度条、修炼速度、突破成功率等信息
  - 支持突破准备状态提示和视觉效果
  - 响应式设计，适配移动端和桌面端

- **修炼日志界面**: 交互式日志查看组件
  - 新增 `CultivationLogComponent.tsx` 组件，提供日志查看和管理功能
  - 支持日志筛选、搜索、导出、清空等操作
  - 实时显示修炼收益和损失详情
  - 美观的时间格式化和图标显示

- **功能测试页面**: 完整的测试环境
  - 新增 `TestPage.tsx` 测试页面，提供 StageOne 功能的全面测试
  - 包含修炼功能测试、突破功能测试、服务层测试等
  - 实时测试结果显示和错误处理
  - 组件展示区域，便于功能验证

- **导航系统**: 页面切换功能
  - 更新 `App.tsx` 添加导航栏和页面路由
  - 支持主页面和测试页面之间的切换
  - 现代化的导航界面设计

### 功能增强
- **CultivationService.ts**: 集成修炼日志记录
  - 修炼操作自动记录日志，包含收益详情
  - 顿悟触发时记录特殊日志
  - 境界提升自动记录变化详情
  - 突破成功/失败记录详细信息和损失

- **CharacterPanel.tsx**: 集成新组件
  - 添加修炼进度组件显示
  - 添加修炼日志组件显示
  - 提升用户体验和信息可视化

### 界面优化
- **深色主题**: 全面升级为现代深色主题
  - 更新 `App.module.scss` 采用深色渐变背景
  - 统一的色彩方案和视觉效果
  - 改进的导航栏设计和交互效果

- **响应式设计**: 全面的移动端适配
  - 所有新组件都支持响应式布局
  - 优化移动端的交互体验
  - 自适应的组件尺寸和间距

### 修复 (Fixed)

#### 2024-12-19 - Context Hook 使用错误修复

**修复内容：**
- **CharacterPanel.tsx**: 修复 `useCharacter` hook 的错误解构方式
  - 将 `const { data, loading, error, cultivate, breakthrough } = useCharacter();` 修改为 `const { currentCharacter: character } = useCharacter();`
  - 移除了不存在的 `loading` 和 `error` 状态处理
  - 更新了"修炼"和"突破"按钮的点击事件为日志输出

- **ClanPanel.tsx**: 修复 `useClan` hook 的错误解构方式
  - 将 `const { data, loading, error } = useClan();` 修改为 `const { currentClan: clan, isLoading, error } = useClan();`
  - 调整了无宗门数据时的渲染逻辑
  - 修复了建筑进度条的计算方式

- **TestPage.tsx**: 修复 Context hook 的使用问题
  - 将 `useCharacter` 的解构方式从 `data, loading, error, cultivate, breakthrough` 更改为只解构 `currentCharacter`
  - 移除了加载和错误状态处理
  - 更新了突破条件检查和境界获取的逻辑

**配置文件修复：**
- **tsconfig.node.json**: 修复错误的文件引用
  - 将 `"include": ["vite.config.ts"]` 修改为 `"include": ["vite.config.js"]`
  - 解决了配置文件引用不匹配的问题

**问题原因：**
- Context Provider 返回的接口与组件中使用的解构方式不匹配
- 配置文件中引用了不存在的 TypeScript 配置文件

**解决方案：**
- 统一了 Context hook 的使用方式，确保解构的属性名与 Provider 返回的接口一致
- 更新了配置文件引用，使其指向正确的文件

**影响范围：**
- 文件：`src/components/CharacterPanel/CharacterPanel.tsx`
- 文件：`src/components/ClanPanel/ClanPanel.tsx`
- 文件：`src/pages/TestPage.tsx`
- 文件：`tsconfig.node.json`

#### CultivationService.ts 类型安全修复

**修复内容：**
- 在 `calculateBreakthroughPenalties` 方法中，使用 `in` 操作符进行类型安全检查：
  - 将 `soulStrengthLoss: phasePenalty.soulStrengthLoss || 0` 修改为 `soulStrengthLoss: 'soulStrengthLoss' in phasePenalty ? phasePenalty.soulStrengthLoss : 0`
  - 将 `vitalityLoss: phasePenalty.vitalityLoss ? Math.floor(currentStage.maxCultivation * phasePenalty.vitalityLoss) : undefined` 修改为 `vitalityLoss: 'vitalityLoss' in phasePenalty ? Math.floor(currentStage.maxCultivation * phasePenalty.vitalityLoss) : undefined`

**问题原因：**
根据 `cultivationStages.json` 数据，`breakthroughFailurePenalties` 中不同阶段具有不同的属性结构：
- `mortal` 和 `cultivator` 阶段：包含 `cultivationLoss` 和 `soulStrengthLoss` 属性
- `immortal` 阶段：只包含 `cultivationLoss` 和 `vitalityLoss` 属性，没有 `soulStrengthLoss`

这种联合类型结构导致 TypeScript 无法确定某个属性是否存在，从而产生类型错误。

**解决方案：**
使用 `in` 操作符进行运行时属性检查，确保只有当属性确实存在于对象中时才访问它，这样既满足了 TypeScript 的类型安全要求，又保证了代码的健壮性。

**影响范围：**
- 文件：`src/services/CultivationService.ts`
- 方法：`calculateBreakthroughPenalties`
- 行号：第277-278行

### 技术改进
- **类型安全**: 完善的 TypeScript 类型定义
- **代码组织**: 清晰的文件结构和模块划分
- **性能优化**: 高效的数据处理和渲染机制
- **用户体验**: 流畅的交互和视觉反馈

### StageOne 阶段总结
本次更新完成了 StageOne 阶段的所有核心目标：
1. ✅ 完善人物属性系统 - 属性显示和计算完整
2. ✅ 修炼系统核心功能 - 修炼、突破、顿悟机制完善
3. ✅ 数据持久化 - 本地存储和数据管理完整
4. ✅ 用户界面优化 - 现代化界面和交互体验
5. ✅ 修炼进度可视化 - 实时进度显示和状态提示
6. ✅ 修炼日志系统 - 完整的历史记录和管理功能
7. ✅ 功能测试环境 - 全面的测试页面和验证机制

---

## 版本说明

- **[未发布]** - 当前开发中的更改
- **修复 (Fixed)** - 错误修复
- **新增 (Added)** - 新功能
- **更改 (Changed)** - 现有功能的更改
- **移除 (Removed)** - 移除的功能
- **安全 (Security)** - 安全相关的修复