import { html, css, LitElement } from './lit-core-2.7.4.min.js';
import './marked.min.js';


class BuddyApp extends LitElement {
    static styles = css`
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
            --border-color: rgba(255, 255, 255, 0.2);
            --input-background: rgba(255, 255, 255, 0.05);
            --input-border: rgba(255, 255, 255, 0.3);
            --button-background: rgba(255, 255, 255, 0.1);
            --button-border: rgba(255, 255, 255, 0.3);
            --placeholder-color: rgba(255, 255, 255, 0.6);
            --code-background: rgba(255, 255, 255, 0.1);
            --pre-background: rgba(0, 0, 0, 0.3);
            --blockquote-background: rgba(255, 255, 255, 0.05);
            --table-border: rgba(255, 255, 255, 0.2);
            --table-header-background: rgba(255, 255, 255, 0.1);
            --scrollbar-track: rgba(255, 255, 255, 0.1);
            --scrollbar-thumb: rgba(255, 255, 255, 0.3);
            --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            --glass-border: 1px solid rgba(255, 255, 255, 0.18);
            --user-message-bg: rgba(0, 122, 255, 0.2);
            --user-message-border: rgba(0, 122, 255, 0.3);
            --assistant-message-bg: rgba(255, 255, 255, 0.1);
            --assistant-message-border: rgba(255, 255, 255, 0.2);
        }

        

        .window-container {
            height: 100vh;
            border-radius: 16px;
            overflow: hidden;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: var(--glass-shadow);
            border: var(--glass-border);
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            border: var(--glass-border);
            background: var(--header-background);
            border-radius: 16px 16px 0 0;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
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
            margin-top: 10px;
            border: var(--glass-border);
            background: var(--main-content-background);
            border-radius: 0 0 16px 16px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
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

        .message-wrapper.transparent .message-bubble {
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(5px);
        }

        .transparency-toggle {
            background: none;
            border: none;
            color: var(--text-color);
            opacity: 0.7;
            cursor: pointer;
            padding: 2px 4px;
            margin-left: 8px;
            font-size: 14px;
            transition: opacity 0.2s;
        }

        .transparency-toggle:hover {
            opacity: 1;
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

        .welcome-message {
            text-align: center;
            padding: 20px;
            opacity: 0.8;
            font-size: 14px;
            line-height: 1.6;
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
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.15);
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
    `;

