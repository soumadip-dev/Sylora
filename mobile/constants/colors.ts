const tintColorLight = '#0D1B2A';
const tintColorDark = '#F9F9F9';

export const Colors = {
  light: {
    primary: '#0D1B2A',
    secondary: '#F9F9F9',
    accent: '#C9A84C',

    background: '#F8F9FF',
    surface: '#FFFFFF',
    surfaceDim: '#C2DCFF',
    surfaceContainerLow: '#EEF4FF',
    surfaceContainer: '#E5EFFF',

    text: '#001D36',
    textMuted: '#44474C',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#0D1B2A',

    outline: '#74777D',
    outlineLight: '#C4C6CC',

    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onError: '#FFFFFF',

    tabActive: '#0D1B2A',
    tabInactive: '#74777D',
    tabLabel: '#000000ff',

    gray100: '#F5F5F7',
    gray200: '#E5E5EA',
    gray300: '#D1D1D6',
    gray500: '#8E8E93',
    gray900: '#1C1C1E',
  },
  dark: {
    // Primary colors - swapped but harmonious
    primary: '#E5EFFF',
    secondary: '#E5EFFF', // Lighter secondary for contrast
    accent: '#D4B05C', // Slightly warmer accent for better visibility

    // Backgrounds - maintaining depth hierarchy
    background: '#0A1118', // Darker, richer background (was #001D36)
    surface: '#16212B', // Elevated surface (was #0D1B2A)
    surfaceDim: '#0D141C', // Subtle dim surface
    surfaceContainerLow: '#1E2C38', // Lifted container
    surfaceContainer: '#162838', // Base container

    // Text - maintaining readability
    text: '#EDF2F7', // Crisp light text
    textMuted: '#94A3B8', // Softer muted text
    textOnPrimary: '#EDF2F7', // Text on primary surfaces
    textOnAccent: '#0A1118', // Dark text on accent for contrast

    // Outlines - subtle borders
    outline: '#334155', // Muted outline (was #8E9096)
    outlineLight: '#2D3A4A', // Lighter outline for subtle borders

    // Error states - maintain consistency
    error: '#FFB4AB',
    errorContainer: '#93000A',
    onError: '#0A1118',

    // Tab elements - matching primary scheme
    tabActive: '#D4B05C', // Accent color for active tabs
    tabInactive: '#64748B', // Muted inactive tabs
    tabLabel: '#FFFFFFFF',

    // Grays - maintaining hierarchy
    gray100: '#2D3A4A', // Lightest dark gray
    gray200: '#1E2C38', // Medium-light dark gray
    gray300: '#16212B', // Medium dark gray
    gray500: '#64748B', // Mid gray
    gray900: '#EDF2F7', // Almost white
  },
};
