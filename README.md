# ScrollSmart

TikTok 风格的 AI 知识卡片应用。用户上下滑动浏览卡片，每张卡片是一个由 AI 主动发起的知识聊天，内容根据用户兴趣实时个性化生成，并随着互动不断学习调整。

---

## 产品逻辑

1. 用户注册时选择感兴趣的话题，系统初始化兴趣权重档案
2. 双 Agent 系统为用户生成个性化卡片：
   - **Agent 2（分析师）** 根据用户历史互动，更新兴趣档案，并用 80/20 规则决定下一张卡片的话题
   - **Agent 1（内容生成）** 接收话题和用户档案摘要，生成吸引人的开场 "钩子" 消息
3. 用户可以在卡片内直接聊天深入探讨，点击 Go Deeper 自动发起进阶提问
4. Profile 页面展示兴趣雷达图，随互动实时变化

---

## 项目结构

```
ScrollSmart/
├── frontend/                        # Next.js 14 前端
│   ├── app/
│   │   ├── page.tsx                 # 根路由（自动跳转）
│   │   ├── onboarding/page.tsx      # 注册 + 话题选择
│   │   ├── feed/page.tsx            # 主 Feed 页面
│   │   └── profile/page.tsx         # 兴趣雷达图页面
│   ├── components/
│   │   ├── FeedContainer.tsx        # Feed 滚动逻辑 + 预加载
│   │   ├── KnowledgeCard.tsx        # 单张卡片（打字机动效）
│   │   ├── ChatInterface.tsx        # 卡片内聊天
│   │   ├── ActionButtons.tsx        # 👍 👎 🔍 按钮
│   │   └── TopicSelector.tsx        # 话题选择网格
│   └── lib/
│       └── api.ts                   # 后端 API 客户端封装
│
├── backend/                         # Python FastAPI 后端
│   ├── main.py                      # 入口 + CORS 配置
│   ├── app/
│   │   ├── api/routes.py            # 全部 5 个 API 端点
│   │   ├── agents/
│   │   │   ├── agent1_content.py    # Agent 1：内容生成
│   │   │   ├── agent2_analyst.py    # Agent 2：兴趣分析
│   │   │   └── pipeline.py          # 两个 Agent 的调用管道
│   │   └── models/
│   │       ├── storage.py           # 内存存储 + 权重更新逻辑
│   │       ├── topic_selector.py    # 80/20 话题选择算法
│   │       └── schemas.py           # Pydantic 数据模型
│   ├── requirements.txt
│   └── test_models.py               # 单元测试
│
├── start.sh                         # 一键启动脚本
└── README.md
```

---

## 本地运行

### 前提条件

- Node.js 18+
- Python 3.11+
- OpenAI API Key（需要有余额）

### 第一次配置

**后端：**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env，填入你的 OpenAI API Key
```

**前端：**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local 默认指向 http://localhost:8000，不需要改
```

### 启动

需要开两个终端窗口：

**终端 1 — 后端：**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**终端 2 — 前端：**
```bash
cd frontend
npm run dev
```

打开浏览器访问 **http://localhost:3000**

---

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/register` | 注册用户，初始化兴趣档案 |
| POST | `/api/feed/next` | 生成下一张卡片（Agent 2 → Agent 1）|
| POST | `/api/feed/engage` | 提交互动数据，更新兴趣档案 |
| POST | `/api/chat/message` | 卡片内聊天（调用 Agent 1）|
| GET  | `/api/profile/{user_id}` | 获取兴趣档案和排名 |

完整接口文档（Swagger UI）：**http://localhost:8000/docs**

---

## 核心算法

### 兴趣权重更新规则

每次互动后，对应话题的权重按以下规则调整：

| 行为 | 权重变化 |
|------|---------|
| 点赞 | +0.15 |
| 点踩 | −0.10 |
| 点 Go Deeper | +0.20 |
| 每条聊天消息 | +0.05（上限 +0.30）|
| 停留超过 30 秒 | +0.10 |

权重范围：`0.05 ~ 1.0`，定期软归一化防止全部收敛到 1.0

### 80/20 话题选择

- **80% 利用**：从权重最高的一半话题中加权随机选取
- **20% 探索**：从权重较低或未见过的话题中随机选取

### 双 Agent 设计

两个 Agent 使用完全独立的 OpenAI 客户端和系统提示词，互不共享上下文：

```
用户互动数据
     ↓
[Agent 2 — 分析师]
  · 更新兴趣档案权重
  · 生成档案自然语言摘要
  · 用 80/20 选择下一个话题
     ↓
话题 + 档案摘要
     ↓
[Agent 1 — 内容生成]
  · 生成个性化开场钩子消息
  · 处理后续聊天对话
     ↓
卡片数据返回前端
```

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | Next.js 14 (App Router) + TypeScript |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 数据可视化 | Recharts（雷达图）|
| 后端框架 | FastAPI + Python |
| AI | OpenAI API (gpt-4o-mini) |
| 存储 | 内存（Python dict，hackathon 用，无数据库）|

---

## 注意事项

- `.env` 文件包含 API Key，**绝对不能提交到 git**（已在 `.gitignore` 中排除）
- 后端是内存存储，重启后所有用户数据清空，前端会自动跳回注册页
- 每次后端重启后，浏览器需要重新注册（或清除 localStorage）
