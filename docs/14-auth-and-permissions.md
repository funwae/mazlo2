# 认证与权限

## 1. 认证来源

* 使用现成 Auth（Clerk / Auth0 / NextAuth 任一）

* 要求：

  * 提供 `user.externalId`

  * 登录状态同步到 Convex（`users` 表）

## 2. 权限规则（高层）

* Room：

  * 只有 Room 的 `ownerUserId` 或成员（如果未来有成员表）可以访问。

* Message：

  * 仅相关 Room 内用户可读写。

* Memory：

  * `ownerUserId` 限制读取/编辑。

  * system 级记忆仅开发者操作（暂可硬编码）。

## 3. Convex 函数安全

所有 Convex 函数要求：

* 通过 `auth.getUserIdentity()` 获取当前用户

* 若未登录 → 抛错

* 检查资源是否属于该用户或其可访问 Room

