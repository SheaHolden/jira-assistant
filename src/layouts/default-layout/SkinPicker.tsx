import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { BrightSunIcon, NightLightIcon } from 'fluxo-ui/icons';

import { themes } from '@/constants/themes';
import { useTheme } from '@hooks';
import type { ThemeId } from '@types';

function SkinPicker() {
    const { theme, setTheme, isDark } = useTheme();
    const [showPanel, setShowPanel] = useState(false);
    const pickerRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPanel(false);
            }
        };

        if (showPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPanel]);

    const togglePanel = useCallback(() => setShowPanel((prev) => !prev), []);

    const selectTheme = useCallback(
        (id: ThemeId) => {
            setTheme(id);
            setShowPanel(false);
        },
        [setTheme],
    );

    return (
        <li ref={pickerRef} className="nav-item relative list-none">
            <span
                className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg transition-colors text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)"
                onClick={togglePanel}
                title="Change theme"
            >
                {isDark ? <NightLightIcon className="size-5" /> : <BrightSunIcon className="size-5" />}
            </span>
            {showPanel && (
                <div className="absolute right-0 top-full mt-1 w-52 py-1 rounded-xl z-50 overflow-hidden bg-(--bg-primary) border border-(--border-primary) shadow-(--shadow-xl)">
                    <div className="px-3 pt-2 pb-1 font-semibold text-xs uppercase tracking-wider text-(--text-tertiary)">Theme</div>
                    {themes.map(({ id, label, swatch: [background, accent] }) => (
                        <button
                            key={id}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-(--text-primary) hover:bg-(--bg-hover) ${id === theme ? 'font-semibold' : ''}`}
                            onClick={() => selectTheme(id)}
                        >
                            <span
                                className="size-4 rounded-full shrink-0 border border-(--border-secondary)"
                                style={{ background: `linear-gradient(135deg, ${background} 50%, ${accent} 50%)` }}
                            />
                            <span className="flex-1">{label}</span>
                            {id === theme && <i className="fa fa-check text-xs text-(--primary-color)" />}
                        </button>
                    ))}
                </div>
            )}
        </li>
    );
}

export default memo(SkinPicker);
