import { db } from "../db/database";

export const settingsRepository = {
  async get<T>(key: string): Promise<T | undefined> {
    const setting = await db.settings.get(key);
    return setting?.value as T | undefined;
  },

  set<T>(key: string, value: T): Promise<string> {
    return db.settings.put({ key, value, updatedAt: Date.now() });
  },

  remove(key: string): Promise<void> {
    return db.settings.delete(key);
  },
};
