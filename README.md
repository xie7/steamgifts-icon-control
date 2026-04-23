# SteamGifts 图标大小控制油猴脚本

一个用于 SteamGifts 网站的油猴脚本，在页面左下角添加图标大小控制面板，支持快速切换图标大小。

## 功能特点

- 🎯 **精准控制**：专门针对 SteamGifts 页面图标优化
- 🎮 **控制面板**：固定在页面左下角的简洁控制面板
- ⚡ **一键切换**：点击按钮直接切换大小（2.5x/2x/1.5x）
- ⌨️ **键盘快捷键**：支持 Ctrl+1/2/3 快速切换
- 🔄 **动态更新**：自动处理页面动态加载的内容
- 🛡️ **安全放大**：基于原始尺寸计算，防止无限增大

## 安装方法

### 方法一：直接安装（推荐）
1. 确保已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展
2. 点击此链接安装脚本：[安装链接](https://raw.githubusercontent.com/YourUsername/steamgifts-icon-control/main/steamgifts-icon-control.user.js)

### 方法二：手动安装
1. 复制 [steamgifts-icon-control.user.js](steamgifts-icon-control.user.js) 文件内容
2. 在 Tampermonkey 中创建新脚本
3. 粘贴代码并保存

## 使用方法

1. 访问 SteamGifts 网站
2. 页面左下角会出现控制面板
3. 点击按钮切换图标大小：
   - **大**：2.5倍放大
   - **中**：2.0倍放大（默认）
   - **小**：1.5倍放大

### 键盘快捷键
- `Ctrl + 1`：小（1.5倍）
- `Ctrl + 2`：中（2.0倍）
- `Ctrl + 3`：大（2.5倍）

## 配置说明

如需修改默认设置，可编辑脚本开头的 `CONFIG` 对象：

```javascript
const CONFIG = {
    multipliers: {
        large: 2.5,    // 大倍率
        medium: 2.0,   // 中倍率
        small: 1.5     // 小倍率
    },
    defaultMultiplier: 2.0,  // 默认倍率
    // ... 其他配置
};
