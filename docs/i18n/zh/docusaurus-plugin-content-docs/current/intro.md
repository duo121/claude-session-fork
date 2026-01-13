---
sidebar_position: 1
---

# 简介

**claude-session-fork** 让你可以在任意对话节点分叉 Claude Code 会话。

## 为什么需要？

- **探索替代方案** - 从同一起点尝试不同方法
- **撤销错误** - 回到出错之前重新尝试
- **并行开发** - 同时处理多个功能
- **比较方案** - 用不同方式实现同一功能

## 快速开始

```bash
# 安装
npm install -g claude-session-fork

# 在 Claude Code 中运行：
sfork
```

## 功能特性

| 功能 | 描述 |
|------|------|
| 自动检测 | 在 Claude Code 中自动使用当前会话 |
| 会话浏览器 | 使用 `--list` 浏览所有会话 |
| 可视化历史 | 用 ◆ 标记代码变更 |
| 多终端支持 | Terminal.app、iTerm2、VS Code、Cursor、Kiro |

## 命令

```bash
sfork           # 分叉当前会话
sfork --list    # 从会话列表选择
sfork --help    # 显示帮助
```
