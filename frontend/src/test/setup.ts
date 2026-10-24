/**
 * Vitest global setup
 * Runs once before each test file.
 * - Imports @testing-library/jest-dom to extend Vitest's `expect`
 *   with DOM-aware matchers (toBeInTheDocument, toHaveTextContent, etc.)
 */
import '@testing-library/jest-dom';

// JSDOM does not implement scrollIntoView by default
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = function () {};
}
