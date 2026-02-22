'use client';

type Tab = 'authors' | 'categories' | 'nashirs';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  t: (k: string) => string;
};

export function SettingsTabs({ activeTab, onTabChange, t }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {(['authors', 'categories', 'nashirs'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {t(`settings.${tab}`)}
        </button>
      ))}
    </div>
  );
}
