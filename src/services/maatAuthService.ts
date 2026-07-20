export interface MAATUserProfile {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  maatfeedProfileId?: string;
  organizationId: string;
  role: 'founder' | 'admin' | 'member';
  authProvider: 'MAAT_SSO';
  connectedAt: string;
}

export class MAATAuthService {
  private static instance: MAATAuthService;
  private currentUser: MAATUserProfile | null = null;

  private constructor() {
    this.initUserFromStorageOrUrl();
  }

  public initUserFromStorageOrUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token') || urlParams.get('userId');
    const email = urlParams.get('email');

    if (ssoToken) {
      localStorage.setItem('maat_sso_token', ssoToken);
      if (email) localStorage.setItem('maat_user_email', email);
    }

    const storedToken = localStorage.getItem('maat_sso_token');
    const storedEmail = localStorage.getItem('maat_user_email') || 'franck@maat-studio.ai';

    if (storedToken) {
      this.currentUser = {
        userId: storedToken,
        email: storedEmail,
        displayName: storedEmail.split('@')[0] || 'Fondateur',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        maatfeedProfileId: `maatfeed-${storedToken}`,
        organizationId: 'org-maat-studio-global',
        role: 'founder',
        authProvider: 'MAAT_SSO',
        connectedAt: new Date().toISOString()
      };
    } else {
      this.currentUser = null;
    }
  }

  public static getInstance(): MAATAuthService {
    if (!MAATAuthService.instance) {
      MAATAuthService.instance = new MAATAuthService();
    }
    return MAATAuthService.instance;
  }

  public getCurrentUser(): MAATUserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public loginAsDemoFounder(): void {
    localStorage.setItem('maat_sso_token', 'user-maat-001');
    localStorage.setItem('maat_user_email', 'franck@maat-studio.ai');
    this.initUserFromStorageOrUrl();
  }

  public logout(): void {
    localStorage.removeItem('maat_sso_token');
    localStorage.removeItem('maat_user_email');
    this.currentUser = null;
  }

  public getSSOLoginUrl(): string {
    const ssoBaseUrl = import.meta.env.VITE_MAAT_SSO_URL || 'https://www.maatfeed.com/auth';
    const currentUrl = encodeURIComponent(window.location.origin);
    return `${ssoBaseUrl}?redirect_to=${currentUrl}`;
  }
}
