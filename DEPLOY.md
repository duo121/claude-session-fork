# 部署指南 / Deployment Guide

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

### 1. Push to GitHub

```bash
git remote add origin https://github.com/duo121/claude-session-fork.git
git push -u origin main
```

### 2. Deploy Docs to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import `duo121/claude-session-fork`
3. Set root directory to `docs`
4. Deploy

Or use Vercel CLI:

```bash
cd docs
npm install
npx vercel
```

### 3. Publish to npm

```bash
# Login to npm
npm login

# Build and publish
npm run build
npm publish
```

Or use GitHub Actions (automatic on tag):

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 4. Setup Homebrew Tap

Create a new repo `homebrew-claude-session-fork`:

```bash
# After npm publish, get SHA256
npm pack claude-session-fork
shasum -a 256 claude-session-fork-*.tgz

# Update homebrew/claude-session-fork.rb with SHA256
# Then create tap repo and push
```

### 5. Quick Reference

| Method | Command |
|--------|---------|
| npm | `npm install -g claude-session-fork` |
| npx | `npx claude-session-fork` |
| Homebrew | `brew tap duo121/claude-session-fork && brew install claude-session-fork` |
| Script | `curl -fsSL https://raw.githubusercontent.com/duo121/claude-session-fork/main/scripts/install.sh \| bash` |

---

<a name="中文"></a>

## 中文

### 1. 推送到 GitHub

```bash
git remote add origin https://github.com/duo121/claude-session-fork.git
git push -u origin main
```

### 2. 部署文档到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入 `duo121/claude-session-fork`
3. 设置根目录为 `docs`
4. 部署

或使用 Vercel CLI：

```bash
cd docs
npm install
npx vercel
```

### 3. 发布到 npm

```bash
# 登录 npm
npm login

# 编译并发布
npm run build
npm publish
```

或使用 GitHub Actions（打 tag 自动发布）：

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 4. 设置 Homebrew Tap

创建新仓库 `homebrew-claude-session-fork`：

```bash
# npm 发布后获取 SHA256
npm pack claude-session-fork
shasum -a 256 claude-session-fork-*.tgz

# 更新 homebrew/claude-session-fork.rb 中的 SHA256
# 然后创建 tap 仓库并推送
```

### 5. 快速参考

| 方式 | 命令 |
|------|------|
| npm | `npm install -g claude-session-fork` |
| npx | `npx claude-session-fork` |
| Homebrew | `brew tap duo121/claude-session-fork && brew install claude-session-fork` |
| 脚本 | `curl -fsSL https://raw.githubusercontent.com/duo121/claude-session-fork/main/scripts/install.sh \| bash` |
