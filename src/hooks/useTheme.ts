import { getThemeMode } from '@/constants/themes';
import { useThemeStore } from '@stores';

export function useTheme() {
    const { theme, setTheme } = useThemeStore();
    const mode = getThemeMode(theme);

    return {
        theme,
        setTheme,
        isDark: mode === 'dark',
        isLight: mode === 'light',
    };
}
