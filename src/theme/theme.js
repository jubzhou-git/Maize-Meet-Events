import { createTheme } from '@rneui/themed';

export const colors = {
  maize: '#FFCB05',
  blue: '#00274C',
  blueLight: '#33597D',
  cream: '#F7F4ED',
  ink: '#17212B',
  muted: '#66717C',
  border: '#DCE2E7',
  danger: '#B42318',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF1F4',
  badge: '#E4ECF5',
  badgeText: '#23313D',
  description: '#3E4A55',
  placeholder: '#7B858E',
  chipBorder: '#AAB4BE',
  selectedText: '#FFFFFF',
  heart: '#C6253D',
};

export const darkColors = {
  maize: colors.maize,
  blue: colors.maize,
  blueLight: '#A8CCE9',
  cream: '#101820',
  ink: '#F7F4ED',
  muted: '#B2BEC8',
  border: '#35485A',
  danger: '#FF8A80',
  surface: '#17212B',
  surfaceAlt: '#253443',
  badge: '#253443',
  badgeText: '#F7F4ED',
  description: '#D2DCE4',
  placeholder: '#AAB5BF',
  chipBorder: '#71879A',
  selectedText: '#101820',
  heart: '#FF7185',
};

const themeOptions = {
  lightColors: {
    primary: colors.blue,
    secondary: colors.maize,
    background: colors.cream,
    white: '#FFFFFF',
    black: colors.ink,
    grey0: colors.ink,
    grey3: colors.muted,
    grey5: colors.border,
  },
  darkColors: {
    primary: colors.maize,
    secondary: darkColors.blueLight,
    background: darkColors.cream,
    white: darkColors.surface,
    black: darkColors.ink,
    grey0: darkColors.ink,
    grey3: darkColors.muted,
    grey5: darkColors.border,
  },
  components: {
    Button: {
      radius: 10,
      titleStyle: { fontWeight: '700' },
    },
    Card: {
      containerStyle: {
        borderRadius: 16,
        borderWidth: 0,
        margin: 0,
      },
    },
  },
};

export const appTheme = createTheme({ ...themeOptions, mode: 'light' });
export const darkAppTheme = createTheme({ ...themeOptions, mode: 'dark' });
