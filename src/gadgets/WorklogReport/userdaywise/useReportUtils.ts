import { useCallback, useMemo } from 'react';

import { inject } from '../../../services/injector';
import { useWorklogStore } from '../datastore';
import { convertReportSecs } from '../utils';

export function useConvertSecs() {
    const { logFormat, hourDecimals } = useWorklogStore();

    return useCallback((val: number) => convertReportSecs(val, logFormat, hourDecimals), [logFormat, hourDecimals]);
}

export function useFormatTime() {
    return useMemo(() => {
        const { $userutils } = inject('UserUtilsService');
        return (val: Date) => $userutils.formatTime(val);
    }, []);
}
