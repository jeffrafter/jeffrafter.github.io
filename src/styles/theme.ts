import styled, { css, createGlobalStyle } from 'styled-components'
import { prop, hasProp } from './props'

let sansFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
let monospaceFont = '"Consolas", Menlo, Monaco, "Courier New", monospace'

export { css, styled }

export const theme = {
  fonts: {
    sans: [`12px ${sansFont}`, `13px ${sansFont}`, `15px ${sansFont}`],
    monospace: [`12px ${monospaceFont}`, `15px ${monospaceFont}`]
  },
  fontSizes: ['12px', '13px', '15px'],
  fontWeights: ['regular', '300', '600', '900'],
  lineHeight: ['1em', '1.4em'],
  space: ['2px', '4px', '8px', '12px', '16px', '24px', '64px', '128px', '256px', '512px'],
  shadows: ['0 4px 8px rgba(0, 0, 0, 0.32)'],
  colors: {
    black: '#000000',
    contrast: '#24292e',
    contrastMedium: '#6a737d',
    contrastLight: '#777d83',
    contrastLighter: '#959da5',
    contrastLightest: '#e1e4e8',
    primary: '#40e37a',
    primaryLight: '#67ec99',
    accent: '#2188ff',
    accentLight: '#79b8ff',
    accentLightest: '#deeeff',
    white: '#ffffff'
  }
}

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *, *::before, *::after {
		box-sizing: inherit;
	}

  body {
    margin: 0;
    padding: 0;
    font: ${theme.fonts.sans[1]};
  }

  ::selection {
    color: ${theme.colors.contrastLightest};
    background: rgba(0, 0, 0, 0.70);
  }
`

export let Block = styled('div')<any>`
  box-sizing: border-box;

  ${prop('gridArea', 'grid-area')};

  ${hasProp('inline')`
    display: inline;
  `};

  ${hasProp('border')`
    border: 1px solid ${theme.colors.contrastLightest};
  `};
`
