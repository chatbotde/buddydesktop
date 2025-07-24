import { css } from '../../lit-core-2.7.4.min.js';

export const chatMessageStyles = css`
        :host { 
            display: block; 
            margin: 0;
            width: 100%;
        }
        
        .message-wrapper {
            display: flex;
            width: 100%;
            position: relative;
            align-items: flex-start;
            gap: 0;
            padding: 16px 0;
            background: transparent;
            transition: background-color 0.2s ease;
        }

        .message-wrapper:hover {
            background: rgba(255, 255, 255, 0.02);
        }
        
        .message-wrapper.user {
            justify-content: center;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.02);
        }

        .message-wrapper.user:hover {
            background: rgba(255, 255, 255, 0.04);
        }
        
        .message-wrapper.assistant {
            justify-content: center;
            flex-direction: column;
            background: transparent;
        }

        /* Message actions container - ChatGPT style */
        .message-actions {
            display: flex;
            flex-direction: row;
            gap: 8px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            position: absolute;
            right: 24px;
            top: 8px;
            z-index: 10;
        }

        .message-wrapper:hover .message-actions {
            opacity: 1;
            visibility: visible;
        }

        .message-wrapper.user .message-actions {
            right: 24px;
            top: 8px;
        }

        .message-wrapper.assistant .message-actions {
            right: 24px;
            top: 8px;
        }

        /* Copy button for message content */
        .message-copy-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            height: 28px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            position: absolute;
            right: 24px;
            top: 8px;
            z-index: 10;
        }

        .message-wrapper:hover .message-copy-btn {
            opacity: 1;
            visibility: visible;
        }
        
        .message-copy-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
        }

        .message-copy-btn:active {
            background: rgba(255, 255, 255, 0.2);
        }

        .message-copy-btn svg {
            width: 16px;
            height: 16px;
        }

        /* Copy success feedback */
        .message-copy-btn.copied {
            background: rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.3);
            color: #4ade80;
        }

        .message-copy-btn.copied:hover {
            background: rgba(34, 197, 94, 0.25);
            border-color: rgba(34, 197, 94, 0.4);
        }
        
        .message-bubble {
            max-width: 100%;
            width: 100%;
            padding: 0;
            border-radius: 0;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            position: relative;
            display: flex;
            flex-direction: column;
            background: transparent;
            border: none;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            transition: none;
            box-sizing: border-box;
        }
        
        .message-bubble:hover {
            transform: none;
        }
        
        .message-bubble.user {
            max-width: 100%;
            width: 100%;
            background: transparent;
            border: none;
            color: var(--text-color);
            border-radius: 0;
            box-shadow: none;
            overflow: visible;
            position: relative;
            padding: 0 24px;
            margin: 0 auto;
            max-width: 800px;
        }


        
        .message-bubble.assistant {
            background: transparent;
            border: none;
            color: var(--text-color);
            border-radius: 0;
            box-shadow: none;
            padding: 0 24px;
            margin: 0 auto;
            max-width: 800px;
            width: 100%;
        }

        /* Background Theme Styles */
        .message-bubble.bg-transparent {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: none !important;
        }



        /* Override default styles for themed messages */
        .message-bubble.bg-light .message-content {
            color: #333 !important;
        }

        .message-bubble.bg-light .msg-action-btn,
        .message-bubble.bg-light .background-dropdown-btn {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
            color: #333 !important;
        }

        .message-bubble.bg-light .msg-action-btn:hover,
        .message-bubble.bg-light .background-dropdown-btn:hover {
            background: rgba(0, 0, 0, 0.15) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }

        /* Dropdown Container */
        .background-dropdown-container {
            position: relative;
            display: inline-block;
            z-index: 1000;
        }

        .background-dropdown-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            position: relative;
            min-width: 28px;
            height: 28px;
        }

        /* Compact mode for smaller screens */
        .background-dropdown-btn.compact {
            min-width: 20px;
            height: 20px;
            padding: 4px;
            font-size: 10px;
        }

        .background-dropdown-btn.compact .current-theme-preview {
            width: 10px;
            height: 10px;
            border-radius: 2px;
        }

        .background-dropdown-btn.compact::before {
            width: 3px;
            height: 3px;
            top: 1px;
            right: 1px;
        }

        .background-dropdown-btn::before {
            content: '';
            position: absolute;
            top: 1px;
            right: 1px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            opacity: 0.7;
        }

        .background-dropdown-btn.input::before {
            background: #60a5fa;
        }

        .background-dropdown-btn.output::before {
            background: #4ade80;
        }

        .background-dropdown-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
        }

        .background-dropdown-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .background-dropdown-btn:active {
            transform: translateY(0) scale(0.95);
        }

        .current-theme-preview {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
        }

        .current-theme-preview.bg-transparent {
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0.3);
        }



        /* Popup Dialog Styles */
        .background-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease-out;
        }

        .background-popup {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            min-width: 320px;
            max-width: 420px;
            backdrop-filter: blur(24px);
            box-shadow: 0 24px 72px rgba(0, 0, 0, 0.4);
            animation: popupSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            transform-origin: top center;
        }

        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
        }

        .popup-header span {
            color: var(--text-color);
            font-weight: 600;
            font-size: 14px;
        }

        .popup-close-btn {
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            transition: all 0.2s ease;
            opacity: 0.6;
        }

        .popup-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            opacity: 1;
        }

        .popup-content {
            padding: 12px;
            max-height: 300px;
            overflow-y: auto;
        }

        .popup-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px 16px;
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            border-radius: 12px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
            text-align: left;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
        }

        .popup-item:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateX(4px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .popup-item.active {
            background: rgba(59, 130, 246, 0.25);
            border: 1px solid rgba(59, 130, 246, 0.5);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes popupSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .theme-preview {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.25);
            flex-shrink: 0;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .popup-item:hover .theme-preview {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .theme-preview.bg-transparent {
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0.3);
        }



        @keyframes dropdownSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        
        
        .edit-textarea {
            width: 100% !important;
            min-width: 100% !important;
            min-height: 100px;
            padding: 12px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-color);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            resize: both;
            outline: none;
            transition: all 0.3s ease;
            overflow: visible;
            cursor: text;
            box-sizing: border-box;
        }
        
        .edit-textarea:hover {
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .edit-textarea:focus {
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }
        
        .edit-textarea:focus {
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(0, 0, 0, 0.3);
        }
        
        .edit-buttons {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        
        .edit-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-color);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .edit-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        
        .edit-btn.save {
            background: rgba(76, 175, 80, 0.2);
            border-color: rgba(76, 175, 80, 0.4);
        }
        
        .edit-btn.save:hover {
            background: rgba(76, 175, 80, 0.3);
            border-color: rgba(76, 175, 80, 0.5);
        }
        
        .edit-btn.cancel {
            background: rgba(244, 67, 54, 0.2);
            border-color: rgba(244, 67, 54, 0.4);
        }
        
        .edit-btn.cancel:hover {
            background: rgba(244, 67, 54, 0.3);
            border-color: rgba(244, 67, 54, 0.5);
        }
        
        
        
        .edit-container {
            width: 100%;
            margin: 0;
            padding: 0;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            overflow: visible;
        }
        
        .screenshots-container {
            margin: 8px 0 6px;
        }
        
        .screenshots-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }
        
        .screenshot-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: transform 0.3s ease;
        }
        
        .screenshot-item:hover {
            transform: translateY(-1px);
        }
        
        .screenshot-image {
            width: 20px; /* Decreased from 80px */
            height: 15px; /* Decreased from 60px */
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .screenshot-image:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .screenshot-number {
            font-size: 9px;
            opacity: 0.7;
            margin-top: 3px;
            text-align: center;
            font-weight: 500;
            background: rgba(0, 0, 0, 0.4);
            color: white;
            padding: 1px 4px;
            border-radius: 4px;
            backdrop-filter: blur(10px);
        }
        
        .screenshots-caption {
            font-size: 11px;
            opacity: 0.7;
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 8px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .message-content {
            font-size: 16px;
            line-height: 1.7;
            margin: 0;
            padding: 12px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            user-select: text;
            -webkit-user-select: text;
            font-weight: 400;
            width: 100%;
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
            box-sizing: border-box;
            color: var(--text-color);
        }
        
        .message-content h1, .message-content h2, .message-content h3 {
            margin: 12px 0 6px;
            line-height: 1.3;
        }
        
        .message-content p {
            margin: 6px 0;
        }
        
        .message-content code {
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-color);
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 13px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-content pre {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin: 10px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-word;
            max-width: 100%;
        }
        
        /* Code Editor Style - Professional Look */
        .code-block-container {
            margin: 16px 0;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(30, 30, 30, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.12);
            position: relative;
            transition: all 0.2s ease;
            max-width: 100%;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .code-block-container:hover {
            background: rgba(30, 30, 30, 0.9);
            border-color: rgba(255, 255, 255, 0.16);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            background: rgba(40, 40, 40, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            min-height: 40px;
            flex-shrink: 0;
        }

        /* Code editor window controls */
        .code-block-header::before {
            content: '';
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff5f57;
            box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #28ca42;
        }
        
        .code-language {
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            text-transform: capitalize;
            letter-spacing: 0;
            position: relative;
            display: flex;
            align-items: center;
            font-family: inherit;
            margin-left: 70px;
        }
        
        .code-copy-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0;
            pointer-events: none;
            z-index: 10;
        }

        .code-block-container:hover .code-copy-btn {
            opacity: 1;
            pointer-events: all;
        }
        
        .code-copy-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
        }

        .code-copy-btn:active {
            background: rgba(255, 255, 255, 0.15);
        }

        .code-copy-btn svg {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
        }
        
        .code-block {
            margin: 0;
            padding: 16px;
            background: rgba(0, 0, 0, 0.3);
            overflow: auto;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            border: none;
            white-space: pre-wrap;
            max-width: 100%;
            box-sizing: border-box;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 400;
            position: relative;
            min-height: 60px;
            flex: 1;
            border-radius: 0 0 8px 8px;
            tab-size: 4;
            -moz-tab-size: 4;
            counter-reset: line-number;
            word-break: keep-all;
            overflow-wrap: normal;
        }
        
        .code-block code {
            background: transparent;
            border: none;
            padding: 0;
            font-size: inherit;
            color: inherit;
            font-family: inherit;
            white-space: pre-wrap;
            overflow-wrap: normal;
            word-break: keep-all;
            display: block;
            width: 100%;
            min-width: max-content;
            tab-size: inherit;
            -moz-tab-size: inherit;
        }

        /* Code editor with line numbers */
        .code-block.with-line-numbers {
            padding-left: 60px;
            position: relative;
        }

        .code-block.with-line-numbers::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 50px;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none;
        }

        .code-block.with-line-numbers code {
            position: relative;
            display: block;
            counter-reset: line-number;
        }

        .code-block.with-line-numbers code::before {
            content: counter(line-number);
            counter-increment: line-number;
            position: absolute;
            left: -50px;
            width: 40px;
            text-align: right;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            line-height: inherit;
            padding-right: 8px;
            user-select: none;
            pointer-events: none;
        }

        /* Line number styling for multi-line code */
        .code-block.with-line-numbers .code-line {
            display: block;
            position: relative;
            min-height: 1.6em;
            white-space: pre-wrap;
            tab-size: 4;
            -moz-tab-size: 4;
        }

        .code-block.with-line-numbers .code-line::before {
            content: counter(line-number);
            counter-increment: line-number;
            position: absolute;
            left: -50px;
            width: 40px;
            text-align: right;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            line-height: inherit;
            padding-right: 8px;
            user-select: none;
            pointer-events: none;
        }

        /* Better indentation visualization */
        .code-block .hljs-keyword + * {
            margin-left: 0;
        }

        /* Preserve indentation for nested code blocks */
        .code-block pre {
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            tab-size: 4;
            -moz-tab-size: 4;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }

        /* Ensure proper spacing for code structure */
        .code-block .hljs {
            white-space: pre-wrap;
            tab-size: 4;
            -moz-tab-size: 4;
            word-break: keep-all;
            overflow-wrap: normal;
        }

        /* Visual indentation guides */
        .code-block {
            background-image: 
                repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 15px,
                    rgba(255, 255, 255, 0.03) 16px,
                    rgba(255, 255, 255, 0.03) 17px,
                    transparent 18px,
                    transparent 31px,
                    rgba(255, 255, 255, 0.03) 32px,
                    rgba(255, 255, 255, 0.03) 33px,
                    transparent 34px,
                    transparent 47px,
                    rgba(255, 255, 255, 0.03) 48px,
                    rgba(255, 255, 255, 0.03) 49px,
                    transparent 50px,
                    transparent 63px,
                    rgba(255, 255, 255, 0.03) 64px,
                    rgba(255, 255, 255, 0.03) 65px
                );
            background-size: 80px 100%;
            background-repeat: repeat-x;
            background-position: 0 0;
        }

        /* Better spacing for code blocks */
        .code-block span {
            display: inline;
            white-space: pre-wrap;
        }

        /* Improve readability of nested structures */
        .code-block .hljs-comment {
            opacity: 0.7;
            font-style: italic;
        }

        .code-block .hljs-string {
            word-break: break-all;
            overflow-wrap: anywhere;
        }

        /* Code editor scrollbars - better for horizontal scrolling */
        .code-block::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .code-block::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }

        .code-block::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            transition: background 0.2s ease;
        }

        .code-block::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .code-block::-webkit-scrollbar-corner {
            background: rgba(0, 0, 0, 0.1);
        }

        /* Firefox scrollbar */
        .code-block {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.1);
        }

        /* Notion-style syntax highlighting */
        .hljs {
            background: transparent !important;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
        }

        .hljs-keyword {
            color: #ff7b72;
            font-weight: 500;
        }

        .hljs-string {
            color: #a5d6ff;
        }

        .hljs-number {
            color: #79c0ff;
        }

        .hljs-comment {
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
        }

        .hljs-function {
            color: #d2a8ff;
            font-weight: 500;
        }

        .hljs-variable {
            color: rgba(255, 255, 255, 0.9);
        }

        .hljs-attr {
            color: #79c0ff;
        }

        .hljs-tag {
            color: #7ee787;
        }

        .hljs-type {
            color: #ffa657;
        }

        .hljs-built_in {
            color: #79c0ff;
        }

        .hljs-operator {
            color: #ff7b72;
        }

        .hljs-punctuation {
            color: rgba(255, 255, 255, 0.7);
        }

        .hljs-title {
            color: #d2a8ff;
            font-weight: 500;
        }

        .hljs-literal {
            color: #79c0ff;
        }

        .hljs-regexp {
            color: #a5d6ff;
        }

        .hljs-meta {
            color: #ffa657;
        }

        /* Responsive design for code editor */
        @media (max-width: 768px) {
            .code-block-container {
                margin: 12px 0;
                border-radius: 6px;
            }

            .code-block-header {
                padding: 8px 12px;
                min-height: 36px;
            }

            .code-block-header::before {
                left: 12px;
                width: 10px;
                height: 10px;
                box-shadow: 16px 0 0 #ffbd2e, 32px 0 0 #28ca42;
            }

            .code-language {
                font-size: 12px;
                margin-left: 60px;
            }

            .code-block {
                padding: 12px 14px;
                font-size: 13px;
                line-height: 1.5;
            }

            .code-block.with-line-numbers {
                padding-left: 50px;
            }

            .code-block.with-line-numbers::before {
                width: 40px;
            }

            .code-copy-btn {
                padding: 3px 6px;
                font-size: 10px;
            }
        }

        @media (max-width: 480px) {
            .code-block-header {
                padding: 6px 10px;
                min-height: 32px;
            }

            .code-block-header::before {
                left: 10px;
                width: 8px;
                height: 8px;
                box-shadow: 14px 0 0 #ffbd2e, 28px 0 0 #28ca42;
            }

            .code-language {
                font-size: 11px;
                margin-left: 50px;
            }

            .code-block {
                padding: 10px 12px;
                font-size: 12px;
                overflow-x: auto;
                white-space: pre-wrap;
                tab-size: 2;
                -moz-tab-size: 2;
                background-size: 40px 100%;
            }

            .code-block.with-line-numbers {
                padding-left: 45px;
            }

            .code-block.with-line-numbers::before {
                width: 35px;
            }

            .code-copy-btn {
                padding: 2px 4px;
                font-size: 9px;
            }
        }

        /* Animation for dynamic content */
        .code-block-container {
            animation: codeBlockFadeIn 0.5s ease-out;
        }

        @keyframes codeBlockFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Syntax highlighting theme adjustments */
        .hljs {
            background: transparent !important;
            color: #e6e6e6;
        }
        
        .hljs-keyword {
            color: #c792ea;
        }
        
        .hljs-string {
            color: #c3e88d;
        }
        
        .hljs-number {
            color: #f78c6c;
        }
        
        .hljs-comment {
            color: #546e7a;
            font-style: italic;
        }
        
        .hljs-function {
            color: #82aaff;
        }
        
        .hljs-variable {
            color: #eeffff;
        }
        
        .hljs-attr {
            color: #ffcb6b;
        }
        
        .hljs-tag {
            color: #f07178;
        }
        
        .message-content blockquote {
            border-left: 2px solid rgba(255, 255, 255, 0.3);
            padding-left: 12px;
            margin: 10px 0;
            opacity: 0.8;
            font-style: italic;
        }
        
        .message-time {
            display: none;
        }
        
        .msg-action-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            height: 28px;
            white-space: nowrap;
        }
        
        .msg-action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
        }

        .msg-action-btn:active {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Hide edit button specifically */
        .msg-action-btn.edit-btn {
            display: none;
        }
        
        .selection-copy-btn {
            position: fixed;
            background: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            gap: 5px;
            opacity: 0;
            transform: translateY(-8px) scale(0.9);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
        }
        
        .selection-copy-btn.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }
        
        .selection-copy-btn:hover {
            background: rgba(0, 0, 0, 0.95);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        .selection-copy-btn:active {
            transform: translateY(0) scale(0.98);
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
            animation: typingPulse 1.4s infinite ease-in-out;
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
        
        @keyframes typingPulse {
            0%, 80%, 100% { 
                transform: scale(0.8);
                opacity: 0.3;
            }
            40% { 
                transform: scale(1.1);
                opacity: 1;
            }
        }
        
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(15px) scale(0.98);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* Enhanced focus states */
        .msg-action-btn:focus-visible {
            outline: 2px solid rgba(255, 255, 255, 0.4);
            outline-offset: 2px;
        }
        
        /* Improved link styling */
        .message-content a {
            color: rgba(135, 206, 235, 0.9);
            text-decoration: none;
            border-bottom: 1px solid rgba(135, 206, 235, 0.3);
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .message-content a:hover {
            color: rgba(135, 206, 235, 1);
            border-bottom-color: rgba(135, 206, 235, 0.6);
            transform: translateY(-1px);
        }
        
        /* List styling */
        .message-content ul, .message-content ol {
            padding-left: 18px;
            margin: 6px 0;
        }
        
        .message-content li {
            margin: 3px 0;
            line-height: 1.4;
        }
        
        /* Table styling */
        .message-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-content th, .message-content td {
            padding: 6px 10px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .message-content th {
            background: rgba(255, 255, 255, 0.05);
            font-weight: 600;
        }
        
        /* Text selection styling */
        .message-content ::selection {
            background: rgba(135, 206, 235, 0.3);
            color: inherit;
        }
        
        .message-content ::-moz-selection {
            background: rgba(135, 206, 235, 0.3);
            color: inherit;
        }

        /* Enhanced Theme Dropdown Styles - Horizontal Layout */
        .background-dropdown.above {
            position: absolute;
            bottom: 120%;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            min-width: 300px;
            max-width: 90vw;
            z-index: 10000;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: dropdownSlideIn 0.3s ease-out;
            display: block;
            visibility: visible;
            opacity: 1;
            overflow: hidden;
            max-height: 120px;
            /* Ensure dropdown doesn't go off-screen */
            right: 0;
            left: 0;
            margin: 0 auto;
            width: calc(100vw - 40px);
        }

        /* Responsive positioning for smaller screens */
        @media (max-width: 480px) {
            .background-dropdown.above,
            .background-dropdown.below {
                min-width: 250px;
                max-width: calc(100vw - 20px);
                right: 10px;
                left: 10px;
                width: calc(100vw - 20px);
                max-height: 100px;
            }
            
            .background-dropdown.above::after,
            .background-dropdown.below::after {
                right: 20px;
            }

            .theme-item {
                min-width: 45px;
                max-width: 50px;
            }

            .theme-preview {
                width: 24px;
                height: 24px;
            }

            .theme-name {
                font-size: 8px;
            }

            .theme-description {
                font-size: 7px;
                max-width: 40px;
            }
        }

        .background-dropdown.above::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 6px 6px 0 6px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.95) transparent transparent transparent;
            display: block;
        }

        /* Position dropdown below if not enough space above */
        .background-dropdown.below {
            position: absolute;
            top: 120%;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            min-width: 300px;
            max-width: 90vw;
            z-index: 10000;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: dropdownSlideIn 0.3s ease-out;
            display: block;
            visibility: visible;
            opacity: 1;
            overflow: hidden;
            max-height: 120px;
            /* Ensure dropdown doesn't go off-screen */
            right: 0;
            left: 0;
            margin: 0 auto;
            width: calc(100vw - 40px);
        }

        .background-dropdown.below::after {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent rgba(0, 0, 0, 0.95) transparent;
            display: block;
        }

        /* Simplified Dropdown Header */
        .dropdown-header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
        }

        .dropdown-title {
            color: var(--text-color);
            font-weight: 600;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Simplified Theme Selection */
        .dropdown-categories {
            padding: 12px 16px;
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
        }

        /* Enhanced Theme Items - Horizontal Circle Layout */
        .theme-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 6px;
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            min-width: 50px;
            max-width: 60px;
            text-align: center;
            font-size: 10px;
            margin: 0;
            position: relative;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .theme-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .theme-item.active {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .theme-item.active::after {
            content: '✓';
            position: absolute;
            top: 2px;
            right: 2px;
            color: #3b82f6;
            font-weight: bold;
            font-size: 10px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 50%;
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Theme suitability indicators */
        .theme-suitability {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 2px;
        }

        .suitability-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            opacity: 0.6;
        }

        .suitability-dot.input {
            background: #60a5fa;
        }

        .suitability-dot.output {
            background: #4ade80;
        }

        .theme-preview {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .theme-item:hover .theme-preview {
            transform: scale(1.15);
            border-color: rgba(255, 255, 255, 0.4);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .theme-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }

        .theme-name {
            font-weight: 500;
            color: var(--text-color);
            font-size: 9px;
            text-align: center;
            line-height: 1.1;
        }

        .theme-description {
            font-size: 8px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.1;
            text-align: center;
            max-width: 45px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .theme-tags {
            display: flex;
            gap: 2px;
            margin-top: 2px;
        }

        .theme-tag {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            padding: 1px 3px;
            border-radius: 3px;
            font-size: 7px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.2px;
        }

        /* Search Results */
        .search-results {
            padding: 8px 0;
            display: flex;
            gap: 12px;
            overflow-x: auto;
        }

        .no-results {
            padding: 20px;
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
            font-style: italic;
        }

        /* Scrollbar Styling - Horizontal */
        .dropdown-categories::-webkit-scrollbar {
            height: 6px;
        }

        .dropdown-categories::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .dropdown-categories::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }

        .dropdown-categories::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        /* Firefox scrollbar */
        .dropdown-categories {
            scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
        }

        /* Animation for theme items - Horizontal */
        @keyframes themeItemSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .theme-item {
            animation: themeItemSlideIn 0.2s ease-out;
        }

        .theme-item:nth-child(1) { animation-delay: 0.05s; }
        .theme-item:nth-child(2) { animation-delay: 0.1s; }
        .theme-item:nth-child(3) { animation-delay: 0.15s; }
        .theme-item:nth-child(4) { animation-delay: 0.2s; }
        .theme-item:nth-child(5) { animation-delay: 0.25s; }

        /* Typography improvements */
        .message-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 15px;
            line-height: 1.6; /* Increased line spacing for better readability */
            letter-spacing: 0.02em;
        }

        /* Responsive design for ChatGPT-style layout */
        @media (max-width: 768px) {
            .message-bubble.user,
            .message-bubble.assistant {
                padding: 0 16px;
                max-width: 100%;
            }

            .message-content {
                font-size: 15px;
                line-height: 1.6;
                padding: 10px 0;
            }

            .message-actions {
                right: 16px;
                top: 6px;
            }

            .message-copy-btn {
                right: 16px;
                top: 6px;
                min-width: 26px;
                height: 26px;
                padding: 5px;
                font-size: 13px;
            }

            .message-copy-btn svg {
                width: 14px;
                height: 14px;
            }

            .msg-action-btn,
            .background-dropdown-btn {
                min-width: 26px;
                height: 26px;
                padding: 5px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .message-bubble.user,
            .message-bubble.assistant {
                padding: 0 12px;
            }

            .message-content {
                font-size: 14px;
                line-height: 1.5;
                padding: 8px 0;
            }

            .message-wrapper {
                padding: 12px 0;
            }

            .message-actions {
                right: 12px;
                top: 4px;
                gap: 6px;
            }

            .message-copy-btn {
                right: 12px;
                top: 4px;
                min-width: 24px;
                height: 24px;
                padding: 4px;
                font-size: 12px;
            }

            .message-copy-btn svg {
                width: 12px;
                height: 12px;
            }

            .msg-action-btn,
            .background-dropdown-btn {
                min-width: 24px;
                height: 24px;
                padding: 4px;
                font-size: 12px;
            }
        }

        /* Enhanced user message container with better spacing */
        .message-wrapper.user .message-bubble {
            background: linear-gradient(135deg, 
                oklch(44.4% 0.011 73.639) 0%, 
                oklch(42% 0.015 73.639) 100%);
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.25);
            box-shadow: 
                0 4px 16px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }

        /* Hover effects for user messages */
        .message-bubble.user:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 6px 20px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border-color: oklch(98.5% 0.001 106.423 / 0.35);
        }

        /* Fade effect for long content */
        .message-bubble.user::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(transparent, oklch(44.4% 0.011 73.639));
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .message-bubble.user.has-scroll::after {
            opacity: 1;
        }

        /* Improved text selection for user messages */
        .message-bubble.user .message-content ::selection {
            background: rgba(255, 255, 255, 0.3);
            color: inherit;
        }

        .message-bubble.user .message-content ::-moz-selection {
            background: rgba(255, 255, 255, 0.3);
            color: inherit;
        }
    `;