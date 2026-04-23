// ==UserScript==
// @name         SteamGifts 图标大小控制
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在SteamGifts页面左下角添加图标大小控制面板，支持2.5x/2x/1.5x倍率切换
// @author       xie7
// @match        https://www.steamgifts.com/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/xie7/steamgifts-icon-control/main/steamgifts-icon-control.user.js
// @downloadURL  https://raw.githubusercontent.com/xie7/steamgifts-icon-control/main/steamgifts-icon-control.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置
    const CONFIG = {
        multipliers: {
            large: 2.5,
            medium: 2.0,
            small: 1.5
        },
        defaultMultiplier: 2.0,
        panelPosition: {
            bottom: '20px',
            left: '20px'
        },
        panelStyle: {
            background: 'rgba(30, 30, 46, 0.95)',
            border: '1px solid #00adb5',
            borderRadius: '8px',
            padding: '12px 15px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: '13px',
            color: '#e0e0e0',
            minWidth: '200px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(5px)',
            zIndex: '9999'
        },
        buttonStyles: {
            large: { bg: '#ff6b6b', border: '#ff6b6b', color: '#ff6b6b' },
            medium: { bg: '#00adb5', border: '#00adb5', color: '#00adb5' },
            small: { bg: '#4ecdc4', border: '#4ecdc4', color: '#4ecdc4' }
        }
    };
    
    // 当前状态
    let currentMultiplier = CONFIG.defaultMultiplier;
    let processedIcons = 0;
    
    // 保存原始尺寸
    function saveOriginalSizes(icons) {
        icons.forEach(icon => {
            if (!icon.dataset.originalSizeSet) {
                if (icon.tagName === 'IMG') {
                    const originalWidth = icon.naturalWidth || icon.width || icon.offsetWidth || 16;
                    const originalHeight = icon.naturalHeight || icon.height || icon.offsetHeight || 16;
                    icon.dataset.originalWidth = originalWidth;
                    icon.dataset.originalHeight = originalHeight;
                } else if (icon.tagName === 'SVG') {
                    const originalWidth = icon.getAttribute('width') || icon.style.width || '1em';
                    const originalHeight = icon.getAttribute('height') || icon.style.height || '1em';
                    icon.dataset.originalWidth = originalWidth;
                    icon.dataset.originalHeight = originalHeight;
                } else if (icon.classList.contains('fa')) {
                    const originalSize = window.getComputedStyle(icon).fontSize;
                    icon.dataset.originalFontSize = originalSize;
                }
                icon.dataset.originalSizeSet = 'true';
            }
        });
    }
    
    // 查找所有图标
    function findAllIcons() {
        const iconSelectors = [
            '.fa-trophy', '.fa-level-up', '.fa-star', '.level-icon',
            '.fa-comment', '.fa-comments', '.fa-comment-alt',
            '.fa-users', '.fa-user-plus', '.fa-sign-in',
            '.fa-eye', '.fa-clock', '.fa-hourglass',
            '.giveaway__icon', '.icon', '.fa', '.fas', '.far', '.fab'
        ];
        
        let allIcons = [];
        iconSelectors.forEach(selector => {
            const icons = document.querySelectorAll(selector);
            icons.forEach(icon => {
                if (!allIcons.includes(icon)) {
                    allIcons.push(icon);
                }
            });
        });
        
        // 查找容器内的图标
        const giveawayContainers = document.querySelectorAll('.giveaway__row, .giveaway__heading, [class*="giveaway"]');
        giveawayContainers.forEach(container => {
            const containerIcons = container.querySelectorAll('i, span[class*="icon"], img, svg');
            containerIcons.forEach(icon => {
                if (!allIcons.includes(icon)) {
                    allIcons.push(icon);
                }
            });
        });
        
        return [...new Set(allIcons)];
    }
    
    // 应用放大倍数
    function applyMultiplier(multiplier) {
        currentMultiplier = multiplier;
        const allIcons = findAllIcons();
        
        // 保存原始尺寸
        saveOriginalSizes(allIcons);
        
        // 应用放大效果
        allIcons.forEach(icon => {
            if (!icon.classList.contains('sg-enhanced')) {
                icon.classList.add('sg-enhanced');
            }
            
            if (icon.tagName === 'IMG' && icon.dataset.originalWidth) {
                const originalWidth = parseFloat(icon.dataset.originalWidth);
                const originalHeight = parseFloat(icon.dataset.originalHeight);
                icon.style.width = (originalWidth * multiplier) + 'px';
                icon.style.height = (originalHeight * multiplier) + 'px';
                icon.style.margin = '0 3px';
                icon.style.verticalAlign = 'middle';
            } else if (icon.tagName === 'SVG' && icon.dataset.originalWidth) {
                const originalSize = icon.dataset.originalWidth;
                if (originalSize.includes('em')) {
                    const sizeValue = parseFloat(originalSize);
                    icon.style.width = (sizeValue * multiplier) + 'em';
                    icon.style.height = (sizeValue * multiplier) + 'em';
                } else {
                    icon.style.width = multiplier + 'em';
                    icon.style.height = multiplier + 'em';
                }
                icon.style.verticalAlign = 'middle';
                icon.style.margin = '0 3px';
            } else if (icon.classList.contains('fa') && icon.dataset.originalFontSize) {
                const originalSize = parseFloat(icon.dataset.originalFontSize) || 14;
                icon.style.fontSize = (originalSize * multiplier) + 'px';
                icon.style.margin = '0 3px';
                icon.style.verticalAlign = 'middle';
            } else {
                icon.style.transform = `scale()`;
                icon.style.transformOrigin = 'center center';
                icon.style.display = 'inline-block';
                icon.style.margin = '0 3px';
            }
            
            // 添加平滑过渡
            icon.style.transition = 'all 0.2s ease';
            
            // 添加悬停效果
            if (!icon._hoverHandlersAdded) {
                icon.addEventListener('mouseenter', function() {
                    this.style.opacity = '0.8';
                    this.style.cursor = 'pointer';
                });
                
                icon.addEventListener('mouseleave', function() {
                    this.style.opacity = '1';
                });
                
                icon._hoverHandlersAdded = true;
            }
        });
        
        processedIcons = allIcons.length;
        updatePanelDisplay();
        
        return allIcons.length;
    }
    
    // 创建控制面板
    function createControlPanel() {
        // 移除可能存在的旧面板
        const oldPanel = document.getElementById('sg-control-panel');
        if (oldPanel) oldPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = 'sg-control-panel';
        
        // 应用样式
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: CONFIG.panelPosition.bottom,
            left: CONFIG.panelPosition.left,
            ...CONFIG.panelStyle
        });
        
        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: 600; color: #00adb5; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                <span>🎮 图标控制</span>
                <span id="sg-icon-count" style="font-size: 11px; background: rgba(0, 173, 181, 0.2); padding: 2px 6px; border-radius: 10px;">0</span>
            </div>
            <div style="margin-bottom: 8px; font-size: 12px; color: #aaa;">点击倍率直接更改:</div>
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <button id="sg-btn-large" style="flex: 1; padding: 8px 0; background: #1a1a2e; border: 2px solid ; color: ; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: all 0.2s;">大(2.5x)</button>
                <button id="sg-btn-medium" style="flex: 1; padding: 8px 0; background: #1a1a2e; border: 2px solid ; color: ; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: all 0.2s;">中(2x)</button>
                <button id="sg-btn-small" style="flex: 1; padding: 8px 0; background: #1a1a2e; border: 2px solid ; color: ; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: all 0.2s;">小(1.5x)</button>
            </div>
            <div style="font-size: 11px; color: #888; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 8px;">
                当前: <span id="sg-current-multiplier" style="color: #00adb5; font-weight: bold;">2.0x</span>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 按钮事件
        document.getElementById('sg-btn-large').addEventListener('click', () => {
            applyMultiplier(CONFIG.multipliers.large);
            updateButtonStates(CONFIG.multipliers.large);
        });
        
        document.getElementById('sg-btn-medium').addEventListener('click', () => {
            applyMultiplier(CONFIG.multipliers.medium);
            updateButtonStates(CONFIG.multipliers.medium);
        });
        
        document.getElementById('sg-btn-small').addEventListener('click', () => {
            applyMultiplier(CONFIG.multipliers.small);
            updateButtonStates(CONFIG.multipliers.small);
        });
        
        // 更新按钮状态
        function updateButtonStates(multiplier) {
            const largeBtn = document.getElementById('sg-btn-large');
            const mediumBtn = document.getElementById('sg-btn-medium');
            const smallBtn = document.getElementById('sg-btn-small');
            const currentDisplay = document.getElementById('sg-current-multiplier');
            
            // 重置所有按钮
            largeBtn.style.background = '#1a1a2e';
            largeBtn.style.border = `2px solid `;
            largeBtn.style.color = CONFIG.buttonStyles.large.color;
            
            mediumBtn.style.background = '#1a1a2e';
            mediumBtn.style.border = `2px solid `;
            mediumBtn.style.color = CONFIG.buttonStyles.medium.color;
            
            smallBtn.style.background = '#1a1a2e';
            smallBtn.style.border = `2px solid `;
            smallBtn.style.color = CONFIG.buttonStyles.small.color;
            
            // 高亮当前选中的按钮
            if (multiplier === CONFIG.multipliers.large) {
                largeBtn.style.background = CONFIG.buttonStyles.large.bg;
                largeBtn.style.color = 'white';
                currentDisplay.textContent = '2.5x';
            } else if (multiplier === CONFIG.multipliers.medium) {
                mediumBtn.style.background = CONFIG.buttonStyles.medium.bg;
                mediumBtn.style.color = 'white';
                currentDisplay.textContent = '2.0x';
            } else if (multiplier === CONFIG.multipliers.small) {
                smallBtn.style.background = CONFIG.buttonStyles.small.bg;
                smallBtn.style.color = 'white';
                currentDisplay.textContent = '1.5x';
            }
        }
        
        // 初始状态
        updateButtonStates(CONFIG.defaultMultiplier);
    }
    
    // 更新面板显示
    function updatePanelDisplay() {
        const countElement = document.getElementById('sg-icon-count');
        if (countElement) {
            countElement.textContent = processedIcons;
        }
    }
    
    // 初始化
    function init() {
        console.log('[SteamGifts图标控制] 脚本初始化...');
        
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(setup, 1000);
            });
        } else {
            setTimeout(setup, 1000);
        }
        
        function setup() {
            // 创建控制面板
            createControlPanel();
            
            // 初始应用默认倍数
            applyMultiplier(CONFIG.defaultMultiplier);
            
            console.log(`[SteamGifts图标控制] 初始处理了  个图标`);
            
            // 监听页面变化
            const observer = new MutationObserver(function(mutations) {
                let hasNewContent = false;
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        hasNewContent = true;
                    }
                });
                
                if (hasNewContent) {
                    clearTimeout(window.sgUpdateTimer);
                    window.sgUpdateTimer = setTimeout(() => {
                        applyMultiplier(currentMultiplier);
                    }, 500);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 添加键盘快捷键
            document.addEventListener('keydown', function(e) {
                // Ctrl+1 = 小(1.5x), Ctrl+2 = 中(2x), Ctrl+3 = 大(2.5x)
                if (e.ctrlKey && !e.altKey && !e.shiftKey) {
                    if (e.key === '1') {
                        applyMultiplier(CONFIG.multipliers.small);
                        updateButtonStates(CONFIG.multipliers.small);
                        e.preventDefault();
                    } else if (e.key === '2') {
                        applyMultiplier(CONFIG.multipliers.medium);
                        updateButtonStates(CONFIG.multipliers.medium);
                        e.preventDefault();
                    } else if (e.key === '3') {
                        applyMultiplier(CONFIG.multipliers.large);
                        updateButtonStates(CONFIG.multipliers.large);
                        e.preventDefault();
                    }
                }
            });
            
            console.log('[SteamGifts图标控制] 控制面板已创建在左下角');
            console.log('[SteamGifts图标控制] 快捷键: Ctrl+1(小), Ctrl+2(中), Ctrl+3(大)');
        }
        
        // 更新按钮状态函数（需要在setup内部定义）
        function updateButtonStates(multiplier) {
            const largeBtn = document.getElementById('sg-btn-large');
            const mediumBtn = document.getElementById('sg-btn-medium');
            const smallBtn = document.getElementById('sg-btn-small');
            const currentDisplay = document.getElementById('sg-current-multiplier');
            
            if (!largeBtn || !mediumBtn || !smallBtn || !currentDisplay) return;
            
            // 重置所有按钮
            largeBtn.style.background = '#1a1a2e';
            largeBtn.style.border = `2px solid `;
            largeBtn.style.color = CONFIG.buttonStyles.large.color;
            
            mediumBtn.style.background = '#1a1a2e';
            mediumBtn.style.border = `2px solid `;
            mediumBtn.style.color = CONFIG.buttonStyles.medium.color;
            
            smallBtn.style.background = '#1a1a2e';
            smallBtn.style.border = `2px solid `;
            smallBtn.style.color = CONFIG.buttonStyles.small.color;
            
            // 高亮当前选中的按钮
            if (multiplier === CONFIG.multipliers.large) {
                largeBtn.style.background = CONFIG.buttonStyles.large.bg;
                largeBtn.style.color = 'white';
                currentDisplay.textContent = '2.5x';
            } else if (multiplier === CONFIG.multipliers.medium) {
                mediumBtn.style.background = CONFIG.buttonStyles.medium.bg;
                mediumBtn.style.color = 'white';
                currentDisplay.textContent = '2.0x';
            } else if (multiplier === CONFIG.multipliers.small) {
                smallBtn.style.background = CONFIG.buttonStyles.small.bg;
                smallBtn.style.color = 'white';
                currentDisplay.textContent = '1.5x';
            }
        }
    }
    
    // 启动脚本
    init();
})();
