import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 設定情報の型定義
type Settings = {
  showDescription: boolean;
  isSubscribed: boolean;
  // 将来的に darkMode: boolean; などをここに追加できます
};

// Contextの型定義
type SettingsContextType = {
  settings: Settings;
  toggleShowDescription: () => void;
  toggleSubscription: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // 初期値をLocalStorageから読み込む（なければfalse）
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : { showDescription: false, isSubscribed: false };
  });

  // 設定が変わったらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  // 設定変更関数
  const toggleShowDescription = () => {
    setSettings(prev => ({ ...prev, showDescription: !prev.showDescription }));
  };

  const toggleSubscription = () => {
    setSettings(prev => ({ ...prev, isSubscribed: !prev.isSubscribed }));
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleShowDescription, toggleSubscription }}>
      {children}
    </SettingsContext.Provider>
  );
};