    static modelsByProvider = {
        google: [
            'gemini-2.0-pro',
            'gemini-2.5-pro',
            'gemini-2.5-pro-preview-05-06',
            'gemini-2.0-flash',
            'gemini-2.5-flash',
            'gemini-2.5-flash-preview-04-17',
            'gemini-2.5-flash-lite-preview-06-17',
            'gemini-2.0-flash-live-001',
        ],
        openai: [
            
            'gpt-4',
            'gpt-4-turbo',
        ],
        anthropic: [
            'claude-3-5-sonnet-20241022',
        ],
        deepseek: [
            'deepseek-chat',
        ],
        openrouter: [
            'anthropic/claude-3.5-sonnet',
        ]
    };

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        startTime: { type: Number },
        isRecording: { type: Boolean },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        selectedLanguage: { type: String },
        selectedProvider: { type: String },
        responses: { type: Array },
        currentResponseIndex: { type: Number },
        streamingResponseText: { type: String },
        isStreamingActive: { type: Boolean },
        isAudioActive: { type: Boolean },
        isScreenActive: { type: Boolean },
        currentTheme: { type: String },
        chatMessages: { type: Array },
        messageTransparency: { type: Boolean, reflect: true },
        selectedModel: { type: String },
        history: { type: Array },
    };

    constructor() {
        super();
        this.currentView = 'main';
        this.statusText = '';
        this.startTime = null;
        // this.isRecording = false; // If unused
        this.sessionActive = false;
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'interview';
        this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en-US';
        this.selectedProvider = localStorage.getItem('selectedProvider') || 'google';
        this.responses = [];
        this.currentResponseIndex = -1;
        this.streamingResponseText = '';
        this.isStreamingActive = false;
        // Initialize new properties
        this.isAudioActive = false;
        this.isScreenActive = false;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.chatMessages = [];
        this.messageTransparency = false;
        this.selectedModel = localStorage.getItem('selectedModel') || '';
        this.history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    }

    saveHistory() {
        if (this.chatMessages.length > 1) { // Don't save empty or welcome-only chats
            const newHistory = [...this.history];
            
            // Add current session to the start of history
            newHistory.unshift({
                messages: this.chatMessages,
                timestamp: new Date().toISOString(),
                provider: this.selectedProvider,
                model: this.selectedModel,
            });

            // Keep only the last 5 sessions
            if (newHistory.length > 5) {
                newHistory.length = 5;
            }
            
            this.history = newHistory;
            localStorage.setItem('chatHistory', JSON.stringify(this.history));
        }
    }
    
    loadSessionFromHistory(index) {
        const session = this.history[index];
        if (session) {
            this.chatMessages = session.messages;
            this.selectedProvider = session.provider;
            this.selectedModel = session.model;
            
            // We are not in an active session, so set these to false
            this.sessionActive = false;
            this.isAudioActive = false;
            this.isScreenActive = false;
            this.startTime = null;
            this.statusText = 'Viewing history';
            
            this.currentView = 'assistant';
        }
    }

    async handleWindowClose() {
        const { ipcRenderer } = window.require('electron');
        await ipcRenderer.invoke('window-close');
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('theme', this.currentTheme);
        // Add event listener for link clicks to open in external browser
        this._linkClickHandler = (event) => {
            // Only handle left-clicks, no modifier keys
            if (event.target && event.target.tagName === 'A' && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                const href = event.target.getAttribute('href');
                if (href && href.startsWith('http')) {
                    event.preventDefault();
                    try {
                        const { shell } = window.require('electron');
                        shell.openExternal(href);
                    } catch (err) {
                        window.open(href, '_blank'); // fallback
                    }
                }
            }
        };
        this.shadowRoot.addEventListener('click', this._linkClickHandler);
    }

    setStatus(t) {
        this.statusText = t;
    }

    // Replace existing setResponse method
    setResponse(data) {
        let responseText;
        let isStreamingChunk = false;
        let isFinalChunkOfStream = false;
        let isCompleteNonStreamed = false;

        if (typeof data === 'object' && data !== null && typeof data.text === 'string') {
            responseText = data.text;
            if (data.isStreaming === true && data.isComplete !== true) {
                isStreamingChunk = true;
            } else if (data.isStreaming === true && data.isComplete === true) {
                isFinalChunkOfStream = true;
            } else if (data.isStreaming === false && data.isComplete === true) {
                isCompleteNonStreamed = true;
            } else if (data.isComplete === true) {
                isCompleteNonStreamed = true;
            }
        } else if (typeof data === 'string') {
            responseText = data;
            isCompleteNonStreamed = true;
        } else {
            console.warn('Unknown data format for setResponse:', data);
            this.requestUpdate();
            return;
        }

        if (isStreamingChunk) {
            // Handle streaming chunks - update existing message or create new one
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    // Update existing streaming message
                    lastMessage.text = responseText;
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Create new streaming message
            this.addChatMessage(responseText, 'assistant', true);
            
        } else if (isFinalChunkOfStream) {
            // Complete the streaming message
            if (this.chatMessages.length > 0) {
                const lastMessage = this.chatMessages[this.chatMessages.length - 1];
                if (lastMessage.sender === 'assistant' && lastMessage.isStreaming) {
                    lastMessage.text = responseText;
                    lastMessage.isStreaming = false;
                    lastMessage.timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    this.responses.push(responseText);
                    this.currentResponseIndex = this.responses.length - 1;
                    this.isStreamingActive = false;
                    this.streamingResponseText = '';
                    this.requestUpdate();
                    this.scrollToBottom(false);
                    return;
                }
            }
            // Fallback: add as complete message
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            this.currentResponseIndex = this.responses.length - 1;
            
        } else if (isCompleteNonStreamed) {
            // Add complete message (non-streaming providers like OpenAI)
            this.addChatMessage(responseText, 'assistant', false);
            this.responses.push(responseText);
            if (this.currentResponseIndex === this.responses.length - 2 || this.currentResponseIndex === -1 || this.responses.length === 1) {
                this.currentResponseIndex = this.responses.length - 1;
            }
        }

        this.requestUpdate();
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
    }

    addChatMessage(text, sender, isStreaming = false) {
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // With column-reverse, new messages appear at the top
        this.chatMessages = [...this.chatMessages, {
            text,
            sender,
            timestamp,
            isStreaming
        }];
        
        if (isStreaming) {
            this.isStreamingActive = true;
            this.streamingResponseText = text;
        }
        
        this.requestUpdate();
        this.scrollToBottom(sender === 'user');
    }

    scrollToBottom(force = false) {
        requestAnimationFrame(() => {
            const container = this.shadowRoot.querySelector('.chat-container');
            if (container) {
                const lastMessage = container.querySelector('.message-wrapper:last-child');
                if (lastMessage) {
                    const isUserScrolledUp = container.scrollTop + container.clientHeight < container.scrollHeight - 150;
                    if (force || !isUserScrolledUp) {
                        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        const { ipcRenderer } = window.require('electron');
        ipcRenderer.removeAllListeners('update-response');
        ipcRenderer.removeAllListeners('update-status');
        if (this.currentView === 'assistant') {
            this.scrollToBottom(false);
        }
        // Remove the link click handler
        if (this._linkClickHandler) {
            this.shadowRoot.removeEventListener('click', this._linkClickHandler);
        }
    }

    handleInput(e, property) {
        localStorage.setItem(property, e.target.value);
    }

    handleProfileSelect(e) {
        this.selectedProfile = e.target.value;
        localStorage.setItem('selectedProfile', this.selectedProfile);
    }

    handleLanguageSelect(e) {
        this.selectedLanguage = e.target.value;
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
    }

    handleProviderSelect(e) {
        this.selectedProvider = e.target.value;
        localStorage.setItem('selectedProvider', this.selectedProvider);
        // Reset model when provider changes
        this.selectedModel = '';
        localStorage.setItem('selectedModel', '');
    }

    async handleStartSession() {
        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
        buddy.startCapture();
        this.sessionActive = true;
        this.isAudioActive = true; // Audio starts active
        this.isScreenActive = true; // Screen starts active
        this.startTime = Date.now();
        this.statusText = 'Starting...';
    }

    async handleEndSession() {
        if (this.sessionActive) {
            this.saveHistory();
            buddy.stopCapture();
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('close-session');
            this.sessionActive = false;
            this.isAudioActive = false;
            this.isScreenActive = false;
            this.statusText = 'Stop';
        }
    }

    async handleStart() { // This is the main "Start Session" from the main view
        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage, this.selectedModel);
        buddy.startCapture();
        this.responses = [];
        this.currentResponseIndex = -1;
        this.chatMessages = []; // Clear chat messages
        this.currentView = 'assistant';
        this.sessionActive = true;
        this.isAudioActive = true; // Audio starts active
        this.isScreenActive = true; // Screen starts active
        this.startTime = Date.now();
        
        // Add welcome message to chat
       
        
        const welcomeText = `Hi, How Can I Help You`;
        this.addChatMessage(welcomeText, 'assistant');
    }

    async handleClose() {
        if (this.currentView === 'customize' || this.currentView === 'help' || this.currentView === 'history') {
            this.currentView = 'main';
        } else if (this.currentView === 'assistant') {
            if (this.sessionActive) {
                await this.handleEndSession(); // This will set isAudioActive/isScreenActive to false
            }
            this.currentView = 'main';
        } else {
            // Quit the entire application
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('quit-application');
        }
    }

    async handleRestart() {
        if (this.sessionActive) {
            this.saveHistory();
            buddy.stopCapture();
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('close-session');
        }

        this.responses = [];
        this.currentResponseIndex = -1;
        this.chatMessages = []; // Clear chat messages
        this.sessionActive = false; // Will be set to true by startCapture logic below
        this.isAudioActive = false; // Reset before starting
        this.isScreenActive = false; // Reset before starting
        this.statusText = 'Restarting...';

        await buddy.initializeAI(this.selectedProvider, this.selectedProfile, this.selectedLanguage);
        buddy.startCapture();
        this.sessionActive = true;
        this.isAudioActive = true;
        this.isScreenActive = true;
        
        // Add welcome message to restarted chat
       
        
        const welcomeText = `Hi, how can I help you?`;
        this.addChatMessage(welcomeText, 'assistant');
    }

    // --- New Toggle Handlers ---
    async toggleAudioCapture() {
        if (!this.sessionActive) return;
        this.isAudioActive = !this.isAudioActive;
        if (this.isAudioActive) {
            await buddy.resumeAudio();
            this.statusText = this.statusText.replace(/Audio Paused/, 'Listening').trim();
        } else {
            await buddy.pauseAudio();
            this.statusText = (this.statusText.includes('Listening') ? this.statusText.replace(/Listening/, 'Audio Paused') : 'Audio Paused');
        }
        this.requestUpdate();
    }

    async toggleScreenCapture() {
        if (!this.sessionActive) return;
        this.isScreenActive = !this.isScreenActive;
        if (this.isScreenActive) {
            await buddy.resumeScreen();
            this.statusText = this.statusText.replace(/Screen Paused/, 'Viewing').trim();
        } else {
            await buddy.pauseScreen();
            this.statusText = (this.statusText.includes('Viewing') ? this.statusText.replace(/Viewing/, 'Screen Paused') : 'Screen Paused');
        }
        this.requestUpdate();
    }
    // --- End New Toggle Handlers ---

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ;
        localStorage.setItem('theme', this.currentTheme);
        this.setAttribute('theme', this.currentTheme);
        this.requestUpdate();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        
        // Notify main process of view change
        if (changedProperties.has('currentView')) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('view-changed', this.currentView);
            
            // If we're entering the chat view, scroll to the bottom
            if (this.currentView === 'assistant') {
                this.scrollToBottom(true);
            }
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        if (textInput && textInput.value.trim()) {
            const message = textInput.value.trim();
            
            // Add user message and immediately scroll to it
            this.addChatMessage(message, 'user');
            await this.scrollToUserMessage();
            
            // Send message and continue with normal flow
            const result = await buddy.sendTextMessage(message);
            textInput.value = '';

            if (!result.success) {
                console.error('Failed to send message:', result.error);
                this.setStatus('Error sending message: ' + result.error);
                // Add error message to chat
                this.addChatMessage(' error sending your message.', 'assistant');
            } else {
                this.setStatus('sending...');
            }

            if (textInput.matches('textarea')) {
                this.handleTextInputResize({ target: textInput });
            }
        }
    }

    // Add new method for user message scrolling
    async scrollToUserMessage() {
        await new Promise(resolve => requestAnimationFrame(resolve));
        const container = this.shadowRoot.querySelector('.chat-container');
        const lastMessage = this.shadowRoot.querySelector('.message-wrapper:last-child');
        
        if (container && lastMessage) {
            const scrollTarget = lastMessage.offsetTop - container.clientHeight + lastMessage.clientHeight + 100;
            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
        // For Shift+Enter, textarea will handle newline by default
    }

    handleTextInputResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight

        const computedStyle = getComputedStyle(textarea);
        const maxHeightStyle = computedStyle.maxHeight;
        const maxHeight = maxHeightStyle.endsWith('px') ? parseFloat(maxHeightStyle) : Number.MAX_SAFE_INTEGER;

        if (textarea.scrollHeight <= maxHeight) {
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto'; // This enables the internal scrollbar
        }
    }

    renderHeader() {
        const titles = {
            main: 'Buddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            assistant: 'Buddy',
        };

        let elapsedTime = '';
        if (this.currentView === 'assistant' && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            elapsedTime = `${elapsed}s`;
        }

        const isLive = this.sessionActive && (this.statusText.includes('Listening') || this.statusText.includes('Processing'));
        const statusIndicator = isLive ? 'status-live' : 'status-idle';

        // Model dropdown for header
        let allModels = [];
        let modelsByProvider = BuddyApp.modelsByProvider;
        allModels = Object.entries(modelsByProvider).flatMap(([provider, models]) =>
            models.map(model => ({ provider, model }))
        );
        const currentProviderModels = allModels.filter(m => m.provider === this.selectedProvider);
        const otherProviderModels = allModels.filter(m => m.provider !== this.selectedProvider);
        const groupedModels = [...currentProviderModels, ...otherProviderModels];
        if (!this.selectedModel && groupedModels.length > 0) {
            this.selectedModel = groupedModels[0].model;
            this.selectedProvider = groupedModels[0].provider;
            localStorage.setItem('selectedModel', this.selectedModel);
            localStorage.setItem('selectedProvider', this.selectedProvider);
        }

        // Handler for model select in header
        const handleHeaderModelSelect = (e) => {
            const selected = e.target.value;
            const found = allModels.find(m => m.model === selected);
            if (found) {
                this.selectedModel = found.model;
                this.selectedProvider = found.provider;
                localStorage.setItem('selectedModel', this.selectedModel);
                localStorage.setItem('selectedProvider', this.selectedProvider);
                this.requestUpdate();
            }
        };

        return html`
            <div class="header">
                <div class="header-title" style="display: flex; align-items: center; gap: 8px; -webkit-app-region: drag;">
                    ${titles[this.currentView]}
                    <select 
                        title="Change AI model" 
                        style="
                            -webkit-app-region: no-drag;
                            margin-left: 6px; 
                            min-width: 120px; 
                            max-width: 180px; 
                            font-size: 13px; 
                            padding: 4px 8px; 
                            border-radius: 6px; 
                            background: oklch(14.7% 0.004 49.25); 
                            color: var(--text-color); 
                            border: var(--glass-border);
                            cursor: pointer;
                            z-index: 1000;
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            max-height: 220px;
                            overflow-y: auto;
                        " 
                        .value=${this.selectedModel} 
                        @change=${handleHeaderModelSelect}
                        @click=${(e) => {
                            e.stopPropagation();
                            console.log('Dropdown clicked');
                        }}
                    >
                        ${Object.entries(modelsByProvider).map(([provider, models]) => [
                            html`<optgroup label="${provider.charAt(0).toUpperCase() + provider.slice(1)}">`,
                            models.map(model => html`<option value=${model} ?selected=${this.selectedModel === model}>${model}</option>`),
                            html`</optgroup>`
                        ])}
                    </select>
                </div>
                <div class="header-actions">
                    ${this.currentView === 'assistant'
                        ? html`
                              <span>${elapsedTime}</span>
                              <div class="status-container">
                                  <span class="status-indicator ${statusIndicator}"></span>
                                  ${this.sessionActive
                                      ? html`
                                            <button class="session-button end" @click=${this.handleEndSession} title="End Session">
                                                ■ End
                                            </button>
                                            <button 
                                                class="icon-button" 
                                                @click=${this.toggleAudioCapture} 
                                                title=${this.isAudioActive ? 'Pause Audio Listening' : 'Resume Audio Listening'}
                                                style="color: ${this.isAudioActive ? 'var(--text-color)' : '#f36a6a'}; font-size: 16px; font-weight: bold;"
                                            >
                                                A
                                            </button>
                                            <button 
                                                class="icon-button" 
                                                @click=${this.toggleScreenCapture} 
                                                title=${this.isScreenActive ? 'Pause Screen Viewing' : 'Resume Screen Viewing'}
                                                style="color: ${this.isScreenActive ? 'var(--text-color)' : '#f36a6a'}; font-size: 16px; font-weight: bold;"
                                            >
                                                I
                                            </button>
                                        `
                                      : html`
                                            <button class="session-button start" @click=${this.handleStartSession} title="Start Session">
                                                ▶ Start
                                            </button>
                                        `}
                              </div>
                              <span style="min-width: 50px; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.statusText}</span>
                          `
                        : ''}
                    ${this.currentView === 'main'
                        ? html`
                              <button class="icon-button" @click=${() => (this.currentView = 'history')}>
                                  <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 6v6h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22a9.99999 9.99999 0 0 1-9.42-7.11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.5492 14.3313A9.99999 9.99999 0 0 1 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2c5.4578 0 9.8787 4.3676 9.9958 9.794" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                              </button>
                              <button class="icon-button" @click=${() => (this.currentView = 'customize')}>
                                  <?xml version="1.0" encoding="UTF-8"?><svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                              <button class="icon-button" @click=${()=>(this.currentView = 'help')}>
                                  <?xml version="1.0" encoding="UTF-8"?><svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                      <path
                                          d="M12 18.01L12.01 17.9989"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                          `
                        : ''}
                    ${this.currentView === 'assistant'
                        ? html`
                              <button @click=${this.handleClose} class="button window-close">
                                  Back
                              </button>
                             
                          `
                        : html`
                              <button @click=${this.handleClose} class="icon-button window-close">
                                  <?xml version="1.0" encoding="UTF-8"?><svg
                                      width="24px"
                                      height="24px"
                                      stroke-width="1.7"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      color="currentColor"
                                  >
                                      <path
                                          d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                                          stroke="currentColor"
                                          stroke-width="1.7"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                      ></path>
                                  </svg>
                              </button>
                          `}
                </div>
            </div>
        `;
    }

    renderMainView() {
        const providers = [
            { value: 'google', name: 'Google Gemini', keyLabel: 'Gemini API Key' },
            { value: 'openai', name: 'OpenAI', keyLabel: 'OpenAI API Key' },
            { value: 'anthropic', name: 'Anthropic Claude', keyLabel: 'Anthropic API Key' },
            { value: 'deepseek', name: 'DeepSeek', keyLabel: 'DeepSeek API Key' },
            { value: 'openrouter', name: 'OpenRouter', keyLabel: 'OpenRouter API Key' },
        ];
        const currentProvider = providers.find(p => p.value === this.selectedProvider);
        let models = [];
        try {
            models = require('./models.js')[this.selectedProvider] || [];
        } catch (e) {
            models = [];
        }
        // If no model selected, pick the first as default
        if (!this.selectedModel && models.length > 0) {
            this.selectedModel = models[0];
            localStorage.setItem('selectedModel', this.selectedModel);
        }
        return html`
            <div class="main-view-container">
                <div class="welcome">Welcome to Buddy</div>
                <div class="option-group" >
                    <label class="option-label">Select AI Provider</label>
                    <select .value=${this.selectedProvider} @change=${this.handleProviderSelect} >
                        ${providers.map(
                            provider => html`
                                <option value=${provider.value} ?selected=${this.selectedProvider === provider.value}>${provider.name}</option>
                            `
                        )}
                    </select>
                    <div class="provider-help-text">Choose your preferred AI service provider</div>
                </div>
                <div class="option-group">
                    <label class="option-label">Select Model</label>
                    <select .value=${this.selectedModel} @change=${this.handleModelSelect}>
                        ${models.map(
                            model => html`
                                <option value=${model} ?selected=${this.selectedModel === model}>${model}</option>
                            `
                        )}
                    </select>
                    <div class="provider-help-text">Choose a model for the selected provider</div>
                </div>
                <div class="api-input-section">
                    <div class="option-group">
                        <label class="option-label">${currentProvider?.keyLabel || 'API Key'}</label>
                        <div class="input-group">
                            <input
                                type="password"
                                placeholder="Enter your ${currentProvider?.keyLabel || 'API Key'}"
                                .value=${localStorage.getItem(`apiKey_${this.selectedProvider}`) || ''}
                                @input=${e => this.handleInput(e, `apiKey_${this.selectedProvider}`)}
                            />
                            <button @click=${this.handleStart} class="button start-button" style="font-size: 15px">Start Session</button>
                        </div>
                        <div class="description">
                            Don't have an API key? Go to <a href="https://aistudio.google.com" target="_blank">Google AI Studio</a>.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCustomizeView() {
        const profiles = [
            {
                value: 'general',
                name: 'General Assistant',
                description: 'Ask anything - general knowledge, problem solving, creative tasks, and more',
            },
            {
                value: 'interview',
                name: 'Job Interview',
                description: 'Get help with answering interview questions',
            },
            {
                value: 'sales',
                name: 'Sales Call',
                description: 'Assist with sales conversations and objection handling',
            },
            {
                value: 'meeting',
                name: 'Business Meeting',
                description: 'Support for professional meetings and discussions',
            },
            {
                value: 'presentation',
                name: 'Presentation',
                description: 'Help with presentations and public speaking',
            },
            {
                value: 'negotiation',
                name: 'Negotiation',
                description: 'Guidance for business negotiations and deals',
            },
            {
                value: 'teacher',
                name: 'JEE Advanced Teacher',
                description: 'Educational explanations and teaching for JEE Advanced topics',
            },
        ];

        const languages = [
            { value: 'en-US', name: 'English (US)' },
            { value: 'en-GB', name: 'English (UK)' },
            { value: 'en-AU', name: 'English (Australia)' },
            { value: 'en-IN', name: 'English (India)' },
            { value: 'de-DE', name: 'German (Germany)' },
            { value: 'es-US', name: 'Spanish (United States)' },
            { value: 'es-ES', name: 'Spanish (Spain)' },
            { value: 'fr-FR', name: 'French (France)' },
            { value: 'fr-CA', name: 'French (Canada)' },
            { value: 'hi-IN', name: 'Hindi (India)' },
            { value: 'pt-BR', name: 'Portuguese (Brazil)' },
            { value: 'ar-XA', name: 'Arabic (Generic)' },
            { value: 'id-ID', name: 'Indonesian (Indonesia)' },
            { value: 'it-IT', name: 'Italian (Italy)' },
            { value: 'ja-JP', name: 'Japanese (Japan)' },
            { value: 'tr-TR', name: 'Turkish (Turkey)' },
            { value: 'vi-VN', name: 'Vietnamese (Vietnam)' },
            { value: 'bn-IN', name: 'Bengali (India)' },
            { value: 'gu-IN', name: 'Gujarati (India)' },
            { value: 'kn-IN', name: 'Kannada (India)' },
            { value: 'ml-IN', name: 'Malayalam (India)' },
            { value: 'mr-IN', name: 'Marathi (India)' },
            { value: 'ta-IN', name: 'Tamil (India)' },
            { value: 'te-IN', name: 'Telugu (India)' },
            { value: 'nl-NL', name: 'Dutch (Netherlands)' },
            { value: 'ko-KR', name: 'Korean (South Korea)' },
            { value: 'cmn-CN', name: 'Mandarin Chinese (China)' },
            { value: 'pl-PL', name: 'Polish (Poland)' },
            { value: 'ru-RU', name: 'Russian (Russia)' },
            { value: 'th-TH', name: 'Thai (Thailand)' },
        ];

        const profileNames = {
            general: 'General Assistant',
            interview: 'Job Interview',
            sales: 'Sales Call',
            meeting: 'Business Meeting',
            presentation: 'Presentation',
            negotiation: 'Negotiation',
            teacher: 'JEE Advanced Teacher',
        };

        return html`
            <div>
                <div class="option-group">
                    <label class="option-label">Select Profile</label>
                    <select .value=${this.selectedProfile} @change=${this.handleProfileSelect}>
                        ${profiles.map(
                            profile => html`
                                <option value=${profile.value} ?selected=${this.selectedProfile === profile.value}>${profile.name}</option>
                            `
                        )}
                    </select>
                    <div class="description">${profiles.find(p => p.value === this.selectedProfile)?.description || ''}</div>
                </div>

                <div class="option-group">
                    <label class="option-label">Select Language</label>
                    <select .value=${this.selectedLanguage} @change=${this.handleLanguageSelect}>
                        ${languages.map(
                            language => html`
                                <option value=${language.value} ?selected=${this.selectedLanguage === language.value}>${language.name}</option>
                            `
                        )}
                    </select>
                    <div class="description">Choose the language for speech recognition and AI responses.</div>
                </div>

                <div class="option-group">
                    <span class="option-label">AI Behavior for ${profileNames[this.selectedProfile] || 'Selected Profile'}</span>
                    <textarea
                        placeholder="Describe how you want the AI to behave..."
                        .value=${localStorage.getItem('customPrompt') || ''}
                        class="custom-prompt-textarea"
                        rows="4"
                        @input=${e => this.handleInput(e, 'customPrompt')}
                    ></textarea>
                    <div class="description">
                        This custom prompt will be added to the ${profileNames[this.selectedProfile] || 'selected profile'} instructions to
                        personalize the AI's behavior.
                    </div>
                </div>
            </div>
        `;
    }

    renderHelpView() {
        return html`
            <div>
                <div class="option-group">
                    <span class="option-label">Community & Support</span>
                </div>

                <div class="option-group">
                    <span class="option-label">Keyboard Shortcuts</span>
                    <div class="description">
                        <strong>Window Movement:</strong><br />
                        <span class="key">${buddy.isMacOS ? 'Option' : 'Ctrl'}</span> + Arrow Keys - Move the window in 45px increments<br /><br />

                        <strong>Window Control:</strong><br />
                        <span class="key">${buddy.isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">M</span> - Toggle mouse events (click-through
                        mode)<br />
                        <span class="key">${buddy.isMacOS ? 'Cmd' : 'Ctrl'}</span> + <span class="key">&bsol;</span> - Close window or go back<br /><br />

                        <strong>Text Input:</strong><br />
                        <span class="key">Enter</span> - Send text message to AI<br />
                        <span class="key">Shift</span> + <span class="key">Enter</span> - New line in text input
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">How to Use</span>
                    <div class="description">
                        1. <strong>Start a Session:</strong> Enter your Gemini API key and click "Start Session"<br />
                        2. <strong>Customize:</strong> Choose your profile and language in the settings<br />
                        3. <strong>Position Window:</strong> Use keyboard shortcuts to move the window to your desired location<br />
                        4. <strong>Click-through Mode:</strong> Use <span class="key">${buddy.isMacOS ? 'Cmd' : 'Ctrl'}</span> +
                        <span class="key">M</span> to make the window click-through<br />
                        5. <strong>Get AI Help:</strong> The AI will analyze your screen and audio to provide assistance<br />
                        6. <strong>Text Messages:</strong> Type questions or requests to the AI using the text input
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Supported Profiles</span>
                    <div class="description">
                        <strong>General Assistant:</strong> Ask anything - general knowledge, problem solving, creative tasks<br />
                        <strong>Job Interview:</strong> Get help with interview questions and responses<br />
                        <strong>Sales Call:</strong> Assistance with sales conversations and objection handling<br />
                        <strong>Business Meeting:</strong> Support for professional meetings and discussions<br />
                        <strong>Presentation:</strong> Help with presentations and public speaking<br />
                        <strong>Negotiation:</strong> Guidance for business negotiations and deals<br />
                        <strong>JEE Advanced Teacher:</strong> Educational explanations and teaching for JEE Advanced topics
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Audio Input</span>
                    <div class="description">
                        ${buddy.isMacOS 
                            ? html`<strong>macOS:</strong> Uses SystemAudioDump for system audio capture`
                            : buddy.isLinux
                              ? html`<strong>Linux:</strong> Uses microphone input`
                              : html`<strong>Windows:</strong> Uses loopback audio capture`}<br />
                        The AI listens to conversations and provides contextual assistance based on what it hears.
                    </div>
                </div>
            </div>
        `;
    }

    renderAssistantView() {
        return html`
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div class="chat-container">
                    ${this.chatMessages.length === 0 
                        ? html`
                            <div class="welcome-message">
                                <p>Welcome! Start a session to begin chatting with your AI assistant.</p>
                            </div>
                          `
                        : this.chatMessages.map((message, idx) => html`
                            <div class="message-wrapper ${message.sender} ${this.messageTransparency ? 'transparent' : ''}">
                                <div class="message-bubble ${message.sender}">
                                    <div class="message-content">
                                        ${message.sender === 'assistant' 
                                            ? html`<div .innerHTML="${this.renderMarkdown(message.text)}"></div>`
                                            : html`<div>${message.text}</div>`
                                        }
                                        ${message.isStreaming ? html`
                                            <div class="typing-indicator">
                                                <div class="typing-dot"></div>
                                                <div class="typing-dot"></div>
                                                <div class="typing-dot"></div>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="message-time">
                                        ${message.isStreaming ? 'typing...' : message.timestamp}
                                        <button 
                                            class="transparency-toggle"
                                            @click=${this.toggleMessageTransparency}
                                            title=${this.messageTransparency ? 'Make messages opaque' : 'Make messages transparent'}
                                        >
                                            ${this.messageTransparency ? '🔲' : '🔳'}
                                        </button>
                                        <button 
                                            class="delete-button"
                                            @click=${() => this.deleteMessage(idx)}
                                            title="Delete message"
                                            style="background: transparent; border: none; color: var(--text-color); opacity: 0.6; cursor: pointer; padding: 2px 4px; border-radius: 4px; margin-left: 4px;"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path></svg>
                                        </button>
                                        <button 
                                            class="copy-button"
                                            @click=${() => this.copyMessageText(message)}
                                            title="Copy message"
                                            style="background: transparent; border: none; color: var(--text-color); opacity: 0.6; cursor: pointer; padding: 2px 4px; border-radius: 4px; margin-left: 4px;"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                          `)
                    }
                </div>

                <div class="text-input-container">
                    <textarea
                        id="textInput"
                        rows="1"
                        placeholder="Ask me anything..."
                        @keydown=${this.handleTextKeydown}
                        @input=${this.handleTextInputResize}
                    ></textarea>
                    <button
                        class="send-btn"
                        @click=${this.handleSendText}
                        title="Send message"
                        ?disabled=${this.isStreamingActive}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-big-up-icon lucide-arrow-big-up"><path d="M9 18v-6H5l7-7 7 7h-4v6H9z"/></svg>
                    </button>
                </div>
            </div>
        `;
    }

    renderMarkdown(text) {
        if (!text) return '';
        
        try {
            // Enhanced markdown processing for Google LLM output
            let processedText = text;
            
            // Handle Google LLM specific patterns - but be more careful about what we process
            // Only process actual markdown patterns, not regular text
            
            // Handle numbered lists that might not be properly formatted
            processedText = processedText.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');
            
            // Handle bullet points that might use different characters
            processedText = processedText.replace(/^[•·▪▫‣⁃]\s+(.+)$/gm, '- $1');
            
            // Handle math equations (LaTeX style)
            // Block math equations: $$...$$
            processedText = processedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
                const formattedEquation = this.formatMathEquation(equation.trim());
                return `<div class="math-equation">${formattedEquation}</div>`;
            });
            
            // Inline math equations: $...$
            processedText = processedText.replace(/\$([^$\n]+?)\$/g, (match, equation) => {
                const formattedEquation = this.formatMathEquation(equation.trim());
                return `<span class="math-equation inline">${formattedEquation}</span>`;
            });
            
            // Enhanced code block processing
            processedText = processedText.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, code) => {
                const lang = language || 'text';
                return `
                    <div class="code-block-container">
                        <div class="code-language-label">${lang}</div>
                        <pre><code class="language-${lang}">${this.escapeHtml(code.trim())}</code></pre>
                    </div>
                `;
            });
            
            // Configure marked.js with more careful highlighting
            if (window.marked && window.hljs) {
                window.marked.setOptions({
                    highlight: function(code, lang) {
                        // Only highlight if we have a specific language or if it looks like code
                        if (lang && window.hljs.getLanguage(lang)) {
                            try {
                                return window.hljs.highlight(code, { language: lang }).value;
                            } catch (err) {
                                console.warn('Highlight.js error:', err);
                                return code;
                            }
                        }
                        // Don't auto-highlight everything - only if it really looks like code
                        if (this.looksLikeCode(code)) {
                            try {
                                return window.hljs.highlightAuto(code).value;
                            } catch (err) {
                                return code;
                            }
                        }
                        return code;
                    }.bind(this),
                    breaks: true,
                    gfm: true,
                    sanitize: false
                });
            }
            
            // Use marked.js to parse the remaining markdown
            const html = window.marked.parse(processedText);
            
            // Post-process the HTML to add additional enhancements
            const enhancedHtml = this.enhanceRenderedContent(html);
            
            // Apply final content organization
            return this.organizeContent(enhancedHtml);
            
        } catch (error) {
            console.error('Error parsing markdown:', error);
            // Fallback to plain text with line breaks
            return text.replace(/\n/g, '<br>');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    looksLikeCode(text) {
        // More intelligent code detection
        const codeIndicators = [
            /function\s*\(/,           // function declarations
            /\w+\s*=\s*\w+/,          // assignments
            /import\s+\w+/,           // imports
            /from\s+['"][^'"]+['"]/,  // from imports
            /class\s+\w+/,            // class declarations
            /def\s+\w+\(/,            // Python functions
            /console\.(log|error)/,   // console statements
            /\w+\.\w+\(/,             // method calls
            /if\s*\(/,                // if statements
            /for\s*\(/,               // for loops
            /while\s*\(/,             // while loops
            /\{[\s\S]*\}/,            // code blocks with braces
            /\w+\[\d+\]/,             // array access
            /\/\*[\s\S]*?\*\//,       // block comments
            /\/\/.*$/m,               // line comments
            /#.*$/m,                  // Python/shell comments
            /\$\w+/,                  // variables with $
            /<\w+[^>]*>/,             // HTML tags
            /\w+:\s*\w+/,             // key-value pairs
        ];
        
        // Check if text has multiple code indicators
        const matches = codeIndicators.filter(pattern => pattern.test(text));
        
        // Also check for common code patterns
        const hasCodeStructure = (
            text.includes(';') && text.includes('(') && text.includes(')') ||
            text.includes('{') && text.includes('}') ||
            text.includes('[') && text.includes(']') ||
            text.split('\n').length > 3 && /^\s+/.test(text) // indented multi-line
        );
        
        // Don't treat regular sentences as code
        const looksLikeNaturalLanguage = (
            /^[A-Z][a-z\s,.'!?]+[.!?]$/.test(text.trim()) ||
            text.split(' ').length > 10 && !/[{}();]/.test(text)
        );
        
        return (matches.length >= 2 || hasCodeStructure) && !looksLikeNaturalLanguage;
    }
    
    formatMathEquation(equation) {
        // Basic LaTeX-like formatting for common mathematical expressions
        let formatted = equation;
        
        // Replace common LaTeX commands with HTML/Unicode equivalents
        const replacements = {
            // Greek letters
            '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
            '\\epsilon': 'ε', '\\theta': 'θ', '\\lambda': 'λ', '\\mu': 'μ',
            '\\pi': 'π', '\\sigma': 'σ', '\\phi': 'φ', '\\omega': 'ω',
            '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ',
            '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Phi': 'Φ', '\\Omega': 'Ω',
            
            // Mathematical operators
            '\\pm': '±', '\\mp': '∓', '\\times': '×', '\\div': '÷',
            '\\cdot': '·', '\\ast': '∗', '\\star': '⋆',
            '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
            '\\equiv': '≡', '\\sim': '∼', '\\propto': '∝',
            '\\infty': '∞', '\\partial': '∂', '\\nabla': '∇',
            '\\sum': '∑', '\\prod': '∏', '\\int': '∫',
            '\\sqrt': '√', '\\angle': '∠', '\\degree': '°',
            
            // Arrows
            '\\rightarrow': '→', '\\leftarrow': '←', '\\leftrightarrow': '↔',
            '\\Rightarrow': '⇒', '\\Leftarrow': '⇐', '\\Leftrightarrow': '⇔',
            
            // Set theory
            '\\in': '∈', '\\notin': '∉', '\\subset': '⊂', '\\supset': '⊃',
            '\\subseteq': '⊆', '\\supseteq': '⊇', '\\cup': '∪', '\\cap': '∩',
            '\\emptyset': '∅', '\\forall': '∀', '\\exists': '∃',
        };
        
        // Apply replacements
        for (const [latex, unicode] of Object.entries(replacements)) {
            formatted = formatted.replace(new RegExp(latex.replace('\\', '\\\\'), 'g'), unicode);
        }
        
        // Handle fractions: \frac{a}{b} -> a/b with styling
        formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, 
            '<span class="fraction"><span class="numerator">$1</span><span class="fraction-bar">/</span><span class="denominator">$2</span></span>');
        
        // Handle superscripts: ^{...} or ^x
        formatted = formatted.replace(/\^(\{[^}]+\}|\w)/g, (match, exp) => {
            const cleanExp = exp.replace(/[{}]/g, '');
            return `<sup>${cleanExp}</sup>`;
        });
        
        // Handle subscripts: _{...} or _x
        formatted = formatted.replace(/_(\{[^}]+\}|\w)/g, (match, sub) => {
            const cleanSub = sub.replace(/[{}]/g, '');
            return `<sub>${cleanSub}</sub>`;
        });
        
        // Handle square roots: \sqrt{...}
        formatted = formatted.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
        
        return formatted;
    }
    
    enhanceRenderedContent(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Process code blocks
        const codeBlocks = tempDiv.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            if (!codeBlock.id) {
                const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
                codeBlock.id = codeId;
                
                const pre = codeBlock.parentElement;
                if (pre && !pre.parentElement.classList.contains('code-block-container')) {
                    const container = document.createElement('div');
                    container.className = 'code-block-container';
                    
                    pre.parentElement.insertBefore(container, pre);
                    container.appendChild(pre);
                }
            }
        });
        
        return tempDiv.innerHTML;
    }
    
    organizeContent(html) {
        // Create better organized content sections
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Create a new organized structure
        const organizedDiv = document.createElement('div');
        organizedDiv.className = 'organized-content';
        
        const children = Array.from(tempDiv.childNodes);
        let currentSection = null;
        let currentSectionType = null;
        
        children.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '') {
                return; // Skip empty text nodes
            }
            
            let sectionType = this.determineSectionType(child);
            
            // If section type changed or we don't have a current section
            if (sectionType !== currentSectionType || !currentSection) {
                // Finish current section
                if (currentSection) {
                    organizedDiv.appendChild(currentSection);
                }
                
                // Start new section
                currentSection = document.createElement('div');
                currentSection.className = `content-section ${sectionType}-section`;
                currentSectionType = sectionType;
                
                // Add section header for better organization
                if (sectionType === 'code') {
                    const header = document.createElement('div');
                    header.className = 'section-header';
                    header.innerHTML = '<span class="section-title">Code</span>';
                    currentSection.appendChild(header);
                } else if (sectionType === 'math') {
                    const header = document.createElement('div');
                    header.className = 'section-header';
                    header.innerHTML = '<span class="section-title">Mathematics</span>';
                    currentSection.appendChild(header);
                }
            }
            
            // Add content to current section
            if (child.nodeType === Node.ELEMENT_NODE) {
                currentSection.appendChild(child.cloneNode(true));
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                const textWrapper = document.createElement('div');
                textWrapper.className = 'text-content';
                textWrapper.textContent = child.textContent;
                currentSection.appendChild(textWrapper);
            }
        });
        
        // Add final section
        if (currentSection) {
            organizedDiv.appendChild(currentSection);
        }
        
        return organizedDiv.innerHTML;
    }
    
    determineSectionType(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return 'text';
        }
        
        // Check for code-related elements
        if (element.classList.contains('code-block-container') || 
            element.tagName === 'PRE' || 
            (element.tagName === 'CODE' && element.parentElement.tagName === 'PRE')) {
            return 'code';
        }
        
        // Check for math elements
        if (element.classList.contains('math-equation')) {
            return 'math';
        }
        
        // Check for tables
        if (element.tagName === 'TABLE') {
            return 'table';
        }
        
        // Check for lists
        if (element.tagName === 'UL' || element.tagName === 'OL') {
            return 'list';
        }
        
        // Check for headings
        if (/^H[1-6]$/.test(element.tagName)) {
            return 'heading';
        }
        
        // Default to text
        return 'text';
    }

    navigateToPreviousResponse() {
        if (this.currentResponseIndex > 0) {
            this.currentResponseIndex--;
        }
    }

    navigateToNextResponse() {
        if (this.currentResponseIndex < this.responses.length - 1) {
            this.currentResponseIndex++;
        }
    }

    toggleMessageTransparency() {
        this.messageTransparency = !this.messageTransparency;
    }

    // Add this method to handle message deletion
    deleteMessage(index) {
        this.chatMessages = this.chatMessages.filter((_, i) => i !== index);
        this.requestUpdate();
    }

    // Add this method to handle copying message text
    async copyMessageText(message) {
        let textToCopy = '';
        if (message.sender === 'assistant') {
            // Copy the original markdown text if available, else fallback to rendered text
            textToCopy = message.text;
        } else {
            textToCopy = message.text;
        }
        try {
            await navigator.clipboard.writeText(textToCopy);
        } catch (err) {
            alert('Failed to copy text');
        }
    }

    handleModelSelect(e) {
        this.selectedModel = e.target.value;
        localStorage.setItem('selectedModel', this.selectedModel);
    }

    renderHistoryView() {
        if (!this.history || this.history.length === 0) {
            return html`
                <div class="welcome-message">
                    <p>No chat history yet.</p>
                    <p>Your past conversations will appear here.</p>
                </div>
            `;
        }

        return html`
            <div class="history-container">
                ${this.history.map((session, index) => html`
                    <div class="history-item" @click=${() => this.loadSessionFromHistory(index)}>
                        <div class="history-item-header">
                            <span class="history-item-model">${session.model} (${session.provider})</span>
                            <span class="history-item-time">${new Date(session.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="history-item-preview">
                            ${session.messages[1] ? session.messages[1].text.substring(0, 100) + '...' : 'No messages'}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    render() {
        const views = {
            main: this.renderMainView(),
            customize: this.renderCustomizeView(),
            help: this.renderHelpView(),
            history: this.renderHistoryView(),
            assistant: this.renderAssistantView(),
        };

        return html`
            <div class="window-container">
                <div class="container">
                    ${this.renderHeader()}
                    <div class="main-content">${views[this.currentView]}</div>
                </div>
            </div>
        `;
    }
}

customElements.define('buddy-app', BuddyApp);
