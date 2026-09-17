# PFS 接手验收清单

## 1. 文件与安全

- [ ] 根目录包含 `AGENTS.md`、`README.md`、`.env.example`、`LICENSE` 和 `NOTICE.md`。
- [ ] `docs/` 中包含交接、产品、技术、能力矩阵和本清单。
- [ ] 包内不存在 `.git`、`.env`、真实密钥、数据库、用户上传、业务原始数据、运行输出、虚拟环境和依赖目录。
- [ ] 阅读 `SHA256SUMS.txt` 并校验交付包完整性。

## 2. 本地源码启动

### macOS

- [ ] 安装 Python 3.10+、Node.js 和 pnpm。
- [ ] 运行 `./install.sh`。
- [ ] 运行 `./start.command`。
- [ ] 打开 `http://127.0.0.1:5001`，确认首页和健康状态正常。

### Windows

- [ ] 安装 Python 3.10+、Node.js 和 pnpm。
- [ ] 运行 `powershell -ExecutionPolicy Bypass -File .\install.ps1`。
- [ ] 运行 `start.bat`。
- [ ] 打开 `http://127.0.0.1:5001`，确认首页和健康状态正常。

## 3. 核心业务 smoke

- [ ] 新建会话。
- [ ] 上传 `data/fixtures/pfs_sales.csv`。
- [ ] 查看字段、行数和数据范围。
- [ ] 提问：“按地区汇总销售额，并说明哪个地区最高。”
- [ ] 核对总销售额为 `100,000`，华东 `42,000`、华南 `33,000`、华北 `25,000`。
- [ ] 生成一张地区销售额图表。
- [ ] 下载 JSON 或 CSV 结果。
- [ ] 在任务历史中重新打开本次运行和交付物。

## 4. 开发质量门

```bash
PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -B -m unittest discover -s tests -p 'test_*.py' -q
.venv/bin/ruff check .
pnpm run format:check
pnpm run lint
pnpm run build:check
git diff --check
```

- [ ] Python 测试通过。
- [ ] Ruff 通过。
- [ ] Prettier、ESLint 和前端构建通过。
- [ ] Git 差异检查通过。

## 5. 新仓库验证

- [ ] 初始化 Git 仓库并创建首次基线提交。
- [ ] 设置默认分支和必要的分支保护。
- [ ] 配置 GitHub Actions。
- [ ] 确认 CI 的 head SHA 与候选提交一致。
- [ ] 在 Windows x64 和 macOS Apple Silicon 分别完成一次安装、启动和核心 smoke。
- [ ] 新版本安装包从新仓库对应提交重新构建。

## 6. 验收记录

| 项目 | 结果 | 环境或版本 | 验收人 | 日期 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 源码启动 |  |  |  |  |  |
| 核心分析 |  |  |  |  |  |
| Office 交付 |  |  |  |  |  |
| Windows 安装 |  |  |  |  |  |
| macOS 安装 |  |  |  |  |  |
| CI |  |  |  |  |  |
