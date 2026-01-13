---
sidebar_position: 2
---

# 安装

## 系统要求

- **macOS**（使用 AppleScript 控制终端）
- **Node.js 18+**
- **Claude Code CLI** 已安装并配置

## 安装方式

### npm（推荐）

最简单的安装方式：

```bash
npm install -g sfork
```

验证安装：

```bash
sfork --version
```

### Homebrew (macOS)

```bash
brew tap user/sfork
brew install sfork
```

### 从源码安装

用于开发或自定义：

```bash
# 克隆仓库
git clone https://github.com/user/sfork.git
cd sfork

# 安装依赖
npm install

# 全局链接
npm link
```

### npx（免安装）

无需安装直接运行：

```bash
npx sfork
```

## 安装后

安装完成后，进入任意使用过 Claude Code 的目录：

```bash
cd your-project
sfork
```

工具会自动找到你的会话文件。

## 常见问题

### "No session found"

确保你在之前使用过 Claude Code 的目录中。会话存储在 `~/.claude/projects/`。

### 权限被拒绝

如果 npm 全局安装时遇到权限错误：

```bash
# 方案 1：使用 sudo（不推荐）
sudo npm install -g sfork

# 方案 2：修复 npm 权限（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g sfork
```
