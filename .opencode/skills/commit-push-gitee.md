# commit-push-gitee

提交并推送项目到 Gitee 仓库。

## 触发条件

用户请求提交项目、推送代码、commit 并 push 时使用。

## 远程仓库

`http://gitee.com/zhang2261957216/gaojiwangyesheji_zhy.git`

## 步骤

1. 检查当前分支：`git branch --show-current`
2. 若未设置 remote，执行：`git remote add origin http://gitee.com/zhang2261957216/gaojiwangyesheji_zhy.git`
3. 暂存所有文件：`git add -A`
4. 提交：`git commit -m "<描述性提交信息>"`
5. 推送：`git push -u origin master`

## 注意事项

- 提交信息使用中文，简明描述本次变更
- 首次推送使用 `-u` 设置上游分支
- 若推送被拒绝，先执行 `git pull --rebase origin master` 再重试
