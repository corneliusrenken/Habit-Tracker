import { nativeTheme } from 'electron';
import backgroundColorValues from './backgroundColorValues';

export default function getCurrentBackgroundColor() {
  const displayDarkMode = (
    nativeTheme.themeSource === 'dark'
    || (nativeTheme.themeSource === 'system' && nativeTheme.shouldUseDarkColors)
  );

  return displayDarkMode
    ? backgroundColorValues.dark
    : backgroundColorValues.light;
}
