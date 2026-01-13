---
sidebar_position: 5
---

# 常见问题

## 通用问题

### sfork 支持 Windows/Linux 吗？

目前 sfork 仅支持 macOS，因为它使用 AppleScript 控制终端窗口。Linux/Windows 支持计划在未来版本中添加。

### 分叉会影响原始会话吗？

不会。分叉创建的是完全独立的副本，原始会话保持不变。

### 可以从分叉再次分叉吗？

可以！每个分叉的会话都是普通的 Claude Code 会话，可以再次分叉。

## 故障排除

### "No session found for this directory"

这表示该目录还没有使用过 Claude Code。请确保：

1. 你在正确的目录中
2. 之前在这里使用过 Claude Code
3. 会话存在于 `~/.claude/projects/`

### 新终端没有打开

检查：

1. Terminal.app 或 iTerm2 已安装
2. 在系统偏好设置 > 安全性与隐私 > 隐私 > 自动化 中授予了终端自动化权限

### 消息列表中缺少某些消息

sfork 会过滤掉系统消息和一些 Claude Code 内部消息。只显示有实际内容的用户和助手消息。

## 使用技巧

### 最佳实践

1. **在重大决策前分叉** - 尝试有风险的操作前创建分支
2. **使用描述性的首条消息** - 便于之后识别会话
3. **清理旧分叉** - 删除不用的会话文件以节省空间

### 查找会话文件

```bash
# 列出当前目录的所有会话
ls -la ~/.claude/projects/$(pwd | sed 's/^\///' | tr '/' '-')/

# 按内容搜索会话
grep -l "搜索词" ~/.claude/projects/*/*.jsonl
```

## 贡献

发现 bug 或有功能建议？请在 [GitHub](https://github.com/user/sfork/issues) 提交 issue。
