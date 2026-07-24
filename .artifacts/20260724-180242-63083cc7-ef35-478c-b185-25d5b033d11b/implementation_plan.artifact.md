# Domain Migration and Final Branding Clean-up

Migrate the Vercel deployment domains to match the new `MAAT OS` branding and perform a final sweep for legacy "Studio" references.

## Proposed Changes

### Vercel Configuration
Update the domains via Vercel CLI to ensure `maat-os.vercel.app` is the new default Vercel domain.

- Add `maat-os.vercel.app`
- Remove `maat-studio-ai.vercel.app`

### Codebase Sweep
Perform a final case-insensitive search for "maat-studio" and "studio" in contexts where it refers to the application name.

## Verification Plan

### Manual Verification
- Verify `os.maatfeed.com` is working and points to the latest deployment.
- Verify `maat-os.vercel.app` is active.
- Verify `maat-studio-ai.vercel.app` is no longer associated with the project.
