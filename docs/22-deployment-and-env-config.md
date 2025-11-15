# 部署与环境配置

## 1. 环境变量

* `CONVEX_DEPLOY_KEY`

* `OPENAI_API_KEY`（可选）

* `ZAI_API_KEY`（可选）

* `NEXTAUTH_SECRET` / Auth provider keys

* `APP_BASE_URL`

## 2. 环境（Env）

* `development`

* `staging`

* `production`

## 3. 部署流程（简化）

1. Convex:

   * `npx convex dev`（本地）

   * `npx convex deploy`（生产）

2. Next:

   * Vercel 或其他（build 命令 `next build`）

3. 验证：

   * `/rooms` 列表是否加载成功

   * 随机发送一条消息，看 Mazlo 是否响应

   * Memory Panel 是否可打开，无错误

