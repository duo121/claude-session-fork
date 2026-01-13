---
sidebar_position: 3
---

# 使用方法

## 基本用法

在任意有 Claude Code 会话的目录运行：

```bash
csfork
```

这会打开会话浏览器。选择一个会话，然后选择要分叉的消息。

## 工作流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    会话列表     │ ──► │    消息列表     │ ──► │    新终端       │
│  （选择一个）   │     │ （选择分叉点）  │     │ （分叉的会话）  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │ Esc                   │ Esc
        ▼                       ▼
      退出                  返回会话列表
```

## 会话列表快捷键

| 按键 | 操作 |
|------|------|
| `↑` `↓` | 上下浏览会话 |
| `回车` | 选择会话 |
| `Esc` | 退出 |

## 消息列表快捷键

| 按键 | 操作 |
|------|------|
| `↑` `↓` | 上下浏览消息 |
| `+` `-` | 展开/收起消息预览（1-10 行）|
| `空格` | 切换仅显示用户消息 |
| `回车` | 在选中位置分叉 |
| `Esc` | 返回会话列表 |

## 界面说明

### 会话列表

```
Sessions (1/5)
Select a session to fork from

❯ Help me build a REST API...
    2m ago · a1b2c3d4
  Add authentication to the project...
    1h ago · e5f6g7h8
  Fix the login bug...
    2d ago · i9j0k1l2

↑↓ Move · Enter Select · Esc Exit
```

### 消息列表

```
Fork (3/15) [2行]
Select the point to fork from · Esc to go back

  ↑ 2 more above
   You  ◆ Help me build a REST API
❯  AI   ◆ I'll help you create a REST API with Express...
   You    Add authentication
   AI   ◆ Let's add JWT authentication... (current)
  ↓ 8 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Back
```

### 界面元素

- **◆ 标记**：黄色菱形表示该消息有代码变更
- **(latest)**：标记最新的会话
- **(current)**：标记最新的消息
- **滚动提示**：显示可见区域上下方的项目数量

## 命令行选项

```bash
csfork --help              # 显示帮助
csfork --version           # 显示版本
csfork --session=<id>      # 直接分叉指定会话
csfork --cwd=/path         # 指定工作目录
csfork --terminal=iterm    # 强制使用 iTerm2
csfork --terminal=terminal # 强制使用 Terminal.app
```
