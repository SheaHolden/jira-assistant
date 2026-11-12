import { getThemeMode, themeClassPrefix, themes } from '@/constants/themes';
import type { ThemeId } from '@types';

export function applyBodyTheme(theme: ThemeId): void {
    const { classList } = document.body;
    classList.remove('mode-light', 'mode-dark', ...themes.map((t) => themeClassPrefix + t.id));
    classList.add(`mode-${getThemeMode(theme)}`, themeClassPrefix + theme);
}
