# Provider 适配层（OpenAI / z.ai）

## 1. 目标

* 把 "调用某个 LLM" 抽象为统一接口：

  * `chatCompletion({ messages, model, temperature, ... })`

  * `embed({ texts })`

* Provider 选择逻辑在一处维护。

## 2. 接口定义

TypeScript 接口（伪码）：

```ts

interface ChatProvider {

  name: "openai" | "zai";

  chatCompletion(args: {

    messages: ChatMessage[];

    model: string;

    temperature?: number;

    maxTokens?: number;

  }): Promise<{ content: string; raw: any }>;



  embed(args: { texts: string[]; model?: string }):

    Promise<number[][]>;

}

```

## 3. OpenAI 实现

* 使用 `@ai-sdk/openai` 或官方 SDK

* 从 env 中读取 `OPENAI_API_KEY`

## 4. z.ai 实现

* 使用 z.ai 官方 SDK or fetch

* 从 env 中读取 `ZAI_API_KEY`

## 5. Provider 选择策略

* 优先顺序：

  1. 用户在 Settings 中设置的 defaultProvider + model

  2. 若不可用 → 系统默认 ProviderConfig

* **Memory 相关调用**（Memory Plan / Summary / Embedding）可以使用更便宜/稳定的模型 preset，配置在代码中。

