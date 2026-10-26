---
name: commit-push-github
description: 提交并推送项目到 GitHub 仓库. Use when the user asks to commit, push, or submit code changes to GitHub remote repository.
---

# Commit Push GitHub

提交并推送项目到 GitHub 仓库。

## 远程仓库

- 实测可用（本机 22 端口被封，走 443）：`ssh://git@ssh.github.com:443/0721zhy/zhy.git`
- 等价 SSH 地址（需 ~/.ssh/config 将 github.com 指到 ssh.github.com:443）：`git@github.com:0721zhy/zhy.git`
- HTTPS 备用：`https://github.com/0721zhy/zhy.git`（需 Token，且本机有 SSL 拦截问题）

## 步骤

1. 检查当前分支：`git branch --show-current`
2. 检查现有 remote：`git remote -v`
3. 若 remote 已存在 origin 指向 Gitee，新增 GitHub 为 `upstream`：
   `git remote add upstream ssh://git@ssh.github.com:443/0721zhy/zhy.git`
4. 暂存所有文件：`git add -A`
5. 提交：`git commit -m "<描述性提交信息>"`（PowerShell 环境下用单行 `-m`，不要用 bash heredoc）
6. 推送到 GitHub：`git push -u upstream master` 或 `git push -u origin master`

## 注意事项

- 提交信息使用中文，简明描述本次变更
- 首次推送使用 `-u` 设置上游分支
- 若推送被拒绝，先执行 `git pull --rebase <remote> master` 再重试
- 用 SSH 推送前确保本机已加载公钥：`ssh -T git@github.com` 验证连接
- Windows PowerShell 环境下不要使用 bash 语法（heredoc、重定向拼接提交信息等）
- 推送到公共仓库前检查 `.env`、密钥文件是否已被 `.gitignore` 排除
