export interface MAATUserProfile {
  userId:            string;
  email:             string;
  displayName:       string;   // '' if unknown - never an email prefix or token
  firstName:         string;   // '' if unknown
  lastName:          string;   // '' if unknown
  avatarUrl:         string;   // '' if unknown
  maatfeedProfileId?: string;
  organizationId:    string;
  role:              'founder' | 'admin' | 'member';
  authProvider:      'MAAT_SSO';
  connectedAt:       string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guard: returns true only if the string looks like a real human name.
// Rejects: empty, email addresses, hex tokens (like ObjectId/UUID),
//          pure numbers, or very short strings (<2 chars of actual letters).
// ─────────────────────────────────────────────────────────────────────────────
function isRealName(value: string | null | undefined): value is string {
  if (!value || value.trim().length < 2) return false;
  if (value.includes('@'))               return false; // is an email
  if (/^[0-9a-f-]{20,}$/i.test(value.trim())) return false; // hex token / UUID / ObjectId
  if (/^\d+$/.test(value.trim()))        return false; // pure number
  // Must contain at least one letter
  if (!/[a-zA-ZÀ-ÿ]/.test(value))       return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build structured name fields from whatever identity params are available.
// Returns empty strings rather than fallback garbage (email prefix, tokens…).
// ─────────────────────────────────────────────────────────────────────────────
function resolveNameFields(params: {
  displayName?: string | null;
  givenName?:   string | null;
  familyName?:  string | null;
}): { displayName: string; firstName: string; lastName: string } {
  const dn = isRealName(params.displayName) ? params.displayName!.trim() : null;
  const gn = isRealName(params.givenName)   ? params.givenName!.trim()   : null;
  const fn = isRealName(params.familyName)  ? params.familyName!.trim()  : null;

  if (dn) {
    const parts = dn.split(/\s+/);
    return {
      displayName: dn,
      firstName:   parts[0],
      lastName:    parts.slice(1).join(' '),
    };
  }

  if (gn || fn) {
    const full = [gn, fn].filter(Boolean).join(' ');
    return {
      displayName: full,
      firstName:   gn || '',
      lastName:    fn || '',
    };
  }

  // No real name available - return empty, never a fake fallback
  return { displayName: '', firstName: '', lastName: '' };
}

// ─────────────────────────────────────────────────────────────────────────────
// URL param decoder
// ─────────────────────────────────────────────────────────────────────────────
function decodeParam(value: string | null): string | null {
  if (!value) return null;
  try { return decodeURIComponent(value); } catch { return value; }
}

// ─────────────────────────────────────────────────────────────────────────────
export class MAATAuthService {
  private static instance: MAATAuthService;
  private currentUser: MAATUserProfile | null = null;

  private constructor() {
    this.initUserFromStorageOrUrl();
  }

  public initUserFromStorageOrUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    // ── 1. SSO token ─────────────────────────────────────────────────────────
    const ssoToken = urlParams.get('sso_token') || urlParams.get('userId');

    // ── 2. Identity fields from the SSO callback URL ──────────────────────────
    //    Accepts multiple naming conventions for maximum compatibility.
    const emailParam       = decodeParam(urlParams.get('email'));
    const displayNameParam = decodeParam(
      urlParams.get('display_name') || urlParams.get('displayName') || urlParams.get('name')
    );
    const givenNameParam   = decodeParam(
      urlParams.get('given_name')  || urlParams.get('givenName')  || urlParams.get('first_name')
    );
    const familyNameParam  = decodeParam(
      urlParams.get('family_name') || urlParams.get('familyName') || urlParams.get('last_name')
    );
    const avatarUrlParam   = decodeParam(
      urlParams.get('avatar_url') || urlParams.get('avatarUrl') ||
      urlParams.get('picture')    || urlParams.get('photo')
    );

    if (ssoToken) {
      localStorage.setItem('maat_sso_token', ssoToken);

      // Only store identity fields that are valid (not tokens / email prefixes)
      if (emailParam)                             localStorage.setItem('maat_user_email',        emailParam);
      if (isRealName(displayNameParam))           localStorage.setItem('maat_user_display_name', displayNameParam!);
      if (isRealName(givenNameParam))             localStorage.setItem('maat_user_given_name',   givenNameParam!);
      if (isRealName(familyNameParam))            localStorage.setItem('maat_user_family_name',  familyNameParam!);
      if (avatarUrlParam && avatarUrlParam.startsWith('http')) {
        localStorage.setItem('maat_user_avatar_url', avatarUrlParam);
      }

      // Remove SSO params from address bar (security)
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }

    // ── 3. Rehydrate from localStorage ───────────────────────────────────────
    const storedToken   = localStorage.getItem('maat_sso_token');
    const storedEmail   = localStorage.getItem('maat_user_email') || '';
    const storedDisplay = localStorage.getItem('maat_user_display_name') || null;
    const storedGiven   = localStorage.getItem('maat_user_given_name')   || null;
    const storedFamily  = localStorage.getItem('maat_user_family_name')  || null;
    const storedAvatar  = localStorage.getItem('maat_user_avatar_url')   || null;

    if (!storedToken) {
      this.currentUser = null;
      return;
    }

    const { displayName, firstName, lastName } = resolveNameFields({
      displayName: storedDisplay,
      givenName:   storedGiven,
      familyName:  storedFamily,
    });

    // Avatar: use Google photo if stored, otherwise generate an initials avatar
    // only when we actually have a real name to show initials from.
    let avatar = '';
    if (storedAvatar && storedAvatar.startsWith('http')) {
      avatar = storedAvatar;
    } else if (displayName) {
      avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=F59E0B&color=0B0E17&bold=true&size=128`;
    }

    this.currentUser = {
      userId:            storedToken,
      email:             storedEmail,
      displayName,
      firstName,
      lastName,
      avatarUrl:         avatar,
      maatfeedProfileId: `maatfeed-${storedToken}`,
      organizationId:    'org-maat-studio-global',
      role:              'founder',
      authProvider:      'MAAT_SSO',
      connectedAt:       new Date().toISOString(),
    };
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
    localStorage.setItem('maat_sso_token',       'user-demo');
    localStorage.setItem('maat_user_email',       'franck@maat-studio.ai');
    localStorage.setItem('maat_user_display_name','Franck Maat');
    localStorage.setItem('maat_user_given_name',  'Franck');
    localStorage.setItem('maat_user_family_name', 'Maat');
    localStorage.removeItem('maat_user_avatar_url');
    this.initUserFromStorageOrUrl();
  }

  public logout(): void {
    localStorage.removeItem('maat_sso_token');
    localStorage.removeItem('maat_user_email');
    localStorage.removeItem('maat_user_display_name');
    localStorage.removeItem('maat_user_given_name');
    localStorage.removeItem('maat_user_family_name');
    localStorage.removeItem('maat_user_avatar_url');
    this.currentUser = null;
  }

  public getSSOLoginUrl(): string {
    const ssoBaseUrl = import.meta.env.VITE_MAAT_SSO_URL || 'https://www.maatfeed.com/auth';
    const currentUrl = encodeURIComponent(window.location.origin);
    return `${ssoBaseUrl}?redirect_to=${currentUrl}`;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Option B: Login Direct sur Studio via Identifiant MAAT (sans redirection web)
  // ─────────────────────────────────────────────────────────────────────────
  public async loginDirectWithCredentials(email: string, passwordHash: string): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/auth/login-direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordHash })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('maat_sso_token', data.token);
          localStorage.setItem('maat_user_email', data.email || email);
          if (data.name) localStorage.setItem('maat_user_display_name', data.name);
          this.initUserFromStorageOrUrl();
          return true;
        }
      }
    } catch (e) {
      console.warn("Direct login fallback to local session rehydration", e);
    }
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Export the guard so other modules can use it (wizard, dashboard, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export { isRealName };
