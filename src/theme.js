// Design tokens for the whole app. Screens and components should read from
// here instead of hard-coding colours or sizes.

const palette = {
    bg: '#0B1220',
    surface: '#131C2E',
    surfaceAlt: '#1B2740',
    surfaceHover: '#22304D',
    border: '#27334D',
    borderStrong: '#3A4A6B',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    textFaint: '#64748B',
    primary: '#10B981',
    primaryDark: '#059669',
    primarySoft: 'rgba(16,185,129,0.16)',
    accent: '#F59E0B',
    accentSoft: 'rgba(245,158,11,0.16)',
    info: '#3B82F6',
    infoSoft: 'rgba(59,130,246,0.16)',
    danger: '#EF4444',
    dangerSoft: 'rgba(239,68,68,0.16)',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(2,6,23,0.72)',
    // Hoof diagram
    hoof: '#C9A87C',
    hoofSelected: '#F97316',
    hoofDisabled: '#8B7B62',
}

const theme = {
    colors: {
        ...palette,
        textPrimary: palette.text,
        textSecondary: palette.textMuted,
    },
    appBar: {
        primary: palette.surface,
        textPrimary: palette.text,
        textSecondary: palette.textMuted,
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        pill: 999,
    },
    fontSizes: {
        caption: 12,
        body: 15,
        bodyLg: 17,
        subheading: 20,
        title: 26,
        display: 32,
    },
    fonts: {
        main: undefined,
    },
    fontWeights: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    shadow: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 6,
        },
        sheet: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 12,
        },
    },
}

export default theme
