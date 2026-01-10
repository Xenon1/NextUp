# GitHub Setup Guide for NextUp

This guide will help you set up the NextUp project on GitHub.

## ✅ Pre-Deployment Checklist

The project has been configured for GitHub hosting with the following security measures in place:

### Security
- ✅ `.env.local` is in `.gitignore` - API keys will NOT be committed
- ✅ `.nextup/` directory is in `.gitignore` - User config files will NOT be synced
- ✅ `node_modules/` is in `.gitignore` - Dependencies managed via `package.json`
- ✅ Build artifacts (`build/`, `dist/`, `src-tauri/target/`) are in `.gitignore`
- ✅ No hardcoded API keys in source code - uses secure config file approach
- ✅ Test files and documentation included for reference

### Code Quality
- ✅ All 76 unit tests passing
- ✅ TypeScript compilation clean (0 errors)
- ✅ ESLint configuration in place
- ✅ Comprehensive test coverage with Vitest

## Initial GitHub Setup (One Time)

### 1. Create a GitHub Repository
- Go to https://github.com/new
- Name: `NextUp` (or your preferred name)
- Description: "A Windows desktop app to track movies, TV shows, and anime with TMDB integration"
- Choose: Public or Private
- Do NOT initialize with README, .gitignore, or license (we have these)
- Click "Create repository"

### 2. Initialize Local Git Repository

```bash
cd path/to/NextUp
git init
git add .
git commit -m "Initial commit: NextUp desktop app with Tauri, React, TypeScript"
```

### 3. Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/NextUp.git
git branch -M main
git push -u origin main
```

### 4. Verify the Push
Check https://github.com/YOUR_USERNAME/NextUp to confirm your code is there.

## First-Time User Setup (From GitHub)

Anyone cloning this repo for the first time should:

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/NextUp.git
cd NextUp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Get TMDB API Key
- Visit https://www.themoviedb.org/settings/api
- Sign up for free account if needed
- Request an API key
- Copy your API key

### 4. Set Up Local Configuration

The app now uses a secure, local configuration file instead of environment variables.

**First Run:**
- Start the app: `npm run tauri-dev`
- You'll see a setup modal asking for your API key
- Enter your TMDB API key
- The app saves it securely to `~/.nextup/config.json` (not in the repo)

**Alternative (Manual Setup):**
- Create `~/.nextup/config.json` with:
```json
{
  "tmdbApiKey": "YOUR_API_KEY_HERE"
}
```

### 5. Run the App
```bash
npm run tauri-dev
```

## Updating the Repository

### Push New Changes
```bash
git add .
git commit -m "Your descriptive commit message"
git push
```

### Keep It Clean
Before pushing, ensure:
1. No API keys in code or `.env.local`
2. Run tests: `npm run test`
3. Build succeeds: `npm run build`
4. No node_modules or build artifacts added

## What's NOT in the Repository

Files/folders intentionally excluded (safe to ignore):

- `node_modules/` - Reinstalled via `npm install`
- `.env.local` - Contains your TMDB API key
- `.nextup/` - Your personal config and watchlist
- `build/` - Generated build artifacts
- `dist/` - Generated distribution files
- `src-tauri/target/` - Tauri build artifacts

## What IS in the Repository

Everything needed to build and develop:

- ✅ Source code (`src/`)
- ✅ Tauri backend (`src-tauri/`)
- ✅ Configuration files (`vite.config.ts`, `tsconfig.json`, etc.)
- ✅ Test files and test configuration
- ✅ Package definitions (`package.json`, `package-lock.json`)
- ✅ Documentation (`README.md`, this file)
- ✅ Assets (`public/`)

## Common Issues

### "API Key not found" error
- Ensure you've set up the config file via the setup modal OR manually
- The file should be at `~/.nextup/config.json`
- Restart the app after adding the key

### Build fails locally
1. Verify Node.js version: `node --version` (should be 16+)
2. Clean install: `rm -r node_modules && npm install`
3. Check Rust installation: `rustc --version`

### Tests fail after pulling changes
- Run `npm install` to update dependencies
- Rebuild: `npm run build`

## CI/CD Considerations (Optional)

For automated testing on push, consider adding GitHub Actions:

Create `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run build
```

## License

This project uses the MIT License - see LICENSE file for details.

---

**Ready to host on GitHub!** 🚀

You can now run the setup commands above to get your project on GitHub.
