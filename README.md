# ScrollSmart

TikTok 风格的 AI 知识卡片无限滚动应用。每张卡片都是一个由 AI 主动发起的知识聊天，内容根据用户兴趣实时个性化生成。

## 项目结构

```
ScrollSmart/
├── frontend/          # Next.js 14 + TypeScript + Tailwind
└── backend/           # Python + FastAPI + OpenAI
```

## 快速启动

### 后端
```bash
cd backend
cp .env.example .env
# 编辑 .env，填入你的 OpenAI API Key
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### 前端
```bash
cd frontend
cp .env.local.example .env.local
npm run dev
```

访问 http://localhost:3000

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **后端**: FastAPI, Python, OpenAI API
- **AI**: GPT-4o-mini (双 Agent 架构：内容生成 + 兴趣分析)
