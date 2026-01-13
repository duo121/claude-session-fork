# 部署指南 / Deployment Guide

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

### 1. Publish to npm

```bash
# Login to npm
npm login

# Publish (first time)
npm publish

# Update version and publish
npm version patch  # or minor/major
npm publish
```

### 2. Deploy Docs to Vercel

#### Option A: Vercel CLI

```bash
cd docs
npm install
npx vercel
```

#### Option B: GitHub Integration

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `docs`
5. Deploy

### 3. Homebrew Tap (Optional)

Create a new repo `homebrew-sfork`:

```bash
# Create tap repo
gh repo create homebrew-sfork --public

# Copy formula
cp homebrew/sfork.rb homebrew-sfork/Formula/sfork.rb

# Update SHA256 after npm publish
shasum -a 256 $(npm pack sfork)

# Push
cd homebrew-sfork
git add . && git commit -m "Add sfork formula" && git push
```

Users can then install via:

```bash
brew tap user/sfork
brew install sfork
```

### 4. Quick Reference

| Method | Command |
|--------|---------|
| npm | `npm install -g sfork` |
| npx | `npx sfork` |
| Homebrew | `brew tap user/sfork && brew install sfork` |
| Script | `curl -fsSL https://raw.githubusercontent.com/user/sfork/main/scripts/install.sh \| bash` |
| Source | `git clone ... && npm install && npm link` |

---

<a name="中文"></a>

## 中文

### 1. 发布到 npm

```bash
# 登录 npm
npm login

# 首次发布
npm publish

# 更新版本并发布
npm version patch  # 或 minor/major
npm publish
```

### 2. 部署文档到 Vercel

#### 方式 A：Vercel CLI

```bash
cd docs
npm install
npx vercel
```

#### 方式 B：GitHub 集成

1. 推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的仓库
4. 设置根目录为 `docs`
5. 部署

### 3. Homebrew Tap（可选）

创建新仓库 `homebrew-sfork`：

```bash
# 创建 tap 仓库
gh repo create homebrew-sfork --public

# 复制 formula
cp homebrew/sfork.rb homebrew-sfork/Formula/sfork.rb

# npm 发布后更新 SHA256
shasum -a 256 $(npm pack sfork)

# 推送
cd homebrew-sfork
git add . && git commit -m "Add sfork formula" && git push
```

用户可以通过以下方式安装：

```bash
brew tap user/sfork
brew install sfork
```

### 4. 快速参考

| 方式 | 命令 |
|------|------|
| npm | `npm install -g sfork` |
| npx | `npx sfork` |
| Homebrew | `brew tap user/sfork && brew install sfork` |
| 脚本 | `curl -fsSL https://raw.githubusercontent.com/user/sfork/main/scripts/install.sh \| bash` |
| 源码 | `git clone ... && npm install && npm link` |
