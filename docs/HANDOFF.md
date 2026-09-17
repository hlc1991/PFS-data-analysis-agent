# PFS 数据分析 Agent 开发交接

> 交付日期：2026-09-10  
> 本文件是新维护者了解当前状态和后续工作的首要入口。

## 1. 交付结论

PFS 当前具备可独立运行的本地数据分析工作台，包括自然语言交互、结构化数据接入、受控查询、确定性分析、图表与 Dashboard、Office 文件交付、会话任务和历史结果回看。

本交付包是一个不包含 Git 历史的源码快照，可直接作为新仓库的首次提交。源码快照来自 2026-09-10 的本地工作树；其 Git 基线为 `932b8a797125eaad86ac9dc1a1c2cce0b361f2b6`，并包含当时尚未形成提交的当前源码和文档内容。因此，本包不应被描述为与既有 `v0.1.0` 安装包字节一致；从本包发布新版本前必须重新运行测试、CI 和双平台打包。

## 2. 产品边界

当前包含：

- Windows x64、macOS Apple Silicon 本地工作台；
- CSV、XLSX、数据库和受控 HTTP 数据接入；
- Schema、数据预览、质量提示、只读 SQL 和分析工具；
- 图表、Dashboard、JSON、CSV、Excel、Word 和 PPT 交付；
- Session、Job、Run、Workflow、Skills、Commands、知识库和工作区；
- 来源快照、结果摘要、Artifact 和运行事件。

明确不包含：

- 商业画布；
- Google Sheets；
- 用户图片上传和视觉分析；
- 默认开启的云端登录或远程 GPU；
- 生产级多主机恢复、签名公证和共享线上服务承诺。

## 3. 当前验证状态

- 已发布版本：`v0.1.0`。
- 已发布运行包基线：`e10f4b3f7e700ebde721905ded1b674a4c5c636e`。
- Windows x64 与 macOS Apple Silicon 安装、启动和核心 smoke 已由项目方确认通过。
- Excel、Word、PPT 验收集已完成视觉检查。
- 脱敏真实业务数据验收已确认通过，原始数据和结论未收入交付包。
- MCP、Hooks、Teams、飞书和真实模型供应商仍需在具体账号、权限、网络与目标环境中单独验证。
- 云端登录及 GPU/远程执行默认关闭，未进行真实外部环境验收。

详细状态见 `docs/FUNCTION_COMPATIBILITY_MATRIX.md`。

## 4. 配置和运行数据

- 环境变量模板：`.env.example`。
- 模型配置、MCP 配置、数据库连接、Token 和 API Key 必须由接手人在本机重新配置。
- 本包不包含 `.env`、`LLM/*_config.json`、数据库、上传文件、输出文件、浏览器状态和任何真实凭据。
- Windows 运行数据默认位于 `%LOCALAPPDATA%\PFSDataAnalysisAgent`。
- macOS 运行数据默认位于 `~/Library/Application Support/PFSDataAnalysisAgent`。

## 5. 推荐接手顺序

1. 阅读根目录 `AGENTS.md`。
2. 阅读本文件、产品说明书、技术文档和能力矩阵。
3. 在新目录初始化 Git 仓库，并把本交付包作为首个基线提交。
4. 安装 Python 3.10+、Node.js 和 pnpm，完成源码启动。
5. 使用 `data/fixtures/pfs_sales.csv` 跑通核心分析闭环。
6. 运行 Python、Ruff、Prettier、ESLint 和前端构建检查。
7. 配置新仓库的 GitHub Actions，确认 Windows 和 macOS runner 通过。
8. 后续从能力矩阵中选择一个独立切片开发，专项验证后再合入。

## 6. 后续优先级

### P0：建立新维护基线

- 初始化新仓库和分支保护；
- 完成干净机器源码启动；
- 运行完整质量门；
- 确认首个提交 SHA 和 CI 对应一致；
- 生成新仓库自己的 Release 前重新构建安装包。

### P1：日常产品维护

- 修复真实使用中出现的数据兼容、模型协议和桌面交互问题；
- 每次修改保留对应回归测试；
- 保持 README、技术文档和能力矩阵与运行结果一致。

### P2：按条件启用扩展

- 真实 MCP、Hooks、Teams、飞书和模型供应商逐项验收；
- 云端登录和 GPU/远程执行只有在提供目标环境后才显式开启；
- 未验证能力只描述为“保留、待配置或实验性”。

## 7. 发布边界

源码通过、CI 通过、安装包生成、实机运行、Release 发布、服务器部署和 live 验证是不同状态。新维护者必须为每次发布记录目标提交、CI run、安装包校验值和实机 smoke 结果，不能用旧版本证据证明新版本。
