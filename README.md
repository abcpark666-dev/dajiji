# 大肌肌

![大肌肌图标](frontend/public/icon-512.png)

大肌肌是一款面向中文用户的 Android 健身记录 App，基于 [OpenGym](https://github.com/DuarteSantos8/openGym) 改造。它保留本地使用方式，并加入按周、按月查看与导出训练计划及分析报告的功能。当前版本为 **0.1.0**。

## 功能

- 按周或按月安排训练，建立和调整每次训练的动作。
- 记录训练时间、组数、次数、重量、组间休息，查看历史与进步对比。
- 按周或按月导出训练计划和训练分析 PDF；训练数据也可备份和导出。
- 可在设备本地使用；连接自建服务器为可选功能。

动作库的文字资料来自上游，但上游使用的 Gym visual 动作静帧与动画不在本改版的分发许可内。当前动作图使用本项目原创的通用占位图，**不包含动作示范动画**。

## 获取与构建

公开发行版本见本仓库的 [Releases](https://github.com/abcpark666-dev/dajiji/releases)。从源码在 Windows PowerShell 构建 Android 调试 APK：

```powershell
cd frontend
npm ci
npm run build:mobile
cd android
.\gradlew.bat assembleSideloadDebug
```

`build:mobile` 会生成 Android 资源，并检查输出不含上游受限媒体。完整构建与许可说明见 [FORK.md](FORK.md)。本仓库的首版目标仅为 Android；网站、iOS 与穿戴端不是本版发布物。

## 来源与许可

本改版基于 OpenGym 提交 `5f5832db56080837b58342ff50f78631dcc63e07`，按 [GNU AGPL v3](LICENSE) 开源。上游及第三方权利见 [NOTICE.md](NOTICE.md)，隐私说明见 [PRIVACY.md](PRIVACY.md)。**大肌肌由独立维护者开发，不受 OpenGym 官方赞助或背书。**