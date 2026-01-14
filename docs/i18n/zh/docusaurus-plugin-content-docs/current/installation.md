---
sidebar_position: 2
---

# 安装

## 系统要求

- **macOS**（使用 AppleScript 控制终端）
- **Node.js 18+**
- **Claude Code CLI** 已安装并配置

## 安装

### npm（推荐）

```bash
npm install -g claude-session-fork
```

验证安装：

```bash
sfork --version
```

安装后，`/sfork` 斜杠命令将在 Claude Code 中可用。

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

### npx（免安装）

```bash
npx claude-session-fork
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
cd claude-session-fork
npm unlink -g claude-session-fork
```

## 常见问题

### "No session found"

确保你在之前使用过 Claude Code 的目录中。会话存储在 `~/.claude/projects/`。

### 权限被拒绝

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g claude-session-fork
```

### npm link 后找不到命令

```bash
npm link --force
```
