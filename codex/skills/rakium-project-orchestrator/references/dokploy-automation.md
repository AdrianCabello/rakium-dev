# Dokploy Automation

Automate deploy only when one of these access paths is available:

1. Dokploy API token and base URL.
2. Dokploy CLI installed and authenticated.
3. Browser session already authenticated and the user explicitly wants browser automation.
4. GitHub integration configured in Dokploy so pushing to the repo triggers deploy.

Never claim a deploy happened unless a live URL was reached and smoke-tested.

## Discovery

Check local environment first:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match 'DOKPLOY|DEPLOY' }
Get-Command dokploy -ErrorAction SilentlyContinue
```

If no programmatic access exists, prepare the project for deploy:

- Dockerfile
- `.dockerignore`
- `DOKPLOY.md`
- GitHub repo pushed
- documented internal port `4000`
- documented env var `PORT=4000`

Then tell the user exactly what access is missing.

## Browser Automation

Use browser automation only if the user asks for it or there is already a known authenticated Dokploy session. Verify each app setting before saving:

- repo URL
- branch
- Dockerfile path
- internal port
- environment variables
- domain
- HTTPS enabled
- certificate provider `Let's Encrypt`

After deployment, open the live HTTPS URL and run Playwright smoke tests against it.
