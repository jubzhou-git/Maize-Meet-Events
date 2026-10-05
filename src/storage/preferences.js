import AsyncStorage from '@react-native-async-storage/async-storage';

const DARK_KEY = 'preferences.darkTheme';
const CARD_LAYOUT_KEY = 'preferences.cardLayout';

export const CARD_LAYOUTS = { standard: 'standard', compact: 'compact' };

export const defaultPreferences = {
  darkTheme: false,
  cardLayout: CARD_LAYOUTS.standard,
};

export async function getPreferences() {
  const [storedTheme, storedLayout] = await Promise.all([
    AsyncStorage.getItem(DARK_KEY),
    AsyncStorage.getItem(CARD_LAYOUT_KEY),
  ]);

  return {
    darkTheme: storedTheme === null ? false : Boolean(storedTheme),
    cardLayout:
      storedLayout === CARD_LAYOUTS.compact ? CARD_LAYOUTS.compact : CARD_LAYOUTS.standard,
  };
}

export function setDarkTheme(value) {
  return AsyncStorage.setItem(DARK_KEY, String(value));
}

export function setCardLayout(value) {
  return AsyncStorage.setItem(CARD_LAYOUT_KEY, value);
}

export function resetPreferences() {
  return AsyncStorage.clear();
}
