import { useWindowDimensions } from 'react-native'

// Breakpoint helper shared by every screen. Tablets get wider gutters, a
// capped content width and more grid columns.
export default function useResponsive() {
    const { width, height } = useWindowDimensions()
    const shortest = Math.min(width, height)
    const isTablet = shortest >= 600
    const isLandscape = width > height
    const contentWidth = isTablet ? Math.min(width, 900) : width
    const gutter = isTablet ? 24 : 16
    const columns = width >= 760 ? 4 : width >= 560 ? 3 : 2
    const innerWidth = contentWidth - gutter * 2

    return { width, height, isTablet, isLandscape, contentWidth, innerWidth, gutter, columns }
}
