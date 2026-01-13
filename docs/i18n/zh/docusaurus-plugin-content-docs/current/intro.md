---
sidebar_position: 1
---

# 简介

**claude-session-fork** 是一个 CLI 工具，让你可以在任意对话节点分叉 Claude Code 会话。

## 为什么需要 claude-session-fork？

使用 Claude Code 时，你经常会想：

- **探索替代方案** - 从同一起点尝试不同的方法
- **撤销错误** - 回到出错之前重新尝试
- **并行开发** - 同时处理多个功能
- **比较方案** - 用不同方式实现同一功能

claude-session-fork 让这一切变得简单——浏览你的会话，选择任意消息创建新的会话分支。

## 快速开始

```bash
# 全局安装
npm install -g claude-session-fork

# 在任意有 Claude Code 会话的目录运行
csfork
```

## 命令

| 命令 | 描述 |
|------|------|
| `csfork` | 推荐的短命令 |
| `sfork` | 更短的别名 |
| `claude-session-fork` | 完整命令名 |

## 功能特性

| 功能 | 描述 |
|------|------|
| 会话浏览器 | 浏览所有会话及预览 |
| 可视化历史 | 浏览所有消息及时间戳 |
| 代码变更标记 | 显示哪些消息修改了代码 |
| 灵活过滤 | 显示全部消息或仅用户消息 |
| 终端支持 | 支持 Terminal.app 和 iTerm2 |
