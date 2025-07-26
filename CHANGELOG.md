# 更新日志 (Changelog)

## [未发布] - 2024-12-19

### 修复 (Fixed)

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

---

## 版本说明

- **[未发布]** - 当前开发中的更改
- **修复 (Fixed)** - 错误修复
- **新增 (Added)** - 新功能
- **更改 (Changed)** - 现有功能的更改
- **移除 (Removed)** - 移除的功能
- **安全 (Security)** - 安全相关的修复