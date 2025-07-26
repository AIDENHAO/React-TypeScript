import React, { useState, useEffect } from 'react';
import { CultivationLogService } from '../services/CultivationLogService';
import { CultivationLog, CultivationLogFilter } from '../types/CultivationLog';
import './CultivationLog.css';

interface CultivationLogProps {
  maxHeight?: string;
  showFilters?: boolean;
}

export const CultivationLogComponent: React.FC<CultivationLogProps> = ({ 
  maxHeight = '400px',
  showFilters = true 
}) => {
  const [logs, setLogs] = useState<CultivationLog[]>([]);
  const [filter, setFilter] = useState<CultivationLogFilter>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = () => {
    const logService = CultivationLogService.getInstance();
    const filteredLogs = Object.keys(filter).length > 0 
      ? logService.getFilteredLogs(filter)
      : logService.getAllLogs();
    setLogs(filteredLogs);
  };

  const handleFilterChange = (newFilter: Partial<CultivationLogFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const clearFilter = () => {
    setFilter({});
  };

  const clearAllLogs = () => {
    if (window.confirm('确定要清空所有修炼日志吗？此操作不可撤销。')) {
      CultivationLogService.getInstance().clearAllLogs();
      loadLogs();
    }
  };

  const exportLogs = () => {
    try {
      const exported = CultivationLogService.getInstance().exportLogs();
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cultivation-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('导出失败：' + (error as Error).message);
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'cultivation': return '🧘';
      case 'insight': return '💡';
      case 'breakthrough': return '⚡';
      case 'stage_change': return '🌟';
      default: return '📝';
    }
  };

  const getLogTypeText = (type: string) => {
    switch (type) {
      case 'cultivation': return '修炼';
      case 'insight': return '顿悟';
      case 'breakthrough': return '突破';
      case 'stage_change': return '境界提升';
      default: return '其他';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="cultivation-log">
      <div className="log-header">
        <h3 className="log-title">
          <span className="log-icon">📜</span>
          修炼日志
          <span className="log-count">({logs.length})</span>
        </h3>
        <div className="log-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起' : '展开'}
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={exportLogs}
            disabled={logs.length === 0}
          >
            导出
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={clearAllLogs}
            disabled={logs.length === 0}
          >
            清空
          </button>
        </div>
      </div>

      {showFilters && isExpanded && (
        <div className="log-filters">
          <div className="filter-row">
            <select 
              value={filter.type || ''} 
              onChange={(e) => handleFilterChange({ type: e.target.value || undefined })}
              className="filter-select"
            >
              <option value="">所有类型</option>
              <option value="cultivation">修炼</option>
              <option value="insight">顿悟</option>
              <option value="breakthrough">突破</option>
              <option value="stage_change">境界提升</option>
            </select>
            
            <input
              type="text"
              placeholder="搜索关键词..."
              value={filter.keyword || ''}
              onChange={(e) => handleFilterChange({ keyword: e.target.value || undefined })}
              className="filter-input"
            />
            
            <button 
              className="btn btn-secondary btn-sm"
              onClick={clearFilter}
            >
              清除筛选
            </button>
          </div>
        </div>
      )}

      <div 
        className={`log-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
      >
        {logs.length === 0 ? (
          <div className="log-empty">
            <div className="empty-icon">📝</div>
            <div className="empty-text">暂无修炼记录</div>
            <div className="empty-hint">开始修炼后，这里将显示您的修炼历程</div>
          </div>
        ) : (
          <div className="log-list">
            {logs.map((log) => (
              <div key={log.id} className={`log-item log-${log.type}`}>
                <div className="log-item-header">
                  <span className="log-item-icon">{getLogIcon(log.type)}</span>
                  <span className="log-item-type">{getLogTypeText(log.type)}</span>
                  <span className="log-item-time">{formatTime(log.timestamp)}</span>
                </div>
                <div className="log-item-message">{log.message}</div>
                
                {(log.gains || log.losses) && (
                  <div className="log-item-details">
                    {log.gains && (
                      <div className="log-gains">
                        {log.gains.cultivation && (
                          <span className="gain-item">+{log.gains.cultivation} 修炼值</span>
                        )}
                        {log.gains.stageChange && (
                          <span className="gain-item">
                            {log.gains.stageChange.from} → {log.gains.stageChange.to}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {log.losses && (
                      <div className="log-losses">
                        {log.losses.cultivation && (
                          <span className="loss-item">-{log.losses.cultivation} 修炼值</span>
                        )}
                        {log.losses.soulStrength && (
                          <span className="loss-item">-{log.losses.soulStrength} 灵魂强度</span>
                        )}
                        {log.losses.vitality && (
                          <span className="loss-item">-{log.losses.vitality} 生命力</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CultivationLogComponent;