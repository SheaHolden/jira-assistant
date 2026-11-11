import { devCorsProxyHostSuffix, devCorsProxyPath } from '@/constants/dev-proxy';

import AjaxRequestService from './ajax-request-service';
import type { HttpRequest } from './ajax-request-service';

export * from './ajax-request-service';

export default class WebAjaxRequestService extends AjaxRequestService {
    httpFetch(url: string, request: HttpRequest): Promise<Response> {
        if (!import.meta.env.DEV || !new URL(url, window.location.href).hostname.endsWith(devCorsProxyHostSuffix)) {
            return super.httpFetch(url, request);
        }

        return super.httpFetch(`${devCorsProxyPath}?url=${encodeURIComponent(url)}`, { ...request, credentials: 'omit' });
    }
}
