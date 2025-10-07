import React from 'react';
import { X, Plus, BarChart3 } from 'lucide-react';
import { AnalysisTab } from '../types';

interface TabNavigationProps {
  tabs: AnalysisTab[];
  activeTabId: string | null;
  onTabSwitch: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewComparison: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabSwitch,
  onTabClose,
  onNewComparison,
}) => {
  if (tabs.length === 0) return null;

  return (
    <div className="bg-muted-dark border-b border-border-subtle">
      <div className="flex items-center px-6 py-3.5 overflow-x-auto gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-200 min-w-0 ${
                tab.id === activeTabId
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-transparent border-border text-muted-foreground hover:bg-muted hover:border-border hover:text-foreground'
              }`}
              onClick={() => onTabSwitch(tab.id)}
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1 text-left">
                <div className="font-medium text-sm truncate">{tab.label}</div>
                <div className="text-xs opacity-70 truncate">
                  {tab.businessType} • {tab.location.split(',')[0]}
                </div>
              </div>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                  aria-label={`Close ${tab.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </button>
          ))}
        </div>
        
        <button
          onClick={onNewComparison}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary/90 text-white rounded-lg hover:bg-primary transition-all duration-200 flex-shrink-0 font-medium"
          style={{ boxShadow: 'var(--shadow-glow-primary)' }}
          aria-label="Start new comparison"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;