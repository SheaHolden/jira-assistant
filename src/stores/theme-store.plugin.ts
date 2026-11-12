import { create } from 'zustand';

import type { ThemeState } from '@types';

import { applyBodyTheme } from './apply-body-theme';

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: 'light',
    setTheme: (theme) => {
        set({ theme });
        applyBodyTheme(theme);
    },
}));
