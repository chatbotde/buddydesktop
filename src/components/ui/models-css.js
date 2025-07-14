import { css } from '../../lit-core-2.7.4.min.js';

export const modelsStyles = css`
        :host { 
            display: block; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .main-view-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 30px 15px;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
            border-radius: 16px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
                0 6px 24px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .welcome {
            font-size: 28px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 32px;
            color: var(--text-color);
            letter-spacing: -0.5px;
        }
        
        .welcome::after {
            content: '';
            display: block;
            width: 50px;
            height: 3px;
            background: var(--text-color);
            margin: 12px auto 0;
            border-radius: 2px;
        }
        
        .option-group {
            margin-bottom: 24px;
            width: 100%;
            position: relative;
        }
        
        .option-label {
            display: block;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--text-color);
            letter-spacing: 0.2px;
        }
        
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            align-items: flex-end;
            max-width: 350px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .input-group input {
            flex: 1;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
        }
        
        .provider-help-text {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            margin-top: 8px;
            font-style: normal;
            line-height: 1.4;
        }
        
        .description {
            font-size: 14px;
            color: var(--text-color);
            opacity: 0.8;
            margin-top: 12px;
            line-height: 1.5;
        }
        

        
        .api-help {
            font-size: 13px;
            color: var(--text-color);
            opacity: 0.7;
            text-align: center;
            line-height: 1.4;
        }
        

        
        select, input[type="password"] {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-color);
            border: 2px solid rgba(255, 255, 255, 0.1);
            padding: 14px 16px;
            width: 100%;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        select {
            background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%);
            appearance: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.8)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 18px;
            padding-right: 48px;
            cursor: pointer;
        }
        
        select:hover {
            border-color: #666666;
            transform: translateY(-1px);
            box-shadow: 
                0 8px 24px #333333,
                inset 0 1px 0 #444444;
            background: linear-gradient(135deg, #444444 0%, #333333 100%);
        }
        select:focus {
            outline: none;
            border-color: var(--text-color);
            box-shadow: 
                0 0 0 4px rgba(255, 255, 255, 0.2),
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 100%);
        }
        
        select option {
            background: rgba(30, 30, 30, 0.95);
            color: var(--text-color);
            padding: 12px 16px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        select option:hover,
        select option:checked,
        select option:focus {
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
            color: var(--text-color);
        }
        
        input[type="password"]:hover {
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%);
        }
        
        input[type="password"]:focus {
            outline: none;
            border-color: var(--text-color);
            box-shadow: 
                0 0 0 4px rgba(255, 255, 255, 0.2),
                0 8px 24px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 100%);
        }
        
        input::placeholder {
            color: var(--placeholder-color);
            opacity: 0.6;
        }
        
        .button {
            background: var(--text-color);
            color: var(--main-content-background);
            border: none;
            padding: 14px 18px;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.1);
            letter-spacing: 0.3px;
            white-space: nowrap;
            min-width: 80px;
            flex-shrink: 0;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 
                0 12px 32px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }
        
        .button:active {
            transform: translateY(0);
            box-shadow: 
                0 4px 16px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .start-button {
            background: var(--text-color);
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.3),
                0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .start-button:hover {
            box-shadow: 
                0 12px 32px rgba(0, 0, 0, 0.4),
                0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .link-button {
            background: transparent;
            color: var(--text-color);
            border: none;
            padding: 0;
            font-size: inherit;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
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
            background: var(--text-color);
            transition: width 0.3s ease;
        }

        .link-button:hover {
            color: var(--text-color);
            transform: none;
            box-shadow: none;
        }
        
        .link-button:hover::after {
            width: 100%;
        }

        .env-status {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-color);
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .env-status.warning {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.1);
            color: var(--text-color);
        }
        
        .env-status.success {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            color: var(--text-color);
        }

        .env-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: currentColor;
            position: relative;
            flex-shrink: 0;
        }
        
        .env-icon::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 4px;
            height: 4px;
            background: currentColor;
            border-radius: 50%;
        }

        .optional-label {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.6;
            font-style: normal;
            font-weight: 400;
            margin-left: 8px;
        }
        
        .form-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 28px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 
                0 4px 16px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 24px;
            text-align: center;
            letter-spacing: 0.5px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            margin: 24px 0;
            border-radius: 1px;
        }
        
        @media (max-width: 640px) {
            .main-view-container {
                padding: 40px 20px;
                max-width: 100%;
                border-radius: 16px;
            }
            
            .welcome {
                font-size: 28px;
                margin-bottom: 40px;
            }
            
            .input-group {
                flex-direction: column;
                gap: 12px;
            }
            
            .button {
                width: 100%;
                min-width: auto;
            }
        }
    `;