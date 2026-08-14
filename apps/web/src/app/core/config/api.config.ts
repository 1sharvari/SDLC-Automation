import { InjectionToken } from '@angular/core';

/** Base URL for the Node API used by this POC. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => 'http://localhost:3000/api/v1'
});
