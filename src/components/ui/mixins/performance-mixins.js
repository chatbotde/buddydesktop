/**
 * Simple Performance Mixins
 * Lightweight optimization helpers that don't change existing functionality
 */

import { debounce, throttle } from '../utils/ui-utils.js';

/**
 * Performance Mixin - Adds performance optimization methods
 */
export const PerformanceMixin = (superClass) => class extends superClass {
  /**
   * Debounced method wrapper
   */
  createDebouncedMethod(method, delay = 300) {
    return debounce(method.bind(this), delay);
  }

  /**
   * Throttled method wrapper
   */
  createThrottledMethod(method, delay = 100) {
    return throttle(method.bind(this), delay);
  }

  /**
   * Optimize element for animations
   */
  optimizeForAnimation(element) {
    if (element) {
      element.style.willChange = 'transform, opacity';
      element.style.transform = 'translateZ(0)';
    }
  }

  /**
   * Remove animation optimizations
   */
  removeAnimationOptimization(element) {
    if (element) {
      element.style.willChange = 'auto';
      element.style.transform = '';
    }
  }
};

/**
 * Focus Management Mixin - Improves accessibility
 */
export const FocusMixin = (superClass) => class extends superClass {
  /**
   * Focus the first focusable element
   */
  focusFirstElement() {
    const focusable = this.shadowRoot?.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
  }

  /**
   * Trap focus within element
   */
  trapFocus(event) {
    const focusableElements = this.shadowRoot?.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
};
