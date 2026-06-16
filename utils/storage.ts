import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './types';

const STORAGE_KEY = 'taskmaster_data_v1';

export const defaultData: AppData = {
  userName: null,
  tasks: [],
  points: 0,
  streak: 0,
  lastCompletedDate: null,
};

/**
 * Loads saved app data from local device storage.
 * Works fully offline — no internet connection needed.
 */
export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed };
  } catch (e) {
    console.warn('Failed to load data from storage', e);
    return { ...defaultData };
  }
}

/**
 * Saves app data to local device storage.
 * Works fully offline — data stays on the phone.
 */
export async function saveData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data to storage', e);
  }
}
