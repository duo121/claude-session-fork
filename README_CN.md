# claude-session-fork

[English](./README.md)

在任意对话节点分叉 Claude Code 会话，在新终端继续。

## 快速开始

### 模式一：在 Claude Code 中输入 `!sfork`

在与 Claude 对话时，直接输入 `!sfork`：

```
> !sfork
```

新终端标签页打开，显示分叉界面：

```
Fork (3/8) [1行]
Select the point to fork from

  ↑ 2 more above
   You  ◆ 帮我构建一个 REST API
   AI      我来用 Express 创建 REST API，首先...
❯  You  ◆ 添加认证
   AI   ◆ 为你的 API 添加 JWT 认证...
  ↓ 2 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Exit
```

选择一条消息按 `Enter` → 打开新终端，启动分叉的会话

---

### 模式二：在终端运行 `sfork --list`

浏览并选择你的所有 Claude Code 会话：

```bash
sfork --list
```

```
Sessions (1/42)
Select a session to fork from

❯ 帮我构建一个 REST API...
    2h ago · abc12345
  修复登录模块的 bug...
    5h ago · def45678
  重构数据库层提升性能...
    1d ago · ghi78901
  ↓ 39 more below

↑↓ Move · Enter Select · Esc Exit
```

按 `Enter` → 显示消息列表 → 选择分叉点 → 打开新终端

---

## 功能特性

- **任意节点分叉** - 选择任意消息创建分支
- **会话浏览器** - 浏览所有会话及预览
- **可视化历史** - 浏览对话，显示代码变更标记 (◆)
- **多终端支持** - 支持 Terminal.app、iTerm2、VS Code、Cursor、Kiro
- **自动检测** - 在 Claude Code 中自动使用当前会话

## 安装

### npm（推荐）

```bash
npm install -g claude-session-fork
```

### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

### 从源码安装

```bash
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork
npm install && npm run build && npm link
```

## 卸载

### npm

```bash
npm uninstall -g claude-session-fork
```

### Homebrew

```bash
brew uninstall claude-session-fork
brew untap duo121/claude-session-fork
```

### 从源码安装的

```bash
npm unlink -g claude-session-fork
```

## 使用方法

```bash
# 分叉当前会话（在 Claude Code 中自动检测）
sfork

# 显示会话列表选择
sfork --list
sfork -l

# 分叉指定会话
sfork --session=<session-id>

# 指定终端
sfork --terminal=iterm
sfork --terminal=vscode
```

**命令别名：** `sfork`, `csfork`, `claude-session-fork`

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

### 会话列表（--list 模式）
| 按键 | 操作 |
|------|------|
| `↑↓` | 上下浏览会话 |
| `回车` | 选择会话 |
| `Esc` | 退出 |

### 消息列表
| 按键 | 操作 |
|------|------|
| `↑↓` | 上下浏览消息 |
| `+/-` | 展开/收起预览（1-10 行）|
| `空格` | 切换仅显示用户消息 |
| `回车` | 在选中位置分叉 |
| `Esc` | 返回（列表模式）/ 退出 |

## 命令行选项

```bash
sfork                      # 分叉当前会话
sfork --list, -l           # 显示会话列表
sfork --session=<id>       # 分叉指定会话
sfork --cwd=<path>         # 指定工作目录
sfork --terminal=<type>    # 终端：auto, iterm, terminal, vscode, cursor, kiro
sfork --help, -h           # 显示帮助
sfork --version, -v        # 显示版本
```

## 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│                       原始会话                               │
├─────────────────────────────────────────────────────────────┤
│  [0] 你: "帮我构建一个 REST API"                             │
│  [1] Claude: "我来帮你创建 REST API..."                      │
│  [2] 你: "添加认证"                    ◄── 分叉点            │
│  [3] Claude: "让我们添加 JWT 认证..."                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ sfork（选择消息 2）
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
┌───────────────────┐                ┌───────────────────┐
│     原窗口        │                │     新终端        │
│    （继续）       │                │ （从消息 2 分叉） │
└───────────────────┘                └───────────────────┘
```

## 系统要求

- macOS（使用 AppleScript 控制终端）
- Claude Code CLI
- Node.js 18+

## 文档

https://claude-session-fork.vercel.app

## 许可证

MIT
