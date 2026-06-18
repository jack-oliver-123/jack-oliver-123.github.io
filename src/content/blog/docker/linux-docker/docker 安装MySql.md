---
title: "Docker 安装 MySQL"
description: "使用 Docker 在 Linux 环境中安装 MySQL，并完成基础连接、用户创建和权限配置。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

这篇文章记录如何在 Linux 服务器上使用 Docker 快速启动 MySQL。适合本地开发、测试环境或轻量级服务部署。

示例会同时给出 MySQL 5.7 和 MySQL 8.0 的镜像命令。生产环境请结合备份、监控、权限隔离和安全策略进一步加固。

## 准备工作

开始前确认服务器已经安装 Docker：

```bash
docker --version
```

建议提前规划数据目录，避免容器删除后数据丢失：

```bash
mkdir -p /opt/mysql/data /opt/mysql/conf /opt/mysql/logs
```

## 拉取镜像

如果需要 MySQL 5.7：

```bash
docker pull mysql:5.7
```

如果需要 MySQL 8.0：

```bash
docker pull mysql:8.0
```

## 启动 MySQL 5.7

```bash
docker run -d   --name mysql57   -p 3306:3306   -e TZ=Asia/Shanghai   -e MYSQL_ROOT_PASSWORD=your_root_password   -v /opt/mysql/data:/var/lib/mysql   -v /opt/mysql/conf:/etc/mysql/conf.d   -v /opt/mysql/logs:/var/log/mysql   --restart unless-stopped   mysql:5.7
```

## 启动 MySQL 8.0

如果你使用 MySQL 8.0，可以换成下面的镜像：

```bash
docker run -d   --name mysql80   -p 3306:3306   -e TZ=Asia/Shanghai   -e MYSQL_ROOT_PASSWORD=your_root_password   -v /opt/mysql/data:/var/lib/mysql   -v /opt/mysql/conf:/etc/mysql/conf.d   -v /opt/mysql/logs:/var/log/mysql   --restart unless-stopped   mysql:8.0
```

## 进入容器

```bash
docker exec -it mysql57 bash
```

如果容器名称是 `mysql80`，就把命令里的容器名改掉：

```bash
docker exec -it mysql80 bash
```

## 登录 MySQL

```bash
mysql -u root -p
```

输入启动容器时配置的 `MYSQL_ROOT_PASSWORD`。

## 创建业务用户

```sql
CREATE USER 'app_user'@'%' IDENTIFIED BY 'your_app_password';
```

## 授权数据库权限

假设业务数据库名为 `app_db`：

```sql
GRANT CREATE, DROP, SELECT, INSERT, UPDATE, DELETE, ALTER ON app_db.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

如果数据库还没创建，可以先执行：

```sql
CREATE DATABASE app_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 验证连接

在宿主机上查看容器状态：

```bash
docker ps
```

查看 MySQL 日志：

```bash
docker logs -f mysql57
```

使用客户端连接：

```txt
Host: 服务器 IP
Port: 3306
User: app_user
Password: your_app_password
```

## 常见问题

### 端口被占用

如果 `3306` 已经被占用，可以换成宿主机其他端口：

```bash
-p 3307:3306
```

连接时端口也要改成 `3307`。

### 数据目录权限异常

如果容器启动失败并提示权限问题，先查看日志：

```bash
docker logs mysql57
```

必要时检查 `/opt/mysql` 目录权限。

## 后续建议

- 不要在生产环境使用弱密码。
- 定期备份 `/var/lib/mysql` 对应的数据目录。
- 生产环境建议限制数据库暴露端口，只允许可信来源访问。
