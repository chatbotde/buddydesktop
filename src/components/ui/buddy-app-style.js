import { css } from '../../lit-core-2.7.4.min.js';

export const buddyAppStyles = css`
        * {
            box-sizing: border-box;
            font-family:
                'Inter',
                -apple-system,
                BlinkMacSystemFont,
                sans-serif;
            margin: 0px;
            padding: 0px;
            cursor: default;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: var(--background-transparent);
            color: var(--text-color);
            
            /* Dark theme (default) - Glassmorphism */
            --background-transparent: rgba(0, 0, 0, 0.1);
            --header-background: rgba(0, 0, 0, 0.2);
            --main-content-background: rgba(0, 0, 0, 0.15);
            --text-color: rgba(255, 255, 255, 0.95);
            --border-color: oklch(98.5% 0.001 106.423);
            --input-background: rgba(255, 255, 255, 0.05);
            --input-border: oklch(98.5% 0.001 106.423);
            --button-background: rgba(255, 255, 255, 0.1);
            --button-border: oklch(98.5% 0.001 106.423);
            --placeholder-color: rgba(255, 255, 255, 0.6);
            --code-background: rgba(255, 255, 255, 0.1);
            --pre-background: rgba(0, 0, 0, 0.3);
            --blockquote-background: rgba(255, 255, 255, 0.05);
            --table-border: oklch(98.5% 0.001 106.423);
            --table-header-background: rgba(255, 255, 255, 0.1);
            --scrollbar-track: rgba(255, 255, 255, 0.1);
            --scrollbar-thumb: rgba(255, 255, 255, 0.3);
            --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            --glass-border: 1px solid oklch(98.5% 0.001 106.423);
            --user-message-bg: rgba(0, 122, 255, 0.2);
            --user-message-border: rgba(0, 122, 255, 0.3);
            --assistant-message-bg: rgba(255, 255, 255, 0.1);
            --assistant-message-border: rgba(255, 255, 255, 0.2);
        }

        

        .window-container {
            height: 100vh;
            border-radius: 16px;
            overflow: visible;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: var(--glass-shadow);
            border: var(--glass-border);
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: visible;
        }

        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            border: none;
            background: var(--header-background);
            border-radius: 16px 16px 0 0;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: none;
        }

        .header-title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            -webkit-app-region: drag;
        }

        .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
            -webkit-app-region: no-drag;
        }

        .header-actions span {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.8;
        }

        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            margin-top: 0;
            border: none;
            background: var(--main-content-background);
            border-radius: 0 0 16px 16px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: none;
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
        }

        .icon-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .icon-button:hover {
            background: var(--button-background);
            color: var(--text-color);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        button:disabled {
            opacity: 0.5;
            transform: none;
        }

        input,
        textarea,
        select {
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

        select {
            background-color: oklch(14.1% 0.005 285.823);
        }

        select:hover {
            background-color: oklch(14.1% 0.005 285.823);
            border-color: var(--input-border);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: var(--input-border);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
            background: oklch(48.8% 0.243 264.376);
            transform: translateY(-1px);
        }

        input[type="text"],
        input[type="password"] {
            border-radius: 20px;
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
            padding-right: 40px;
            cursor: pointer;
        }

        select::-ms-expand {
            display: none !important;
        }

        select::-webkit-dropdown-arrow {
            display: none !important;
        }

        select::-moz-dropdown-arrow {
            display: none !important;
        }

        select::-webkit-outer-spin-button,
        select::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
            display: none !important;
        }

        select:hover {
            background-color: var(--input-background);
            border-color: var(--input-border);
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        select:focus {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
        }

        select:active {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
        }

        input:focus,
        textarea:focus,
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

        select option:hover,
        select option:checked,
        select option:focus {
            background-color: var(--button-background);
            color: var(--text-color);
        }

        input::placeholder,
        textarea::placeholder {
            color: var(--placeholder-color);
        }

        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .input-group input {
            flex: 1;
        }

        .welcome {
            font-size: 28px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 40px;
            color: var(--text-color);
        }

        .option-group {
            margin-bottom: 24px;
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

        .custom-prompt-textarea {
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
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

        .api-input-section {
            width: 100%;
            margin-top: 20px;
        }

        .provider-help-text {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.6;
            margin-top: 4px;
            font-style: italic;
        }

        .response-container {
            background: oklch(44.4% 0.011 73.639);
            border-radius: 10px;
            font-size: 16px;
            line-height: 1.6;
            padding: 16px;
            margin-bottom: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Markdown-specific styling */
        .response-container h1,
        .response-container h2,
        .response-container h3,
        .response-container h4,
        .response-container h5,
        .response-container h6 {
            color: var(--text-color);
            margin: 20px 0 12px 0;
            font-weight: 600;
            line-height: 1.3;
        }

        .response-container h1 {
            font-size: 24px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
        }

        .response-container h2 {
            font-size: 20px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 6px;
        }

        .response-container h3 {
            font-size: 18px;
        }

        .response-container p {
            margin: 12px 0;
            color: var(--text-color);
        }

        .response-container strong {
            color: var(--text-color);
            font-weight: 600;
        }

        .response-container em {
            color: var(--text-color);
            opacity: 0.9;
            font-style: italic;
        }

        .response-container code {
            background: var(--code-background);
            color: #ff6b6b;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 14px;
        }

        

        .response-container pre {
            background: var(--pre-background);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            overflow-x: auto;
        }

        .response-container pre code {
            background: none;
            color: #f8f8f2;
            padding: 0;
            font-size: 13px;
            line-height: 1.5;
        }

        .response-container ul,
        .response-container ol {
            margin: 12px 0;
            padding-left: 24px;
        }

        .response-container li {
            margin: 6px 0;
            color: var(--text-color);
        }

        .response-container blockquote {
            border-left: 4px solid var(--border-color);
            margin: 16px 0;
            padding: 8px 16px;
            background: var(--blockquote-background);
            border-radius: 0 8px 8px 0;
        }

        .response-container a {
            color: #4fc3f7;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
        }

        .response-container a:hover {
            color: #81d4fa;
            border-bottom-color: #81d4fa;
        }

        .response-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
            border: 1px solid var(--table-border);
            border-radius: 8px;
            overflow: hidden;
        }

        .response-container th,
        .response-container td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .response-container th {
            background: var(--table-header-background);
            font-weight: 600;
        }

        .response-container tr:last-child td {
            border-bottom: none;
        }

        .restart-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            margin-left: 8px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .restart-button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .session-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            margin-left: 8px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .session-button:hover {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .session-button.start {
            background: rgba(74, 222, 128, 0.2);
            border-color: rgba(74, 222, 128, 0.4);
            color: #4ade80;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .session-button.start:hover {
            background: rgba(74, 222, 128, 0.3);
            border-color: rgba(74, 222, 128, 0.6);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(74, 222, 128, 0.2);
        }

        .session-button.end {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .session-button.end:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.6);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2);
        }

        .status-container {
            display: flex;
            align-items: center;
            gap: 5px; /* Reduced from 8px */
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }

        .status-live {
            background-color: #4ade80;
            box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
        }

        .status-idle {
            background-color: #fbbf24;
            box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb);
            opacity: 0.8;
        }

        #textInput { 
            flex-grow: 1;
            resize: none;
            overflow-y: hidden;
            min-height: 90px;
            max-height: 150px;
            line-height: 1.4;
            border-radius: 2px; /* Made more rectangular */
            background: transparent; /* Made transparent */
            color: var(--text-color);
            padding: 10px 10px;
            font-size: 14px;
            border: none; /* Removed border */
            box-shadow: none; /* Removed box shadow */
        }

        #textInput:focus {
            outline: none;
            border: none; /* Keep no border on focus */
            box-shadow: none; /* Keep no shadow on focus */
            background: transparent; /* Keep same background */
            transform: none; /* No transform on focus */
        }

        .text-input-container {
            display: flex;
            align-items: center;
            background: var(--header-background);
            border-radius: 16px;
            padding: 8px 16px;
            margin: 12px 0 0 0;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
            border: 1.5px solid var(--border-color);
        }
        .text-input-container textarea {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: var(--text-color);
            font-size: 16px;
            padding: 10px 12px;
            resize: none;
            min-width: 0;
        }
        .text-input-container textarea::placeholder {
            color: var(--placeholder-color);
            opacity: 0.8;
        }
        .send-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            margin-left: 8px;
            cursor: pointer;
            border-radius: 50%;
            padding: 6px;
            transition: background 0.2s;
        }
        .send-btn:hover:not(:disabled) {
            background: var(--button-background);
        }
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .nav-button {
            background: var(--button-background);
            color: var(--text-color);
            border: var(--glass-border);
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            min-width: 40px;
            text-align: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .nav-button:hover:not(:disabled) {
            background: var(--button-background);
            border-color: var(--button-border);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .nav-button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            transform: none;
        }

        .response-counter {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.6;
            white-space: nowrap;
            padding: 0 8px;
        }

        .link {
            color: #4fc3f7;
            cursor: pointer;
            text-decoration: underline;
        }

        .link:hover {
            color: #81d4fa;
        }

        .key {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .history-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .history-item {
            background: var(--main-content-background);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .history-item:hover {
            background: var(--button-background);
            transform: translateY(-2px);
            box-shadow: var(--glass-shadow);
        }

        .history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .history-item-model {
            font-weight: 600;
            font-size: 14px;
        }

        .history-item-time {
            font-size: 12px;
            opacity: 0.7;
        }

        .history-item-preview {
            font-size: 13px;
            opacity: 0.8;
            line-height: 1.4;
        }

        

        

        .chat-container {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 10px;
            scroll-behavior: smooth;
        }

        .message-wrapper {
            display: flex;
            width: 100%;
        }

        .message-wrapper.user {
            justify-content: flex-end;
        }

        .message-wrapper.assistant {
            justify-content: flex-start;
        }



        .message-bubble {
            max-width: 100%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            position: relative;
            animation: messageAppear 0.3s ease-out;
        }

        .message-bubble.user {
            background: oklch(44.4% 0.011 73.639);
            border: 1px solid oklch(37.2% 0.044 257.287 / 0.4);
            color: var(--text-color);
            border-radius: 18px 18px 4px 18px;
        }

        .message-bubble.assistant {
            background: oklch(14.7% 0.004 49.25);
            border: 1px solid oklch(44.4% 0.011 73.639 / 0.4);
            color: var(--text-color);
            border-radius: 18px 18px 18px 4px;
            /* Remove backdrop-filter for solid background */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .message-content {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 4px;
            font-weight: 600;
        }

        .message-time {
            font-size: 11px;
            opacity: 0.6;
            text-align: right;
        }

        .message-bubble.assistant .message-time {
            text-align: left;
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--text-color);
            border-radius: 50%;
            opacity: 0.4;
            animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .typing-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0s;
        }

        @keyframes typingBounce {
            0%, 80%, 100% { 
                transform: scale(0.8);
                opacity: 0.4;
            }
            40% { 
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes messageAppear {
            from {
                opacity: 0;
                transform: translateY(10px); /* Changed back to 10px from -10px */
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Enhanced code block styling */
        .message-content pre {
            background: #1e1e1e;
            border-radius: 4px;
            padding: 12px;
            margin: 8px 0;
            overflow-x: auto;
            position: relative;
        }

        .code-section pre {
            background: #1e1e1e;
            margin: 0;
        }

        .message-content pre code {
            background: none;
            color: #d4d4d4;
            padding: 0;
            font-size: 13px;
            line-height: 1.5;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Cascadia Code', monospace;
            display: block;
            white-space: pre;
        }

        .message-content code {
            background: rgba(255, 255, 255, 0.1);
            color: #ff6b6b;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Cascadia Code', monospace;
            font-size: 13px;
        }

        /* Code block container */
        .code-block-container {
            position: relative;
            margin: 8px 0;
            background: #1e1e1e;
            border-radius: 4px;
            overflow: hidden;
        }

        .code-section .code-block-container {
            margin: 0;
        }

        .code-section .code-block-container:first-of-type {
            margin-top: 0;
        }

        .code-section .code-block-container:last-of-type {
            margin-bottom: 0;
        }

        /* Language label */
        .code-language-label {
            position: absolute;
            top: 4px;
            right: 8px;
            background: transparent;
            color: #6b7280;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 1;
        }

        /* Copy button */
        .code-copy-btn {
            position: absolute;
            top: 4px;
            right: 60px;
            background: transparent;
            border: none;
            color: #6b7280;
            padding: 2px 6px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 1;
        }

        .code-copy-btn:hover {
            color: #d4d4d4;
        }

        /* Content sections */
        .content-section {
            margin: 0;
            padding: 12px;
            border-radius: 4px;
            background: transparent;
        }

        .content-section.code-section {
            background: transparent;
            padding: 0;
        }

        /* Section headers */
        .section-header {
            margin-bottom: 8px;
            padding-bottom: 4px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .code-section .section-title::before {
            content: '⚡';
            font-size: 12px;
        }

        /* Syntax highlighting */
        .message-content .hljs-keyword { color: #569cd6; }
        .message-content .hljs-string { color: #ce9178; }
        .message-content .hljs-number { color: #b5cea8; }
        .message-content .hljs-comment { color: #6a9955; }
        .message-content .hljs-function { color: #dcdcaa; }
        .message-content .hljs-variable { color: #9cdcfe; }
        .message-content .hljs-built_in { color: #4ec9b0; }
        .message-content .hljs-type { color: #569cd6; }
        .message-content .hljs-literal { color: #569cd6; }
        .message-content .hljs-title { color: #dcdcaa; }
        .message-content .hljs-attr { color: #9cdcfe; }
        .message-content .hljs-tag { color: #569cd6; }

        /* Scrollbar for code blocks */
        .message-content pre::-webkit-scrollbar {
            height: 4px;
        }

        .message-content pre::-webkit-scrollbar-track {
            background: transparent;
        }

        .message-content pre::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 2px;
        }

        .message-content pre::-webkit-scrollbar-thumb:hover {
            background: #505050;
        }

        /* Math equation styling */
        .math-equation {
            background: rgba(74, 144, 226, 0.1);
            border: 1px solid rgba(74, 144, 226, 0.3);
            border-radius: 8px;
            padding: 12px 16px;
            margin: 12px 0;
            font-family: 'Times New Roman', serif;
            text-align: center;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }

        .math-equation.inline {
            display: inline;
            background: rgba(74, 144, 226, 0.15);
            border-radius: 4px;
            padding: 2px 6px;
            margin: 0 2px;
        }

        /* Fraction styling */
        .math-equation .fraction {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
        }

        .math-equation .numerator {
            display: block;
            border-bottom: 1px solid currentColor;
            padding-bottom: 2px;
            font-size: 0.9em;
        }

        .math-equation .denominator {
            display: block;
            padding-top: 2px;
            font-size: 0.9em;
        }

        .math-equation .fraction-bar {
            display: none;
        }

        /* Content section styling */
        .organized-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .content-section {
            margin: 0;
            padding: 16px;
            border-radius: 12px;
            border: none;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .content-section.code-section {
            background: transparent;
            padding: 0;
        }

        .content-section.math-section {
            background: rgba(74, 144, 226, 0.08);
        }

        .content-section.text-section {
            background: rgba(255, 255, 255, 0.02);
        }

        .content-section.table-section {
            background: rgba(255, 255, 255, 0.03);
        }

        .content-section.list-section {
            background: rgba(255, 255, 255, 0.02);
        }

        .content-section.heading-section {
            background: rgba(74, 144, 226, 0.05);
        }

        /* Section headers */
        .section-header {
            margin-bottom: 12px;
            padding-bottom: 8px;
        }

        .section-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .code-section .section-title::before {
            content: '⚡';
            font-size: 14px;
        }

        .math-section .section-title::before {
            content: '∑';
            font-size: 16px;
            color: rgba(74, 144, 226, 0.8);
        }

        /* Text content styling */
        .text-content {
            line-height: 1.6;
            color: var(--text-color);
            margin: 8px 0;
        }

        /* Remove extra margins from elements inside sections */
        .content-section > *:first-child {
            margin-top: 0;
        }

        .content-section > *:last-child {
            margin-bottom: 0;
        }

        /* Syntax highlighting for common languages */
        .message-content .hljs-keyword { color: #c792ea; }
        .message-content .hljs-string { color: #c3e88d; }
        .message-content .hljs-number { color: #f78c6c; }
        .message-content .hljs-comment { color: #546e7a; font-style: italic; }
        .message-content .hljs-function { color: #82aaff; }
        .message-content .hljs-variable { color: #eeffff; }
        .message-content .hljs-built_in { color: #ffcb6b; }
        .message-content .hljs-type { color: #c792ea; }
        .message-content .hljs-literal { color: #ff5370; }
        .message-content .hljs-title { color: #82aaff; font-weight: bold; }
        .message-content .hljs-attr { color: #ffcb6b; }
        .message-content .hljs-tag { color: #f07178; }

        /* Table styling improvements */
        .message-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-content th,
        .message-content td {
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            text-align: left;
        }

        .message-content th {
            background: rgba(255, 255, 255, 0.1);
            font-weight: 600;
            color: var(--text-color);
        }

        .message-content td {
            color: var(--text-color);
        }

        /* Blockquote styling */
        .message-content blockquote {
            border-left: 4px solid rgba(74, 144, 226, 0.6);
            background: rgba(74, 144, 226, 0.1);
            margin: 12px 0;
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: rgba(255, 255, 255, 0.9);
        }

        /* List styling improvements */
        .message-content ul,
        .message-content ol {
            margin: 12px 0;
            padding-left: 24px;
        }

        .message-content li {
            margin: 6px 0;
            color: var(--text-color);
            line-height: 1.5;
        }

        .message-content ul li {
            list-style-type: none;
            position: relative;
        }

        .message-content ul li::before {
            content: '•';
            color: rgba(74, 144, 226, 0.8);
            font-weight: bold;
            position: absolute;
            left: -16px;
        }

        /* Responsive design for mobile */
        @media (max-width: 768px) {
            .code-block-container {
                margin: 8px 0;
            }
            
            .code-block-container pre {
                padding: 12px;
                font-size: 12px;
            }
            
            .code-copy-btn {
                right: 8px;
                top: 6px;
                padding: 2px 6px;
                font-size: 10px;
            }
            
            .code-language-label {
                right: 8px;
                top: 28px;
                font-size: 10px;
            }
            
            .math-equation {
                padding: 8px 12px;
                font-size: 14px;
            }
            
            .message-content table {
                font-size: 12px;
            }
            
            .message-content th,
            .message-content td {
                padding: 6px 8px;
            }
        }

        /* Scrollbar styling for code blocks */
        .message-content pre::-webkit-scrollbar {
            height: 8px;
        }

        .message-content pre::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }

        .message-content pre::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }

        .message-content pre::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        /* Animation for content sections */
        .content-section {
            animation: sectionFadeIn 0.3s ease-out;
        }

        @keyframes sectionFadeIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Hover effects for interactive elements */
        .math-equation:hover {
            background: rgba(74, 144, 226, 0.15);
            transform: translateY(-1px);
            transition: all 0.2s ease;
        }

        .math-equation.inline:hover {
            background: rgba(74, 144, 226, 0.25);
        }
    }
`;