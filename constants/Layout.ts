import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Tab bar height and bottom padding adjustments
const TAB_BAR_HEIGHT = 49; // Standard tab bar height
const BOTTOM_SPACING = Platform.OS === 'ios' ? 34 : 16; // Extra spacing for home indicator on newer iOS devices
const SAFE_BOTTOM_PADDING = TAB_BAR_HEIGHT + BOTTOM_SPACING;

export default {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,
    TAB_BAR_HEIGHT,
    BOTTOM_SPACING,
    SAFE_BOTTOM_PADDING
}; 