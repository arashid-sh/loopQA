import { BrowserContext } from '@playwright/test';

export async function setFeatureFlagCookie(context: BrowserContext, name: string, value: string, domain: string): Promise<void> {
  await context.addCookies([
    {
      name: name,
      value: value,
      domain: domain,
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ]);
}
