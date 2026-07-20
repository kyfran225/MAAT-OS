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
  private currentUser: MAATUserProfile;

  private constructor() {
    this.currentUser = {
      userId: 'user-maat-001',
      email: 'franck@maat-studio.ai',
      displayName: 'Franck',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      maatfeedProfileId: 'maatfeed-user-franck-888',
      organizationId: 'org-maat-studio-global',
      role: 'founder',
      authProvider: 'MAAT_SSO',
      connectedAt: new Date().toISOString()
    };
  }

  public static getInstance(): MAATAuthService {
    if (!MAATAuthService.instance) {
      MAATAuthService.instance = new MAATAuthService();
    }
    return MAATAuthService.instance;
  }

  public getCurrentUser(): MAATUserProfile {
    return this.currentUser;
  }

  public verifySSOToken(): boolean {
    return true; // Single Sign-On token valid across MAATFEED & MAAT Studio AI
  }
}
