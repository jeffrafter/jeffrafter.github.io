declare module '*.png'

export declare global {
  import React from 'react'
  import GEmojiElement from '@github/g-emoji-element'
  namespace JSX {
    interface IntrinsicElements {
      'g-emoji': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement, GEmojiElement>
    }
  }
}
