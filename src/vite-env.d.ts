/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MAATFEED_API_URL?: string;
  readonly VITE_MAAT_SSO_URL?: string;
  readonly VITE_MAATFEED_URL?: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  PaystackPop?: {
    setup: (options: any) => {
      openIframe: () => void;
    };
  };
}
