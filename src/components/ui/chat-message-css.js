import { css } from '../../lit-core-2.7.4.min.js';

export const chatMessageStyles = css`
        :host { 
            display: block; 
            margin: 6px 0;
        }
        
        .message-wrapper {
            display: flex;
            width: 100%;
            position: relative;
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
            animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            transition: all 0.3s ease;
        }
        
        .message-bubble:hover {
            transform: translateY(-1px);
        }
        
        .message-bubble.user {
            background: oklch(44.4% 0.011 73.639);
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.2);
            color: var(--text-color);
            border-radius: 18px 18px 6px 18px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .message-bubble.assistant {
            background: oklch(14.7% 0.004 49.25);
            border: 1px solid oklch(98.5% 0.001 106.423 / 0.15);
            color: var(--text-color);
            border-radius: 18px 18px 18px 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        /* Background Theme Styles */
        .message-bubble.bg-transparent {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: none !important;
        }

        .message-bubble.bg-glass {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(20px) !important;
        }

        .message-bubble.bg-dark {
            background: rgba(0, 0, 0, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .message-bubble.bg-light {
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333 !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .message-bubble.bg-blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)) !important;
            border: 1px solid rgba(59, 130, 246, 0.3) !important;
        }

        .message-bubble.bg-green {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8)) !important;
            border: 1px solid rgba(34, 197, 94, 0.3) !important;
        }

        .message-bubble.bg-purple {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(126, 34, 206, 0.8)) !important;
            border: 1px solid rgba(147, 51, 234, 0.3) !important;
        }

        .message-bubble.bg-orange {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.8)) !important;
            border: 1px solid rgba(249, 115, 22, 0.3) !important;
        }

        .message-bubble.bg-pink {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.8)) !important;
            border: 1px solid rgba(236, 72, 153, 0.3) !important;
        }

        .message-bubble.bg-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .message-bubble.bg-neon {
            background: rgba(0, 0, 0, 0.9) !important;
            border: 1px solid #00ff00 !important;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3) !important;
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
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            opacity: 0.6;
            cursor: pointer;
            padding: 6px 8px;
            border-radius: 8px;
            margin-left: 4px;
            font-size: 13px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(10px);
        }

        .background-dropdown-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .background-dropdown-btn:active {
            transform: translateY(0) scale(0.95);
        }

        .current-theme-preview {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
        }

        .current-theme-preview.bg-transparent {
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0.3);
        }

        .current-theme-preview.bg-glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .current-theme-preview.bg-dark {
            background: rgba(0, 0, 0, 0.8);
        }

        .current-theme-preview.bg-light {
            background: rgba(255, 255, 255, 0.9);
        }

        .current-theme-preview.bg-blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
        }

        .current-theme-preview.bg-green {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
        }

        .current-theme-preview.bg-purple {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(126, 34, 206, 0.8));
        }

        .current-theme-preview.bg-orange {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.8));
        }

        .current-theme-preview.bg-pink {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.8));
        }

        .current-theme-preview.bg-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .current-theme-preview.bg-neon {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff00;
            box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
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
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            min-width: 280px;
            max-width: 400px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: popupSlideIn 0.3s ease-out;
            overflow: hidden;
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
            gap: 12px;
            padding: 10px 12px;
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            width: 100%;
            text-align: left;
            font-size: 13px;
            margin-bottom: 2px;
        }

        .popup-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(2px);
        }

        .popup-item.active {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.4);
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
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
        }

        .theme-preview.bg-transparent {
            background: transparent;
            border: 1px dashed rgba(255, 255, 255, 0.3);
        }

        .theme-preview.bg-glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .theme-preview.bg-dark {
            background: rgba(0, 0, 0, 0.8);
        }

        .theme-preview.bg-light {
            background: rgba(255, 255, 255, 0.9);
        }

        .theme-preview.bg-blue {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8));
        }

        .theme-preview.bg-green {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
        }

        .theme-preview.bg-purple {
            background: linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(126, 34, 206, 0.8));
        }

        .theme-preview.bg-orange {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.8));
        }

        .theme-preview.bg-pink {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(219, 39, 119, 0.8));
        }

        .theme-preview.bg-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .theme-preview.bg-neon {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff00;
            box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
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
        
        .message-bubble.white-background {
            background: white !important;
            color: #333 !important;
            border: 1px solid #e0e0e0 !important;
        }
        
        .message-bubble.white-background .message-content {
            color: #333 !important;
        }
        
        .message-bubble.white-background .message-content a {
            color: #0066cc !important;
            border-bottom: 1px solid #0066cc !important;
        }
        
        .message-bubble.white-background .message-content code {
            background: rgba(0, 0, 0, 0.1) !important;
            color: #333 !important;
            border: 1px solid #ddd !important;
        }
        
        .message-bubble.white-background .code-block-container {
            background: rgba(0, 0, 0, 0.05) !important;
            border: 1px solid #ddd !important;
        }
        
        .message-bubble.white-background .code-block {
            background: rgba(0, 0, 0, 0.05) !important;
        }
        
        .message-bubble.white-background .hljs {
            color: #333 !important;
        }
        
        .message-bubble.white-background .msg-action-btn,
        .message-bubble.white-background .background-toggle-btn {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
            color: #333 !important;
        }
        
        .message-bubble.white-background .msg-action-btn:hover,
        .message-bubble.white-background .background-toggle-btn:hover {
            background: rgba(0, 0, 0, 0.15) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }
        
        .message-bubble.white-background .edit-textarea {
            background: rgba(0, 0, 0, 0.05) !important;
            color: #333 !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
        }
        
        .message-bubble.white-background .edit-textarea:hover {
            border-color: rgba(0, 0, 0, 0.3) !important;
        }
        
        .message-bubble.white-background .edit-textarea:focus {
            border-color: rgba(0, 0, 0, 0.4) !important;
            background: rgba(0, 0, 0, 0.08) !important;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        .message-bubble.white-background .edit-btn {
            background: rgba(0, 0, 0, 0.1) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
            color: #333 !important;
        }
        
        .message-bubble.white-background .edit-btn:hover {
            background: rgba(0, 0, 0, 0.15) !important;
            border-color: rgba(0, 0, 0, 0.3) !important;
        }
        
        .message-bubble.white-background .edit-btn.save {
            background: rgba(76, 175, 80, 0.2) !important;
            border-color: rgba(76, 175, 80, 0.4) !important;
            color: #2e7d32 !important;
        }
        
        .message-bubble.white-background .edit-btn.save:hover {
            background: rgba(76, 175, 80, 0.3) !important;
            border-color: rgba(76, 175, 80, 0.5) !important;
        }
        
        .message-bubble.white-background .edit-btn.cancel {
            background: rgba(244, 67, 54, 0.2) !important;
            border-color: rgba(244, 67, 54, 0.4) !important;
            color: #c62828 !important;
        }
        
        .message-bubble.white-background .edit-btn.cancel:hover {
            background: rgba(244, 67, 54, 0.3) !important;
            border-color: rgba(244, 67, 54, 0.5) !important;
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
        
        .background-toggle-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            opacity: 0.6;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 8px;
            margin-left: 4px;
            font-size: 13px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            backdrop-filter: blur(10px);
        }
        
        .background-toggle-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
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
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: relative;
            user-select: text;
            -webkit-user-select: text;
            font-weight: 600;
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
        }
        
        /* Enhanced code block styles */
        .code-block-container {
            margin: 12px 0;
            border-radius: 12px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            position: relative;
        }
        
        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .code-language {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .code-copy-btn {
            position: absolute;
            top: 5px;
            right: 8px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0;
            pointer-events: none;
        }

        .code-block-container:hover .code-copy-btn {
            opacity: 0.7;
            pointer-events: all;
        }
        
        .code-copy-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            opacity: 1;
            transform: translateY(-1px);
        }
        
        .code-block {
            margin: 0;
            padding: 16px;
            background: rgba(0, 0, 0, 0.2);
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            border: none;
        }
        
        .code-block code {
            background: transparent;
            border: none;
            padding: 0;
            font-size: inherit;
            color: inherit;
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
            font-size: 11px;
            opacity: 0.6;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            justify-content: flex-end;
            font-weight: 500;
        }
        
        .message-bubble.assistant .message-time {
            text-align: left;
            justify-content: flex-start;
        }
        
        .msg-action-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            opacity: 0.6;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 8px;
            margin-left: 4px;
            font-size: 13px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            backdrop-filter: blur(10px);
        }
        
        .msg-action-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
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

        /* Enhanced Theme Dropdown Styles */
        .background-dropdown.above {
            position: absolute;
            bottom: 120%;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            min-width: 320px;
            max-width: 400px;
            z-index: 10000;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: dropdownSlideIn 0.3s ease-out;
            display: block;
            visibility: visible;
            opacity: 1;
            overflow: hidden;
        }

        .background-dropdown.above::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 16px;
            border-width: 8px 8px 0 8px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.95) transparent transparent transparent;
            display: block;
        }

        /* Enhanced Dropdown Header */
        .dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
        }

        .dropdown-title {
            color: var(--text-color);
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .dropdown-search {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--text-color);
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            width: 120px;
            transition: all 0.2s ease;
        }

        .dropdown-search:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.12);
        }

        .dropdown-search::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        /* Category Sections */
        .dropdown-categories {
            max-height: 400px;
            overflow-y: auto;
            padding: 8px 0;
        }

        .category-section {
            margin-bottom: 16px;
        }

        .category-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .category-icon {
            font-size: 14px;
        }

        /* Enhanced Theme Items */
        .theme-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 16px;
            background: transparent;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            width: 100%;
            text-align: left;
            font-size: 13px;
            margin: 2px 8px;
            position: relative;
        }

        .theme-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(2px);
        }

        .theme-item.active {
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .theme-item.active::before {
            content: '✓';
            position: absolute;
            right: 12px;
            color: #3b82f6;
            font-weight: bold;
            font-size: 14px;
        }

        .theme-preview {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
            transition: all 0.2s ease;
        }

        .theme-item:hover .theme-preview {
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.4);
        }

        .theme-info {
            flex: 1;
            min-width: 0;
        }

        .theme-name {
            font-weight: 500;
            margin-bottom: 2px;
            color: var(--text-color);
        }

        .theme-description {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.3;
        }

        .theme-tags {
            display: flex;
            gap: 4px;
            margin-top: 4px;
        }

        .theme-tag {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* Search Results */
        .search-results {
            padding: 8px 0;
        }

        .no-results {
            padding: 20px;
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
            font-style: italic;
        }

        /* Scrollbar Styling */
        .dropdown-categories::-webkit-scrollbar {
            width: 6px;
        }

        .dropdown-categories::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .dropdown-categories::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .dropdown-categories::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        /* Animation for theme items */
        @keyframes themeItemSlideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
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
    `;