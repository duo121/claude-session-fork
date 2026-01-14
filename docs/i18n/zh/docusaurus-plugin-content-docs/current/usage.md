---
sidebar_position: 3
---

# 使用方法

## 快速开始

```bash
# 在 Claude Code 中使用斜杠命令（推荐）
/sfork

# 或使用 shell 命令
!sfork

# 或从终端运行
sfork --list
```

## 命令

三个命令等效：

```bash
sfork                    # 短命令（推荐）
csfork                   # 备选
claude-session-fork      # 完整名称
```

## 模式

### 在 Claude Code 中使用（推荐）

```bash
/sfork    # 斜杠命令 - Claude 自动执行 !sfork
!sfork    # Shell 命令 - 直接运行 sfork
```

两种命令都会自动检测并分叉当前会话。

### 默认模式（当前会话）

```bash
sfork
```

自动检测并使用当前会话（最近修改的）。最适合在 Claude Code 中使用。

### 列表模式

```bash
sfork --list
sfork -l
```

显示当前目录的所有会话，选择一个进行分叉。

### 指定会话

```bash
sfork --session=<session-id>
```

按 ID 分叉指定会话。

## 工作流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    会话列表     │ ──► │    消息列表     │ ──► │    新终端       │
│  (--list 模式)  │     │ （选择分叉点）  │     │ （分叉的会话）  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │ Esc                   │ Esc
        ▼                       ▼
      退出                  返回会话列表
```

## 快捷键

### 会话列表

| 按键 | 操作 |
|------|------|
| `↑↓` | 上下移动 |
| `回车` | 选择 |
| `Esc` | 退出 |

### 消息列表

| 按键 | 操作 |
|------|------|
| `↑↓` | 上下移动 |
| `+/-` | 展开/收起预览（1-10 行）|
| `空格` | 切换仅显示用户消息 |
| `回车` | 分叉 |
| `Esc` | 返回 / 退出 |

## 终端选项

```bash
sfork --terminal=auto      # 自动检测（默认）
sfork --terminal=iterm     # iTerm2
sfork --terminal=terminal  # Terminal.app
sfork --terminal=vscode    # VS Code（复制命令）
sfork --terminal=cursor    # Cursor（复制命令）
sfork --terminal=kiro      # Kiro（复制命令）
```

对于 VS Code/Cursor/Kiro，命令会复制到剪贴板，粘贴到集成终端运行。

## 所有选项

```bash
/sfork                     # 斜杠命令（在 Claude Code 中）
!sfork                     # Shell 命令（在 Claude Code 中）
sfork                      # 分叉当前会话
sfork --list, -l           # 显示会话列表
sfork --session=<id>       # 分叉指定会话
sfork --cwd=<path>         # 工作目录
sfork --terminal=<type>    # 终端类型
sfork --help, -h           # 帮助
sfork --version, -v        # 版本
```
