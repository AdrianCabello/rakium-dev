import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * Rakium theme: ese azul #639BF0 como primario, fondo oscuro #1A1C20 / #1E1E1E,
 * cards #2C3550, texto blanco, bordes #666666, enlaces #7EA78E.
 */
export const RakiumPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: {
        primary: {
          color: '#639BF0',
          contrastColor: '#ffffff',
          hoverColor: '#7aa8f2',
          activeColor: '#5181d4',
        },
        surface: {
          0: '#ffffff',
          50: '#2a2d35',
          100: '#252830',
          200: '#1f2229',
          300: '#1c1e24',
          400: '#1a1c20',
          500: '#181a1e',
          600: '#16181c',
          700: '#14161a',
          800: '#121418',
          900: '#1E1E1E',
          950: '#1A1C20',
        },
        formField: {
          background: '#1A1C20',
          disabledBackground: '#252830',
          filledBackground: '#1E1E1E',
          filledHoverBackground: '#1E1E1E',
          filledFocusBackground: '#1E1E1E',
          borderColor: '#666666',
          hoverBorderColor: '#7a7a7a',
          focusBorderColor: '#639BF0',
          invalidBorderColor: '#ef4444',
          color: '#ffffff',
          disabledColor: '#666666',
          placeholderColor: '#A0A0A0',
          invalidPlaceholderColor: '#f87171',
          floatLabelColor: '#A0A0A0',
          floatLabelFocusColor: '#639BF0',
          floatLabelActiveColor: '#A0A0A0',
          floatLabelInvalidColor: '#f87171',
          iconColor: '#A0A0A0',
        },
        text: {
          color: '#ffffff',
          hoverColor: '#ffffff',
          mutedColor: '#A0A0A0',
          hoverMutedColor: '#b0b0b0',
        },
        content: {
          background: '#2C3550',
          hoverBackground: '#353d55',
          borderColor: '#666666',
          color: '#ffffff',
          hoverColor: '#ffffff',
        },
        highlight: {
          background: 'rgba(99, 155, 240, 0.16)',
          focusBackground: 'rgba(99, 155, 240, 0.24)',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        overlay: {
          select: {
            background: '#2C3550',
            borderColor: '#666666',
            color: '#ffffff',
          },
          popover: {
            background: '#2C3550',
            borderColor: '#666666',
            color: '#ffffff',
          },
          modal: {
            background: '#2C3550',
            borderColor: '#666666',
            color: '#ffffff',
          },
        },
        navigation: {
          item: {
            focusBackground: '#2C3550',
            activeBackground: '#2C3550',
            color: '#ffffff',
            focusColor: '#639BF0',
            activeColor: '#639BF0',
            icon: {
              color: '#A0A0A0',
              focusColor: '#639BF0',
              activeColor: '#639BF0',
            },
          },
          submenuLabel: {
            background: 'transparent',
            color: '#A0A0A0',
          },
          submenuIcon: {
            color: '#A0A0A0',
            focusColor: '#639BF0',
            activeColor: '#639BF0',
          },
        },
      },
    },
  },
});
