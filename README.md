# claude-session-fork

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

Fork Claude Code sessions at any conversation point and continue in a new terminal.

### Features

- 🔀 **Fork at any point** - Select any message to create a branch from
- 📜 **Session browser** - Browse all sessions with preview
- 📝 **Visual history** - Browse conversation with code change indicators
- 🖥️ **Dual terminal** - Works with Terminal.app and iTerm2
- ⚡ **Quick install** - One command to install globally

### Installation

#### npm (Recommended)

```bash
npm install -g claude-session-fork
```

#### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

#### From source

```bash
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork
npm install
npm run build
npm link
```

### Usage

```bash
# Open session list, select to fork
csfork

# Or use full name / short alias
claude-session-fork
sfork
```

**Session List Controls:**
- `↑↓` Navigate sessions
- `Enter` Select session
- `Esc` Exit

**Message List Controls:**
- `↑↓` Navigate messages
- `+/-` Expand/collapse message preview
- `Space` Toggle user-only filter
- `Enter` Fork at selected point
- `Esc` Back to session list / Exit

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Original Session                          │
├─────────────────────────────────────────────────────────────┤
│  [0] You: "Help me build a REST API"                        │
│  [1] Claude: "I'll help you create a REST API..."           │
│  [2] You: "Add authentication"         ◄── Fork Point       │
│  [3] Claude: "Let's add JWT authentication..."              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ csfork (select message 2)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
┌───────────────────┐                ┌───────────────────┐
│  Original Window  │                │   New Terminal    │
│  (continues)      │                │  (forked session) │
└───────────────────┘                └───────────────────┘
```

### Requirements

- macOS (uses AppleScript)
- Claude Code CLI
- Node.js 18+

### Documentation

Full docs: https://claude-session-fork.vercel.app

### License

MIT

---

<a name="中文"></a>

## 中文

在任意对话节点分叉 Claude Code 会话，在新终端继续。

### 功能特性

- 🔀 **任意节点分叉** - 选择任意消息创建分支
- 📜 **会话浏览器** - 浏览所有会话及预览
- 📝 **可视化历史** - 浏览对话，显示代码变更标记
- 🖥️ **双终端支持** - 支持 Terminal.app 和 iTerm2
- ⚡ **快速安装** - 一条命令全局安装

### 安装

#### npm（推荐）

```bash
npm install -g claude-session-fork
```

#### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

#### 从源码安装

```bash
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork
npm install
npm run build
npm link
```

### 使用方法

```bash
# 打开会话列表，选择后分叉
csfork

# 或使用完整名称 / 短别名
claude-session-fork
sfork
```

**会话列表快捷键：**
- `↑↓` 上下移动
- `回车` 选择会话
- `Esc` 退出

**消息列表快捷键：**
- `↑↓` 上下移动
- `+/-` 展开/收起消息预览
- `空格` 切换仅显示用户消息
- `回车` 在选中位置分叉
- `Esc` 返回会话列表 / 退出

### 工作原理

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
                           ▼ csfork（选择消息 2）
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
┌───────────────────┐                ┌───────────────────┐
│     原窗口        │                │     新终端        │
│    （继续）       │                │  （分叉的会话）   │
└───────────────────┘                └───────────────────┘
```

### 系统要求

- macOS（使用 AppleScript）
- Claude Code CLI
- Node.js 18+

### 文档

完整文档：https://claude-session-fork.vercel.app

### 许可证

MIT
