import { css } from '../../lit-core-2.7.4.min.js';

export const modelsStyles = css`
        :host { 
            display: block; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, 
                rgba(15, 23, 42, 0.9) 0%, 
                rgba(30, 41, 59, 0.8) 50%, 
                rgba(51, 65, 85, 0.7) 100%);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }

        :host::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .main-view-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .welcome {
            font-size: 36px;
            font-weight: 800;
            text-align: center;
            margin-bottom: 48px;
            color: #ffffff;
            letter-spacing: -1px;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            position: relative;
        }
        
        .welcome::after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
            margin: 20px auto 0;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
        
        .form-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            padding: 40px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.2),
                0 8px 16px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .form-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }
        
        .card-title {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 32px;
            text-align: center;
            letter-spacing: 0.5px;
        }
        
        .option-group {
            margin-bottom: 28px;
            width: 100%;
            position: relative;
        }
        
        .option-label {
            display: block;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #f1f5f9;
            letter-spacing: 0.3px;
        }
        
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .provider-help-text {
            font-size: 14px;
            color: #cbd5e1;
            opacity: 0.9;
            margin-top: 8px;
            font-style: normal;
            line-height: 1.5;
        }
        
        .description {
            font-size: 14px;
            color: #cbd5e1;
            opacity: 0.8;
            margin-top: 12px;
            line-height: 1.5;
        }
        
        .api-help {
            font-size: 14px;
            color: #cbd5e1;
            opacity: 0.9;
            text-align: center;
            line-height: 1.5;
            margin-top: 16px;
        }
        
        select, input[type="password"] {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border: 2px solid rgba(255, 255, 255, 0.15);
            padding: 16px 20px;
            width: 100%;
            border-radius: 16px;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-sizing: border-box;
        }
        
        select {
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.9)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 20px center;
            background-size: 20px;
            padding-right: 56px;
            cursor: pointer;
        }
        
        select:hover {
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 100%);
        }
        
        select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 
                0 0 0 4px rgba(59, 130, 246, 0.3),
                0 8px 24px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
        }
        
        select option {
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            padding: 12px 16px;
            border: none;
            font-size: 15px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        input[type="password"]:hover {
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 100%);
        }
        
        input[type="password"]:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 
                0 0 0 4px rgba(59, 130, 246, 0.3),
                0 8px 24px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%);
        }
        
        input::placeholder {
            color: rgba(255, 255, 255, 0.6);
            opacity: 1;
        }
        
        .link-button {
            background: transparent;
            color: #3b82f6;
            border: none;
            padding: 0;
            font-size: inherit;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            position: relative;
        }

        .link-button::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            transition: width 0.3s ease;
        }

        .link-button:hover {
            color: #60a5fa;
            transform: none;
            box-shadow: none;
        }
        
        .link-button:hover::after {
            width: 100%;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            margin: 32px 0;
            border-radius: 1px;
            position: relative;
        }

        .divider::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
        }

        .go-to-chat-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-top: 24px;
            padding: 20px;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
            border: none;
            border-radius: 16px;
            box-shadow: 
                0 8px 24px rgba(59, 130, 246, 0.4),
                0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: #ffffff;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .go-to-chat-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .go-to-chat-button:hover {
            transform: translateY(-3px);
            box-shadow: 
                0 12px 32px rgba(59, 130, 246, 0.5),
                0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .go-to-chat-button:hover::before {
            opacity: 1;
        }

        .go-to-chat-button:active {
            transform: translateY(-1px);
            box-shadow: 
                0 6px 20px rgba(59, 130, 246, 0.4),
                0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .button-content {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .button-icon {
            transition: transform 0.3s ease;
        }

        .go-to-chat-button:hover .button-icon {
            transform: translateX(4px);
        }
        
        @media (max-width: 640px) {
            .main-view-container {
                padding: 30px 16px;
                max-width: 100%;
            }
            
            .welcome {
                font-size: 32px;
                margin-bottom: 40px;
            }

            .form-card {
                padding: 32px 24px;
                border-radius: 20px;
            }
            
            .card-title {
                font-size: 22px;
            }

            .go-to-chat-button {
                padding: 18px;
                font-size: 16px;
            }
        }
    `;