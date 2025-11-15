# 文件上传与附件

## 1. 目标

* 将文件附加到 Room / Thread / Message

* 后续可用于：

  * 记忆抽取（例如"从这个 PDF 提取项目背景"）

  * 向 LLM 提供上下文

## 2. 流程

1. 用户在 Composer 中点击"上传"

2. 前端：

   * 调用 Convex `attachments.upload` action：

     * 使用 Convex file storage API

3. 存储完成后：

   * 创建 `attachments` 记录

   * 在对应 Message 中添加文件引用

## 3. 未来扩展

* `memory.intakeForMessage` 可以检测附件：

  * 对特定类型文件（md/文本/PDF）使用额外 pipeline 抽取记忆候选。

