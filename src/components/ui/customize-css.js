import { css } from '../../lit-core-2.7.4.min.js';

export const customizeStyles = css`
  :host { 
    display: block; 
  }
  
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
    width: 100%;
    position: relative;
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
  
  /* Base input styles matching your design system */
  select, input, textarea {
    background: oklch(26.9% 0 0);
    color: var(--text-color);
    border: var(--glass-border);
    padding: 10px 14px;
    width: 100%;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: inherit;
  }
  
  select {
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-color: oklch(14.1% 0.005 285.823);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
    cursor: pointer;
  }
  
  select:hover {
    background-color: oklch(14.1% 0.005 285.823);
    border-color: var(--input-border);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  select:focus, input:focus, textarea:focus {
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
  
  input::placeholder, textarea::placeholder {
    color: var(--placeholder-color);
  }
  
  .custom-prompt-textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  /* Button styles matching your design system */
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
  
  .button:disabled {
    opacity: 0.5;
    transform: none;
    cursor: not-allowed;
  }

  /* Profile Header Styles */
  .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
  }

  /* Profile Selection Styles */
  .profile-selector {
      position: relative;
  }

  .profile-selector select {
      background-color: var(--input-background);
      border: 2px solid transparent;
      transition: all 0.3s ease;
  }

  .profile-selector select:focus,
  .profile-selector.selected select {
      border-color: var(--accent-color, #4f46e5);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  /* Selected Profile Indicator - Using your UI colors */
  .selected-profile-indicator {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
      background: oklch(44.4% 0.011 73.639);
      border-radius: 50%;
      border: 2px solid var(--main-content-background);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--text-color);
      font-weight: bold;
      animation: pulse 2s infinite;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 0.8; }
  }

  /* Custom Profile Badge - Using your green accent */
  .custom-profile-badge {
      display: inline-block;
      background: rgba(74, 222, 128, 0.2);
      border: 1px solid rgba(74, 222, 128, 0.4);
      color: #4ade80;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      margin-left: 8px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
  }

  /* Profile Creation Form */
  .create-profile-form {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin: 20px 0;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
      from {
          opacity: 0;
          transform: translateY(-20px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  .create-profile-form h3 {
      margin: 0 0 20px 0;
      color: var(--text-color);
      font-size: 18px;
      font-weight: 600;
      text-align: center;
  }

  .create-profile-form input,
  .create-profile-form textarea {
      background: var(--input-background);
      color: var(--text-color);
      border: var(--glass-border);
      padding: 12px 16px;
      width: 100%;
      border-radius: 12px;
      font-size: 14px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      font-family: inherit;
  }

  .create-profile-form input:focus,
  .create-profile-form textarea:focus {
      outline: none;
      border-color: var(--input-border);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
      background: oklch(48.8% 0.243 264.376);
      transform: translateY(-1px);
  }

  .create-profile-form textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.5;
  }

  /* Button Group */
  .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
  }

  .button-group .button {
      margin-bottom: 0;
      flex: 1;
      max-width: 120px;
  }

  /* Button Variants */
  .button.secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .button.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
  }

  .button.danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border: 1px solid #b91c1c;
      color: white;
  }

  .button.danger:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
  }

  .button.small {
      padding: 6px 12px;
      font-size: 12px;
      margin-top: 12px;
  }

  /* Profile Status Indicator - Using your UI colors */
  .profile-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 12px;
      background: var(--main-content-background);
      border: var(--glass-border);
      border-radius: 12px;
      font-size: 13px;
      color: var(--text-color);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .profile-status-icon {
      width: 12px;
      height: 12px;
      background: oklch(44.4% 0.011 73.639);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
      font-size: 8px;
      font-weight: bold;
      border: 1px solid var(--border-color);
  }

  /* Active Profile Highlight - Using your glassmorphism style */
  .option-group.active-profile {
      background: var(--main-content-background);
      border: var(--glass-border);
      border-radius: 16px;
      padding: 20px;
      position: relative;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: var(--glass-shadow);
  }

  .option-group.active-profile::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: oklch(44.4% 0.011 73.639);
      border-radius: 17px;
      z-index: -1;
      opacity: 0.1;
  }

  /* Profile Header Styles */
  .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
  }

  /* Profile Selection Styles */
  .profile-selector {
      position: relative;
  }

  .profile-selector select {
      background-color: oklch(14.1% 0.005 285.823);
      border: var(--glass-border);
      transition: all 0.3s ease;
  }

  .profile-selector select:focus,
  .profile-selector.selected select {
      border-color: var(--input-border);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  /* Profile Creation Form */
  .create-profile-form {
      background: var(--main-content-background);
      border: var(--glass-border);
      border-radius: 16px;
      padding: 24px;
      margin: 20px 0;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: var(--glass-shadow);
      animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
      from {
          opacity: 0;
          transform: translateY(-20px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  .create-profile-form h3 {
      margin: 0 0 20px 0;
      color: var(--text-color);
      font-size: 18px;
      font-weight: 600;
      text-align: center;
  }

  .create-profile-form input,
  .create-profile-form textarea {
      margin-bottom: 16px;
  }

  .create-profile-form textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.5;
  }

  /* Button Group */
  .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
  }

  .button-group .button {
      margin-bottom: 0;
      flex: 1;
      max-width: 120px;
  }

  /* Button Variants */
  .button.secondary {
      background: var(--button-background);
      border: var(--glass-border);
      opacity: 0.8;
  }

  .button.secondary:hover {
      opacity: 1;
      background: var(--button-background);
      border-color: var(--button-border);
  }

  .button.danger {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #ef4444;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
  }

  .button.danger:hover {
      background: rgba(239, 68, 68, 0.3);
      border-color: rgba(239, 68, 68, 0.6);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
  }

  .button.small {
      padding: 6px 12px;
      font-size: 12px;
      margin-top: 12px;
  }

  /* Loading State */
  .button.loading {
      opacity: 0.7;
      cursor: not-allowed;
      position: relative;
  }

  .button.loading::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      margin: auto;
      border: 2px solid transparent;
      border-top-color: var(--text-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  /* Validation Error Styles */
  .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
  }

  .error-message::before {
      content: '⚠️';
      font-size: 10px;
  }

  .input-error {
      border-color: rgba(239, 68, 68, 0.6) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
  }

  .general-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      color: #ef4444;
      font-size: 13px;
  }

  /* Success Message */
  .success-message {
      background: rgba(74, 222, 128, 0.1);
      border: 1px solid rgba(74, 222, 128, 0.3);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      color: #4ade80;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
  }

  .success-message::before {
      content: '✅';
  }

  /* Character Counter */
  .character-counter {
      font-size: 11px;
      color: var(--text-color);
      opacity: 0.6;
      text-align: right;
      margin-top: 4px;
  }

  .character-counter.warning {
      color: #fbbf24;
      opacity: 1;
  }

  .character-counter.error {
      color: #ef4444;
      opacity: 1;
  }

  /* Responsive Design */
  @media (max-width: 600px) {
      .profile-header {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
      }

      .button-group {
          flex-direction: column;
      }

      .button-group .button {
          max-width: none;
      }

      .create-profile-form {
          padding: 16px;
          margin: 16px 0;
      }
  }
`;