import React, { useState } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import CharacterPanel from '../components/CharacterPanel/CharacterPanel';
import CultivationProgress from '../components/CultivationProgress';
import CultivationLogComponent from '../components/CultivationLog';
import { CultivationService } from '../services/CultivationService';
import { CultivationLogService } from '../services/CultivationLogService';
import './TestPage.css';

const TestPage: React.FC = () => {
  const { data: character, loading, error, cultivate, breakthrough } = useCharacter();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runCultivationTest = async () => {
    if (!character) {
      addTestResult('❌ 角色数据未加载');
      return;
    }

    setIsRunningTests(true);
    addTestResult('🧪 开始修炼功能测试...');

    try {
      // 测试修炼功能
      for (let i = 0; i < 5; i++) {
        const result = await cultivate();
        if (result) {
          addTestResult(`✅ 修炼测试 ${i + 1}: 成功`);
        } else {
          addTestResult(`❌ 修炼测试 ${i + 1}: 失败`);
        }
        // 添加延迟以便观察效果
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      addTestResult('🧪 修炼功能测试完成');
    } catch (error) {
      addTestResult(`❌ 修炼测试出错: ${(error as Error).message}`);
    }

    setIsRunningTests(false);
  };

  const runBreakthroughTest = async () => {
    if (!character) {
      addTestResult('❌ 角色数据未加载');
      return;
    }

    setIsRunningTests(true);
    addTestResult('🧪 开始突破功能测试...');

    try {
      // 测试突破功能
      const result = await breakthrough();
      if (result) {
        addTestResult('✅ 突破测试: 成功');
      } else {
        addTestResult('❌ 突破测试: 失败或条件不满足');
      }
    } catch (error) {
      addTestResult(`❌ 突破测试出错: ${(error as Error).message}`);
    }

    setIsRunningTests(false);
  };

  const testCultivationService = () => {
    if (!character) {
      addTestResult('❌ 角色数据未加载');
      return;
    }

    addTestResult('🧪 开始CultivationService测试...');

    try {
      // 测试修炼速度计算
      const speed = CultivationService.calculateCultivationSpeed(character);
      addTestResult(`✅ 修炼速度计算: ${speed.toFixed(2)}%`);

      // 测试顿悟检查
      const enlightenment = CultivationService.checkForInsight(character);
      addTestResult(`✅ 顿悟检查: ${enlightenment ? '触发' : '未触发'}`);

      // 测试突破条件检查
      const canBreakthrough = CultivationService.canBreakthrough(character);
      addTestResult(`✅ 突破条件检查: ${canBreakthrough ? '满足' : '不满足'}`);
      if (!canBreakthrough) {
        addTestResult(`   当前进度不足以突破`);
      }

      // 测试突破成功率计算
      const chance = CultivationService.calculateBreakthroughChance(character);
      addTestResult(`✅ 突破成功率: ${chance.toFixed(2)}%`);

      // 测试当前境界获取
      const currentRealm = character.cultivationAttrs.realm;
      const currentStage = character.cultivationAttrs.stage;
      addTestResult(`✅ 当前境界: ${currentRealm} 第${currentStage}层`);

      addTestResult('🧪 CultivationService测试完成');
    } catch (error) {
      addTestResult(`❌ CultivationService测试出错: ${(error as Error).message}`);
    }
  };

  const testLogService = () => {
    addTestResult('🧪 开始日志服务测试...');

    try {
      // 测试添加日志
      const logService = CultivationLogService.getInstance();
      
      logService.addLog({
        characterId: character?.baseAttrs.id || 'test',
        type: 'cultivation',
        message: '测试修炼日志',
        details: { progress: 100 }
      });
      addTestResult('✅ 添加修炼日志: 成功');

      logService.addLog({
        characterId: character?.baseAttrs.id || 'test',
        type: 'insight',
        message: '测试顿悟日志',
        details: { progress: 150 }
      });
      addTestResult('✅ 添加顿悟日志: 成功');

      logService.addLog({
        characterId: character?.baseAttrs.id || 'test',
        type: 'breakthrough',
        message: '测试突破成功日志',
        details: { 
          fromRealm: '练气期',
          toRealm: '筑基期',
          fromStage: 9,
          toStage: 1
        }
      });
      addTestResult('✅ 添加突破成功日志: 成功');

      // 测试获取日志
      const allLogs = logService.getAllLogs();
      addTestResult(`✅ 获取所有日志: ${allLogs.length} 条`);

      // 测试过滤日志
      const cultivateLogs = logService.getFilteredLogs({ type: 'cultivation' });
      addTestResult(`✅ 过滤修炼日志: ${cultivateLogs.length} 条`);

      // 测试统计信息
      const stats = logService.getLogStats(character?.baseAttrs.id || 'test');
      addTestResult(`✅ 日志统计: 总计 ${stats.total} 条，修炼 ${stats.cultivation} 条`);

      addTestResult('🧪 日志服务测试完成');
    } catch (error) {
      addTestResult(`❌ 日志服务测试出错: ${(error as Error).message}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const clearAllLogs = () => {
    const logService = CultivationLogService.getInstance();
    if (character?.baseAttrs.id) {
      logService.clearLogs(character.baseAttrs.id);
    } else {
      logService.clearAllLogs();
    }
    addTestResult('🗑️ 已清空所有日志');
  };

  if (loading) {
    return (
      <div className="test-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-page">
        <div className="error-container">
          <h2>❌ 错误</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <div className="test-header">
        <h1>🧪 StageOne 功能测试页面</h1>
        <p>测试修仙游戏的核心功能：人物属性、修炼系统、数据持久化和用户界面</p>
      </div>

      <div className="test-content">
        <div className="test-controls">
          <div className="control-section">
            <h3>🎮 功能测试</h3>
            <div className="button-group">
              <button 
                className="test-button primary"
                onClick={runCultivationTest}
                disabled={isRunningTests || !character}
              >
                {isRunningTests ? '测试中...' : '测试修炼功能'}
              </button>
              <button 
                className="test-button primary"
                onClick={runBreakthroughTest}
                disabled={isRunningTests || !character}
              >
                {isRunningTests ? '测试中...' : '测试突破功能'}
              </button>
              <button 
                className="test-button secondary"
                onClick={testCultivationService}
                disabled={!character}
              >
                测试修炼服务
              </button>
              <button 
                className="test-button secondary"
                onClick={testLogService}
              >
                测试日志服务
              </button>
            </div>
          </div>

          <div className="control-section">
            <h3>🛠️ 工具</h3>
            <div className="button-group">
              <button 
                className="test-button warning"
                onClick={clearTestResults}
              >
                清空测试结果
              </button>
              <button 
                className="test-button danger"
                onClick={clearAllLogs}
              >
                清空所有日志
              </button>
            </div>
          </div>
        </div>

        <div className="test-results">
          <h3>📋 测试结果</h3>
          <div className="results-container">
            {testResults.length === 0 ? (
              <div className="no-results">
                <p>暂无测试结果</p>
                <p>点击上方按钮开始测试</p>
              </div>
            ) : (
              <div className="results-list">
                {testResults.map((result, index) => (
                  <div key={index} className="result-item">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="components-showcase">
        <h2>🎨 组件展示</h2>
        
        {character && (
          <>
            {/* 角色面板 */}
            <div className="component-section">
              <h3>👤 角色面板</h3>
              <CharacterPanel />
            </div>

            {/* 修炼进度 */}
            <div className="component-section">
              <h3>📈 修炼进度</h3>
              <CultivationProgress character={character} />
            </div>

            {/* 修炼日志 */}
            <div className="component-section">
              <h3>📜 修炼日志</h3>
              <CultivationLogComponent maxHeight="400px" showFilters={true} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestPage;