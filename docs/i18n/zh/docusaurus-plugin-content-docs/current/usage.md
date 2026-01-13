---
sidebar_position: 3
---

# 使用方法

## 基本用法

在任意有 Claude Code 会话的目录运行：

```bash
sfork
```

## 快捷键

| 按键 | 操作 |
|------|------|
| `↑` `↓` | 上下浏览消息 |
| `+` `-` | 展开/收起消息预览（1-10 行）|
| `空格` | 切换仅显示用户消息 |
| `回车` | 在选中位置分叉 |
| `Esc` | 退出 |

## 界面说明

```
Fork (3/15) [2行]
Select the point to fork from

  ↑ 2 more above
   You  ◆ Help me build a REST API
❯  AI   ◆ I'll help you create a REST API with Express...
   You    Add authentication
   AI   ◆ Let's add JWT authentication...
  ↓ 8 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Exit
```

### 界面元素

- **位置指示器**：`(3/15)` 显示当前位置
- **行数**：`[2行]` 显示展开的预览行数
- **◆ 标记**：黄色菱形表示该消息有代码变更
- **滚动提示**：显示可见区域上下方的消息数量

## 选项

### 终端选择

强制使用特定终端：

```bash
sfork --terminal=terminal  # 使用 Terminal.app
sfork --terminal=iterm     # 使用 iTerm2
sfork --terminal=auto      # 自动检测（默认）
```

### 指定工作目录

```bash
sfork --cwd=/path/to/project
```

## 工作流示例

1. 你正在开发一个功能，想尝试不同的方法
2. 在项目目录运行 `sfork`
3. 导航到你想分叉的消息
4. 按 `回车` 创建分叉
5. 新终端打开，加载分叉后的会话
6. 继续你的替代方案

两个会话现在完全独立——你可以比较结果或同时推进两条路线。
