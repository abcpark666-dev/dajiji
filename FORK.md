# 大肌肌：OpenGym 的独立 AGPL 改版

本项目以 [OpenGym](https://github.com/DuarteSantos8/openGym) 的
`5f5832db56080837b58342ff50f78631dcc63e07` 提交为基线，面向中文 Android 用户改造。
大肌肌由独立维护者开发，与 OpenGym 官方没有赞助或背书关系。
本改版从 `0.1.0` 开始编号；上游基线版本为 `1.4.4`。

## 改版记录

- **2026-11-11 · 大肌肌 0.1.0**：更换应用名称、图标、启动图和默认配色；扩展周/月训练计划及训练记录展示，增加 PDF 导出和分析；将 Android 更新与深链指向本改版；排除 Gym visual 动作媒体，改用原创通用占位图。

## 授权与素材

- 源码按 [GNU AGPL v3](LICENSE) 发布。保留上游版权及[第三方声明](NOTICE.md)；后续发行也应记录改动日期和内容。
- OpenGym 的 Gym visual 动作静帧和动画不属于 AGPL 许可。本仓库不包含
  `catalogue/media/still/` 或 `catalogue/media/clip/`，Android 包也不得加入这些文件。
  内置动作目前显示本项目原创的通用[占位图](frontend/public/exercise-placeholder.svg)。
- 大肌肌的名称、像素「大」图标与紫橙配色是本改版新制作的品牌资源；不使用 OpenGym 的名称或杠铃标记作为产品标识。
- 仍使用的人体图形、ExerciseDB 来源文本与扫码依赖的归属及许可见 `NOTICE.md`。

## Windows 构建 Android 包

需要 Node.js、Android SDK、JDK 及 Gradle。首次构建，在 PowerShell 中运行：

```powershell
cd frontend
npm ci
npm run build:mobile
cd android
.\gradlew.bat assembleSideloadDebug
```

`build:mobile` 默认关闭 Gym visual 动作媒体，并检查网页产物与 Android 资源中没有
`exercise-media/` 文件。请勿从 OpenGym 的发布 APK 或网站提取动画填入此项目。

## 发行时提供源码

公开发布 APK 时，应同时提供该 APK **对应版本**的完整机器可读源码、构建脚本、
`LICENSE`、`NOTICE.md` 和明确的源码下载入口。若部署本改版的联网服务，
还应向远程使用者提供该版本源码入口。应用内“关于”页应填写本改版公开仓库地址；
本改版的公开仓库地址为 <https://github.com/abcpark666-dev/dajiji>。应用内更新检查仅查询该仓库的发行版；若尚未发布 Release，就不会提示更新。
发布 `v0.1.0` 时，请将 APK 与同一提交的源码归档或源码标签放在同一 Release，避免日后 `main` 分支变化使源码链接失准。

## 首版范围

首版只构建 Android。原项目的网站、iOS 与穿戴端发布素材、旧商店截图未纳入本改版。分享链接及 NFC 贴纸使用 `dajiji://` 深链；接收方需安装大肌肌。训练计划仍可通过文件导出。
