# sfork

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

Fork Claude Code sessions at any conversation point and continue in a new terminal.

### Features

- 🔀 **Fork at any point** - Select any message to create a branch from
- 📜 **Visual history** - Browse conversation with timestamps and code change indicators
- 🖥️ **Dual terminal** - Works with Terminal.app and iTerm2
- ⚡ **Quick install** - One command to install globally

### Installation

#### npm (Recommended)

```bash
npm install -g sfork
```

#### Homebrew (macOS)

```bash
brew tap user/sfork
brew install sfork
```

#### From source

```bash
git clone https://github.com/user/sfork.git
cd sfork
npm install
npm link
```

### Usage

In any directory with Claude Code sessions:

```bash
sfork
```

**Controls:**
- `↑↓` Navigate messages
- `+/-` Expand/collapse message preview
- `Space` Toggle user-only filter
- `Enter` Fork at selected point
- `Esc` Exit

### How It Works

```
Original Session                    After Fork
─────────────────                   ──────────────────
[0] You: Build API                  Original Window
[1] Claude: Creating...             (continues)
[2] You: Add auth        ◄─ Fork    
[3] Claude: Adding JWT              New Terminal
[4] You: Use OAuth                  (starts from [2])
```

### Requirements

- macOS (uses AppleScript)
- Claude Code CLI
- Node.js 18+

### Documentation

Full docs: https://sfork.vercel.app

### License

MIT

---

<a name="中文"></a>

## 中文

在任意对话节点分叉 Claude Code 会话，在新终端继续。

### 功能特性

- 🔀 **任意节点分叉** - 选择任意消息创建分支
- 📜 **可视化历史** - 浏览对话，显示时间戳和代码变更标记
- 🖥️ **双终端支持** - 支持 Terminal.app 和 iTerm2
- ⚡ **快速安装** - 一条命令全局安装

### 安装

#### npm（推荐）

```bash
npm install -g sfork
```

#### Homebrew (macOS)

```bash
brew tap user/sfork
brew install sfork
```

#### 从源码安装

```bash
git clone https://github.com/user/sfork.git
cd sfork
npm install
npm link
```

### 使用方法

在任意有 Claude Code 会话的目录下：

```bash
sfork
```

**快捷键：**
- `↑↓` 上下移动
- `+/-` 展开/收起消息预览
- `空格` 切换仅显示用户消息
- `回车` 在选中位置分叉
- `Esc` 退出

### 工作原理

```
原始会话                           分叉后
─────────────────                   ──────────────────
[0] 你: 构建 API                    原窗口
[1] Claude: 正在创建...             (继续)
[2] 你: 添加认证        ◄─ 分叉点   
[3] Claude: 添加 JWT                新终端
[4] 你: 改用 OAuth                  (从 [2] 开始)
```

### 系统要求

- macOS（使用 AppleScript）
- Claude Code CLI
- Node.js 18+

### 文档

完整文档：https://sfork.vercel.app

### 许可证

MIT
