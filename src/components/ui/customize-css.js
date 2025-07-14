import { css } from '../../lit-core-2.7.4.min.js';

export const customizeStyles = css`
  :host { display: block; }
  .main-view-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
  }
  .option-group {
      margin-bottom: 24px;
      border-color: oklch(98.5% 0.001 106.423);
  }
  .option-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-color);
  }
  .description {
      font-size: 13px;
      color: var(--text-color);
      opacity: 0.7;
      margin-top: 8px;
      line-height: 1.4;
  }
  select {
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      background-color: var(--input-background);
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding: 10px 40px 10px 14px;
      color: var(--text-color);
      border: var(--glass-border);
      border-radius: 12px;
      font-size: 14px;
      width: 100%;
      margin-bottom: 0;
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
  }
  select:focus {
      outline: none;
      border-color: var(--input-border);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
      background: oklch(48.8% 0.243 264.376);
      transform: translateY(-1px);
  }
  select option {
      background-color: var(--main-content-background);
      color: var(--text-color);
      padding: 10px 14px;
      border: none;
      font-size: 14px;
  }
  .custom-prompt-textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
      background: oklch(26.9% 0 0);
      color: var(--text-color);
      border: var(--glass-border);
      padding: 10px 14px;
      width: 100%;
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .custom-prompt-textarea:focus {
      outline: none;
      border-color: var(--input-border);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
      background: oklch(48.8% 0.243 264.376);
      transform: translateY(-1px);
  }
  .button {
      background: var(--button-background);
      color: var(--text-color);
      border: var(--glass-border);
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
      align-self: flex-start;
  }
  .button:hover {
      background: var(--button-background);
      border-color: var(--button-border);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;