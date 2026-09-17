# PFS 项目指令

## 产品与范围

- PFS 是一款本地智能数据分析 Agent，支持自然语言分析、受控数据查询、图表生成、多格式报告交付和结果历史回看。
- 当前交付以 Windows x64 和 macOS Apple Silicon 桌面运行形态为主，默认端口为 `5001`。
- 商业画布和 Google Sheets 不属于产品范围，不得重新加入入口、默认工具或发布材料。
- MCP、Teams、Hooks 和飞书是可选扩展；云端登录及 GPU/远程执行默认关闭。没有目标、凭据或显式配置时不得自动调用外部服务。
- 当前版本不提供图片上传和视觉分析。

## 权威文档

- 当前状态与下一步：`docs/HANDOFF.md`。
- 能力状态和验证边界：`docs/FUNCTION_COMPATIBILITY_MATRIX.md`。
- 产品定位和用户流程：`docs/PFS数据分析Agent产品说明书.md`。
- 架构、接口、部署和扩展：`docs/PFS数据分析Agent项目技术文档.md`。
- 用户安装与使用：`README.md`、`PRODUCT.md`、`Information/Instruction.md`。

## 启动与质量检查

- macOS：`./install.sh`，然后 `./start.command`。
- Windows：运行 `install.ps1`，然后 `start.bat`。
- 本地开发：`.venv/bin/python app.py`；浏览器访问 `http://127.0.0.1:5001`。
- Python 测试：`PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -B -m unittest discover -s tests -p 'test_*.py' -q`。
- Python 静态检查：`.venv/bin/ruff check .`。
- 前端检查：`pnpm run format:check`、`pnpm run lint`、`pnpm run build:check`。
- 跨平台完整质量门：`pnpm run quality`（自动使用项目虚拟环境并启用 UTF-8）。
- 提交前运行：`git diff --check`。

## 代码地图

- `app.py`：应用入口。
- `api/`：HTTP、SSE、数据源、会话、任务和系统接口。
- `agent/`：Agent Loop、工具、Skills、Commands、Workflow 和扩展。
- `data/`：会话、工作区、数据源和运行状态。
- `pfs_agent/`：分析合同、查询策略和报告逻辑。
- `frontend/`、`templates/`、`static/`：桌面工作台前端。
- `Function/`：分析、清洗、图表和 Office 交付能力。
- `packaging/`、`installer/`：桌面打包和安装程序。
- `tests/`：回归、契约和发布检查。

## 工作规则

- 修改前检查当前分支和工作区差异，不覆盖其他人的未提交内容。
- 以当前源码、真实运行和对应测试为事实来源；源码存在不等于真实外部服务已经可用。
- 新功能按“输入、输出、权限、副作用、失败与重试”建立专项测试后再合入。
- 范围、默认开关或发布状态变化时，同步 `HANDOFF.md` 和能力矩阵。
- 不提交 `.env`、密钥、令牌、数据库、用户上传、业务数据、输出文件、缓存、虚拟环境或依赖目录。
- 保留 `LICENSE`、`NOTICE.md` 和适用的第三方许可证；不要将第三方代码错误声明为原创。
- 分别报告本地验证、commit、push、CI、安装包、Release、部署和 live 状态。
