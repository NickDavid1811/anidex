import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

import { AnimeMedia } from '@/features/anime/types/anime.types';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let sqliteDisabled = false;
let fileStoreInitialized = false;

const memoryStore = new Map<number, { anime: AnimeMedia; createdAt: number }>();
const FILE_PATH = `${FileSystem.documentDirectory || ''}anidex_favorites.json`;

async function initFileStoreIfNeeded(): Promise<void> {
  if (fileStoreInitialized) return;
  fileStoreInitialized = true;
  try {
    if (FileSystem.documentDirectory) {
      const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(FILE_PATH);
        const data = JSON.parse(content) as {
          anime: AnimeMedia;
          createdAt: number;
        }[];
        if (Array.isArray(data)) {
          memoryStore.clear();
          data.forEach((item) => {
            if (item && item.anime && item.anime.id) {
              memoryStore.set(item.anime.id, item);
            }
          });
        }
      }
    }
  } catch (e) {
    console.warn('Error reading favorites file store:', e);
  }
}

async function persistFileStore(): Promise<boolean> {
  try {
    if (FileSystem.documentDirectory) {
      const items = Array.from(memoryStore.values());
      await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(items));
      return true;
    }
  } catch (e) {
    console.warn('Error persisting favorites to file store:', e);
  }
  return false;
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  if (sqliteDisabled || Platform.OS === 'web') {
    return null;
  }
  if (!dbInstance) {
    try {
      dbInstance = await SQLite.openDatabaseAsync('anidex_favorites.db');
      await dbInstance.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY NOT NULL,
          anime_json TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);
    } catch (e) {
      console.warn(
        'SQLite unavailable or failed, switching to resilient file storage:',
        e
      );
      sqliteDisabled = true;
      dbInstance = null;
      return null;
    }
  }
  return dbInstance;
}

export async function addFavoriteToDb(anime: AnimeMedia): Promise<void> {
  await initFileStoreIfNeeded();
  const previous = memoryStore.get(anime.id);
  const now = Date.now();
  memoryStore.set(anime.id, { anime, createdAt: now });
  const fileSaved = await persistFileStore();

  const db = await getDatabase();
  if (db) {
    try {
      const jsonStr = JSON.stringify(anime);
      await db.runAsync(
        `INSERT OR REPLACE INTO favorites (id, anime_json, created_at) VALUES (?, ?, ?);`,
        [anime.id, jsonStr, now]
      );
      return;
    } catch (e) {
      console.warn('SQLite runAsync failed, falling back to file store:', e);
      sqliteDisabled = true;
    }
  }
  if (!fileSaved) {
    if (previous) memoryStore.set(anime.id, previous);
    else memoryStore.delete(anime.id);
    throw new Error('No pudimos guardar el favorito en este dispositivo.');
  }
}

export async function removeFavoriteFromDb(id: number): Promise<void> {
  await initFileStoreIfNeeded();
  const previous = memoryStore.get(id);
  memoryStore.delete(id);
  const fileSaved = await persistFileStore();

  const db = await getDatabase();
  if (db) {
    try {
      await db.runAsync(`DELETE FROM favorites WHERE id = ?;`, [id]);
      return;
    } catch (e) {
      console.warn('SQLite delete failed:', e);
      sqliteDisabled = true;
    }
  }
  if (!fileSaved) {
    if (previous) memoryStore.set(id, previous);
    throw new Error('No pudimos quitar el favorito de este dispositivo.');
  }
}

export async function isFavoriteInDb(id: number): Promise<boolean> {
  await initFileStoreIfNeeded();
  if (memoryStore.has(id)) {
    return true;
  }
  const db = await getDatabase();
  if (db) {
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT count(*) as count FROM favorites WHERE id = ?;`,
        [id]
      );
      return (result?.count ?? 0) > 0;
    } catch (e) {
      console.warn('SQLite isFavorite check failed:', e);
      sqliteDisabled = true;
    }
  }
  return memoryStore.has(id);
}

export async function getAllFavoritesFromDb(): Promise<AnimeMedia[]> {
  await initFileStoreIfNeeded();
  const db = await getDatabase();
  if (db) {
    try {
      const rows = await db.getAllAsync<{ anime_json: string }>(
        `SELECT anime_json FROM favorites ORDER BY created_at DESC;`
      );
      if (rows && rows.length > 0) {
        const parsed = rows.map(
          (row) => JSON.parse(row.anime_json) as AnimeMedia
        );
        // Sync into memory store
        parsed.forEach((a) => {
          if (!memoryStore.has(a.id)) {
            memoryStore.set(a.id, { anime: a, createdAt: Date.now() });
          }
        });
        return parsed;
      }
    } catch (e) {
      console.warn('SQLite getAllAsync failed, using file store:', e);
      sqliteDisabled = true;
    }
  }
  return Array.from(memoryStore.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => item.anime);
}

export async function getFavoriteIdsFromDb(): Promise<number[]> {
  await initFileStoreIfNeeded();
  const db = await getDatabase();
  if (db) {
    try {
      const rows = await db.getAllAsync<{ id: number }>(
        `SELECT id FROM favorites ORDER BY created_at DESC;`
      );
      if (rows && rows.length > 0) {
        return rows.map((r) => r.id);
      }
    } catch (e) {
      console.warn('SQLite getFavoriteIds failed:', e);
      sqliteDisabled = true;
    }
  }
  return Array.from(memoryStore.keys());
}

export async function getFavoritesCountFromDb(): Promise<number> {
  await initFileStoreIfNeeded();
  const db = await getDatabase();
  if (db) {
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT count(*) as count FROM favorites;`
      );
      if (result && typeof result.count === 'number') {
        return result.count;
      }
    } catch (e) {
      console.warn('SQLite count failed:', e);
      sqliteDisabled = true;
    }
  }
  return memoryStore.size;
}
