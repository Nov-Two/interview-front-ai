# 自动化部署文档 (直接构建版)

本文档指导你如何使用 **GitHub Actions** 将本项目自动部署到服务器 `8.134.131.208`。
**本方案不需要 Docker Hub 账号，直接在服务器上构建镜像。**

## 1. 部署原理

新的部署流程如下：

1. GitHub Actions 检出代码。
2. 通过 SCP 将代码文件复制到服务器目录 (`/home/interview-front-ai`)。
3. 通过 SSH 在服务器上执行 `docker build` 构建镜像。
4. 停止旧容器，启动新容器。

## 2. GitHub 仓库配置

你需要配置 GitHub Secrets 以允许 Actions 访问你的服务器。

1. 进入 GitHub 仓库页面 -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。
2. 只需添加以下两个变量：


| Secret 名称 | 值 (Value)      | 说明            |
| :---------- | :-------------- | :-------------- |
| `HOST`      | `8.134.131.208` | 服务器 IP 地址  |
| `PASSWORD`  | `Xg1218..`      | 服务器 SSH 密码 |

**不再需要 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD`。**

## 3. 服务器环境准备

请确保服务器已安装 Docker。

```bash
# 登录服务器
ssh root@8.134.131.208
# 输入密码: Xg1218..

# 检查 Docker 是否运行
docker -v
# 如果未安装，请执行：
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker
```

## 4. 触发部署

配置完成后，只要你将代码推送到 `main` 或 `master` 分支，GitHub Actions 就会自动执行部署。

你可以在 GitHub 仓库的 **Actions** 标签页查看部署进度。

## 5. 访问应用

部署成功后，访问地址保持不变：

* **前端页面**: [http://8.134.131.208:3001/interview_ai](http://8.134.131.208:3001/interview_ai)
* **后端 API**: Nginx 会自动将 `/api/` 请求代理到 `http://8.134.131.208:3001/api/`。

## 6. 常见问题

**Q: 为什么是 3001 端口？**
A: 因为服务器的 80 和 8080 端口已经被其他应用（如 Mother-like Pronunciation）占用了，所以我们将前端服务迁移到了 3001 端口。

**Q: 为什么部署时间变长了？**
A: 因为构建过程（npm install, npm build）现在是在你的服务器上进行的，而不是在 GitHub 的云端 Runner 上。如果服务器性能较低，构建可能会慢一些。但这样省去了上传下载镜像的时间和 Docker Hub 配置。

**Q: 服务器空间不足？**
A: 脚本中包含 `docker image prune -f`，每次部署后会自动清理未使用的旧镜像。构建过程产生的临时文件位于 `/home/interview-front-ai`，每次部署时会被覆盖更新。
