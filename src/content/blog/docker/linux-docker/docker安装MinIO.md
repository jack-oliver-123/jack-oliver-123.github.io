---
title: "Docker 安装 MinIO"
description: "使用 Docker 在 Linux 环境中部署 MinIO 对象存储，并启用控制台访问。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

MinIO 是兼容 S3 协议的对象存储服务，适合保存图片、文档、备份文件和其他非结构化数据。本文记录如何在 Linux 环境中使用 Docker 部署单节点 MinIO。

## 准备工作

确认 Docker 可用：

```bash
docker --version
```

准备数据和配置目录：

```bash
mkdir -p /opt/minio/data /opt/minio/config
```

## 拉取镜像

```bash
docker pull minio/minio:RELEASE.2025-04-22T22-12-26Z
```

## 启动 MinIO

```bash
docker run -d   --name minio   -p 9000:9000   -p 9001:9001   -e MINIO_ROOT_USER=your_minio_user   -e MINIO_ROOT_PASSWORD=your_minio_password   -v /opt/minio/data:/data   -v /opt/minio/config:/root/.minio   --restart unless-stopped   minio/minio:RELEASE.2025-04-22T22-12-26Z   server /data --console-address ':9001'
```

端口说明：

- `9000`：S3 API 访问端口；
- `9001`：Web 控制台端口。

## 验证安装

查看容器状态：

```bash
docker ps
```

查看日志：

```bash
docker logs -f minio
```

打开浏览器访问控制台：

```txt
http://服务器IP:9001
```

使用启动命令中配置的 `MINIO_ROOT_USER` 和 `MINIO_ROOT_PASSWORD` 登录。

## 创建 Bucket

登录控制台后，可以创建一个 Bucket，例如：

```txt
app-files
```

根据业务需要选择私有或公开访问策略。

## 常见问题

### 控制台打不开

检查：

- `9001` 是否映射；
- 服务器防火墙或安全组是否放行；
- 容器是否正常运行。

### API 访问失败

确认客户端连接的是 `9000` 端口，而不是控制台 `9001` 端口。

## 后续建议

- 生产环境不要使用弱密码。
- 重要数据需要规划备份策略。
- 多节点和纠删码模式需要单独规划磁盘和节点数量。
