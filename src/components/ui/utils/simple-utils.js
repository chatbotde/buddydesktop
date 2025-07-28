/**
 * Simple UI Utilities
 * Essential performance and interaction helpers
 */

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls to once per specified time
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Smooth animation helper
 */
export function animateElement(element, keyframes, options = {}) {
  if (!element) return Promise.resolve();
  
  const defaultOptions = {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards'
  };
  
  return element.animate(keyframes, { ...defaultOptions, ...options }).finished;
}

/**
 * Focus management helper
 */
export function manageFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  return {
    first: focusableElements[0],
    last: focusableElements[focusableElements.length - 1],
    all: focusableElements,
    focusFirst: () => focusableElements[0]?.focus(),
    focusLast: () => focusableElements[focusableElements.length - 1]?.focus()
  };
}
