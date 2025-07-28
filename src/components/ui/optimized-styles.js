/**
 * Simple UI Optimizations
 * Performance enhancements that don't change existing CSS functionality
 */

import { css } from '../../lit-core-2.7.4.min.js';

export const uiOptimizations = css`
  /* Performance optimizations */
  * {
    box-sizing: border-box;
  }
  
  /* Smooth animations */
  .smooth-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* GPU acceleration for better performance */
  .gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  /* Focus improvements */
  .focus-ring:focus-visible {
    outline: 2px solid var(--primary-color, #3b82f6);
    outline-offset: 2px;
  }
  
  /* Scroll improvements */
  .smooth-scroll {
    scroll-behavior: smooth;
  }
  
  /* Performance hints for browser */
  .will-change-transform {
    will-change: transform;
  }
  
  .will-change-opacity {
    will-change: opacity;
  }
`;

export default uiOptimizations;
