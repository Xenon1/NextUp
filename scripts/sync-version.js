#!/usr/bin/env node

/**
 * Sync version across project files
 * Run automatically before git commit when using `npm version`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Read version from package.json
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`📦 Syncing version to ${version}...`);

// Update Tauri config (if it exists and has version field)
const tauriConfigPath = path.join(projectRoot, 'src-tauri', 'tauri.conf.json');
if (fs.existsSync(tauriConfigPath)) {
  const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
  if (tauriConfig.version !== version) {
    tauriConfig.version = version;
    fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');
    console.log(`✅ Updated Tauri config: ${version}`);
  }
}

// Update Cargo.toml (Rust package version)
const cargoPath = path.join(projectRoot, 'src-tauri', 'Cargo.toml');
if (fs.existsSync(cargoPath)) {
  let cargo = fs.readFileSync(cargoPath, 'utf8');
  const oldVersion = cargo.match(/^version = "([^"]+)"/m)?.[1];
  if (oldVersion !== version) {
    cargo = cargo.replace(/^version = "[^"]+"/, `version = "${version}"`);
    fs.writeFileSync(cargoPath, cargo);
    console.log(`✅ Updated Cargo.toml: ${version}`);
  }
}

// Update App.tsx (APP_VERSION constant)
const appTsxPath = path.join(projectRoot, 'src', 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  let appTsx = fs.readFileSync(appTsxPath, 'utf8');
  const oldAppVersion = appTsx.match(/const APP_VERSION = '([^']+)'/)?.[1];
  if (oldAppVersion !== version) {
    appTsx = appTsx.replace(/const APP_VERSION = '[^']+'/, `const APP_VERSION = '${version}'`);
    fs.writeFileSync(appTsxPath, appTsx);
    console.log(`✅ Updated App.tsx: ${version}`);
  }
}

console.log(`\n🎉 Version synced to ${version}`);
console.log(`📝 Don't forget to update CHANGELOG.md with release notes!`);
