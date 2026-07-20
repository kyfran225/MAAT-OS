/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MAATFEED_API_URL?: string;
  readonly VITE_MAAT_SSO_URL?: string;
  readonly VITE_MAATFEED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
