---
title: "Docker 安装 Nacos"
description: "使用 Docker 部署 Nacos 单机环境，并说明端口、数据源和验证方式。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Nacos 可以作为服务注册中心和配置中心。本文记录在 Linux 环境中使用 Docker 启动 Nacos 单机实例，适合本地开发、测试环境和小型验证场景。

官方网站：<https://nacos.io/>

## 准备工作

确认 Docker 可用：

```bash
docker --version
```

如果希望配置持久化，可以提前准备目录：

```bash
mkdir -p /opt/nacos/logs /opt/nacos/data
```

## 方式一：快速启动内置存储版本

适合本地临时验证：

```bash
docker run -d   --name nacos   -p 8848:8848   -p 9848:9848   -p 9849:9849   -e MODE=standalone   -e JVM_XMS=256m   -e JVM_XMX=256m   -e NACOS_AUTH_ENABLE=false   -e TZ=Asia/Shanghai   --restart unless-stopped   nacos/nacos-server:v2.3.0
```

## 方式二：连接外部 MySQL

如果希望配置数据持久保存到 MySQL，需要先准备 Nacos 数据库。

官方建表脚本：<https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql>

启动命令示例：

```bash
docker run -d   --name nacos-mysql   -p 8848:8848   -p 9848:9848   -p 9849:9849   -e MODE=standalone   -e JVM_XMS=256m   -e JVM_XMX=256m   -e SPRING_DATASOURCE_PLATFORM=mysql   -e MYSQL_SERVICE_HOST=your_mysql_host   -e MYSQL_SERVICE_PORT=3306   -e MYSQL_SERVICE_DB_NAME=nacos_config   -e MYSQL_SERVICE_USER=nacos_user   -e MYSQL_SERVICE_PASSWORD=your_mysql_password   -e MYSQL_SERVICE_DB_PARAM='characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false&serverTimezone=Asia/Shanghai'   -e NACOS_AUTH_ENABLE=false   -e TZ=Asia/Shanghai   --restart unless-stopped   nacos/nacos-server:v2.3.0
```

如果 MySQL 也跑在宿主机上，可以把 `MYSQL_SERVICE_HOST` 改为宿主机 IP。不同系统和网络模式下，`host.docker.internal` 不一定都可用。

## 验证安装

查看容器状态：

```bash
docker ps
```

查看启动日志：

```bash
docker logs -f nacos
```

打开浏览器访问：

```txt
http://服务器IP:8848/nacos
```

默认账号密码通常是：

```txt
nacos / nacos
```

如果开启鉴权，请使用你配置的账号密码。

## 常见问题

### 9848 / 9849 端口没有开放

Nacos 2.x 使用 gRPC 通信，除了 `8848`，还需要暴露 `9848` 和 `9849`。

### MySQL 连接失败

优先检查：

- MySQL 地址是否能从容器内访问；
- 数据库和表是否已创建；
- 用户名、密码和权限是否正确；
- MySQL 防火墙和安全组是否放行。

## 后续建议

- 临时验证可以关闭鉴权，正式环境建议开启鉴权。
- 生产环境建议使用外部 MySQL 或集群模式。
- 不要在公开网络暴露 Nacos 控制台。
