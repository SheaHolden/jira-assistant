import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeState } from '@types';

import { applyBodyTheme } from './apply-body-theme';

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (theme) => {
                set({ theme });
                applyBodyTheme(theme);
            },
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyBodyTheme(state.theme);
                }
            },
        },
    ),
);
