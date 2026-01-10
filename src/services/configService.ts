import { invoke } from '@tauri-apps/api/core';

interface Config {
  tmdbApiKey: string;
}

class ConfigService {
  async initialize() {
    // Config initialization is done on first read/write via Tauri commands
  }

  async getConfig(): Promise<Config | null> {
    try {
      const content: string = await invoke('read_config');
      return JSON.parse(content);
    } catch (err) {
      console.log('Config file not found or error reading it:', err);
      return null;
    }
  }

  async saveConfig(config: Config): Promise<void> {
    try {
      await invoke('write_config', { content: JSON.stringify(config, null, 2) });
    } catch (err) {
      console.error('Error saving config:', err);
      throw err;
    }
  }

  async getApiKey(): Promise<string | null> {
    const config = await this.getConfig();
    return config?.tmdbApiKey || null;
  }

  async setApiKey(apiKey: string): Promise<void> {
    const config = await this.getConfig() || { tmdbApiKey: '' };
    config.tmdbApiKey = apiKey;
    await this.saveConfig(config);
  }
}

export const configService = new ConfigService();
