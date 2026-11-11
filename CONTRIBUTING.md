# 为大肌肌贡献

大肌肌是面向 Android 的独立 AGPL 改版，基于 [OpenGym](https://github.com/DuarteSantos8/openGym) 的指定提交开发。改版范围、构建方式及上游归属见 [FORK.md](FORK.md)。请把大肌肌的问题和拉取请求提交到[本仓库](https://github.com/abcpark666-dev/dajiji)，不要发到上游 OpenGym 的问题区。

## 从源码验证

首版重点是 Android。Windows PowerShell 构建调试 APK：

~~~powershell
cd frontend
npm ci
npm run build:mobile
cd android
.\gradlew.bat assembleSideloadDebug
~~~

前端测试可在 frontend 目录执行 npm test；修改某个功能时可用 npx vitest run 加对应测试文件路径。Android 原生代码改动应运行对应 Gradle 单元测试。新仓库的“大肌肌 Android source checks”工作流会检查关键功能、媒体隔离及调试 APK 构建。

## 代码与内容

- frontend/src 包含界面、训练逻辑与状态；frontend/android 是 Android 容器与原生集成；api 是可选自建服务；catalogue 保存动作文字资料。
- 修改训练记录、计划、导出或同步时，请添加能验证真实行为的测试。新增用户可见文案时，至少维护简体中文和英语回退，并执行语言包检查。
- 不要提交用户数据、密钥、签名文件、构建产物或调试报告。发布前检查暂存文件列表。
- 本改版不分发 Gym visual 的动作静帧或动画。不要复制上游仓库、网站、APK 中的这些媒体，也不要基于它们制作衍生素材；参见 [NOTICE.md](NOTICE.md)。若添加自己的动作图，请说明可供本项目使用的许可和来源。

## 许可与报告

贡献代码、文字和设计前，请确认有权按本仓库的 [GNU AGPL v3 许可](LICENSE) 提供内容，并保留必要的第三方声明。本仓库目前不要求签署额外 CLA；[CLA.md](CLA.md) 说明上游协议与本改版的区别。

一般问题、建议和可复现故障请使用[本仓库 Issues](https://github.com/abcpark666-dev/dajiji/issues)，已有改动请提交[本仓库 Pull Requests](https://github.com/abcpark666-dev/dajiji/pulls)。潜在漏洞请按 [SECURITY.md](SECURITY.md) 私下报告，不要在公开问题中披露可利用细节。