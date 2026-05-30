import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// Creates or opens up a local physical database file named app.db on-device
export const expoDb = openDatabaseSync('app.db');

export const db = drizzle(expoDb, { schema });