# 🚜 Farm-Simulator  
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![License](https://img.shields.io/badge/license-MIT-blue)
![Last Commit](https://img.shields.io/github/last-commit/JJH0/Farm-Simulator)

一个极简的“在线/离线”双模式农场小游戏  
前端自动识别网络状态，后端用 JSON 文件模拟数据库，零部署成本即可体验。

---

## 🚀 快速开始

| 步骤 | 命令 |
|---|---|
| 1. 安装依赖 | `npm install` *(或 `pip install -r requirements.txt` 如果有 Python 脚本)* |
| 2. 启动服务 | `node server.js` |
| 3. 打开游戏 | 双击 `index.html` 或访问 `http://localhost:3000` |

&gt; 右上角状态灯变为 🟢**在线** 即表示成功连接后端；  
&gt; 若显示 🔴**离线** 会自动降级到 `localStorage` 继续游戏。

---
# 🎉 全新社交功能上线啦！ 🎉

&gt; 🔥 **重磅更新**：农场社交系统正式开放！快来和好友一起种菜偷菜吧~

---

## 🆕 新增功能一览

### 👥 🎯 圈子功能
- **新增「👥 圈子」按钮** - 一键进入社交世界
- **全新「社交面板」** - 你的社交中枢

---

## 🏠 社交面板详情

### 🚪 未加入圈子时
&lt;div align="center"&gt;
  
![欢迎界面](https://via.placeholder.com/400x200/4CAF50/white?text=🚪+加入圈子)

&lt;/div&gt;

- 🏠 **创建房间** - 成为房主，邀请好友
- 🔑 **输入房间号加入** - 6位数字，轻松加入

### 👨‍👩‍👧‍👦 已加入圈子时
&lt;div align="center"&gt;
  
![邻居列表](https://via.placeholder.com/400x250/2196F3/white?text=👥+邻居列表)

&lt;/div&gt;

- 📋 **邻居列表** - 显示同圈子所有玩家
  - ⭐ **等级显示** - 一目了然看实力
  - 🏷️ **玩家ID** - 快速识别好友

---

## 🌟 服务器新功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 🏗️ 创建房间 | 生成唯一6位房间号 | ✅ 已支持 |
| 🔍 加入房间 | 通过房间号加入 | ✅ 已支持 |
| 📊 邻居列表 | 查询同房间玩家 | ✅ 已支持 |

---

## 🎮 互动玩法

### 🚪 拜访功能
&lt;div align="center"&gt;

![拜访按钮](https://via.placeholder.com/300x100/FF9800/white?text=🚪+拜访邻居)

&lt;/div&gt;

- 🌾 **临时加载**对方农场数据
- 👀 **只读模式** - 安全浏览
- 🎯 **点击拜访** - 瞬间传送

### 🥬 偷菜逻辑
&gt; ⚠️ **注意**：只有拜访模式下才能偷菜哦！

&lt;div align="center"&gt;

![偷菜提示](https://via.placeholder.com/350x150/F44336/white?text=🥬+作物已成熟+🔥)

&lt;/div&gt;

- 🕐 **作物成熟** - 出现偷菜提示
- 💰 **偷取成功** - 扣除对方产量
- 📦 **增加库存** - 丰富你的仓库

### 🤝 互助逻辑
&lt;div align="center"&gt;

![干旱土地](https://via.placeholder.com/300x150/8BC34A/white?text=🌱+需要浇水+💧)

&lt;/div&gt;

- 🔍 **发现干旱** - 邻居的土地需要帮忙
- 💧 **帮忙浇水** - 点击即可相助
- ⭐ **获得经验** - 助人为乐有回报

---

## 🎯 快速上手指南

### 🚀 第一步：加入圈子
1. 点击「👥 圈子」按钮
2. 选择「创建房间」或「输入房间号」
3. 成功进入社交世界！

### 🌟 第二步：结识邻居
1. 查看「邻居列表」
2. 选择感兴趣的玩家
3. 点击「🚪 拜访」开启互动

### 🎮 第三步：互动游戏
- 🥬 **偷菜** - 增加库存
- 💧 **浇水** - 获得经验
- 🤝 **互助** - 建立友谊

---

## 💡 温馨提示

&gt; 🔔 **小贴士**：
&gt; - 每天拜访有次数限制，合理规划哦~
&gt; - 成熟的作物才能偷取，注意观察！
&gt; - 帮助邻居浇水，经验值蹭蹭上涨！
&gt; - 创建私人房间，邀请现实好友一起玩！

---

&lt;div align="center"&gt;

### 🌈 快来体验全新的农场社交系统吧！
### 👥 圈子等你加入，邻居等你认识！
### 🥬 偷菜浇水，乐趣无穷！

&lt;/div&gt;
