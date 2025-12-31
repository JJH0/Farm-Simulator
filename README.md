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

