---
title: "Windows Docker 安装 Nacos"
description: "在 Windows Docker Desktop 中使用 Docker Compose 部署 Nacos 单机环境。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Nacos 可以作为注册中心和配置中心。本文记录如何在 Windows Docker Desktop 中部署 Nacos 单机环境，适合本地开发和功能验证。

## 准备工作

确认 Docker Desktop 正常运行：

```powershell
docker --version
```

创建工作目录：

```txt
D:
acos-env
```

## 编写 docker-compose

在 `D:
acos-env` 下新建 `docker-compose.yml`：

```yaml
services:
  nacos:
    image: nacos/nacos-server:v2.2.3
    container_name: nacos-local
    restart: always
    ports:
      - "8848:8848"
      - "9848:9848"
      - "9849:9849"
    environment:
      - MODE=standalone
      - NACOS_AUTH_ENABLE=false
      - JVM_XMS=512m
      - JVM_XMX=512m
      - TZ=Asia/Shanghai
```

端口说明：

- `8848`：Web 控制台和 HTTP API；
- `9848`：Nacos 2.x gRPC 客户端通信端口；
- `9849`：Nacos 2.x gRPC 服务端通信端口。

## 启动 Nacos

在 `D:
acos-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器：

```powershell
docker ps
```

查看日志：

```powershell
docker logs -f nacos-local
```

## 验证控制台

浏览器访问：

```txt
http://localhost:8848/nacos
```

默认账号密码通常是：

```txt
nacos / nacos
```

如果页面能正常打开，并能看到配置管理和服务管理菜单，说明 Nacos 已启动成功。

## 应用接入示例

Spring Cloud Alibaba 项目通常需要注册发现和配置中心依赖：

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

基础配置示例：

```yaml
spring:
  application:
    name: demo-service
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
```

## 常见问题

### 页面访问 404

确认访问地址带 `/nacos`：

```txt
http://localhost:8848/nacos
```

### 微服务无法注册

确认 `9848` 和 `9849` 端口已映射，并检查应用配置中的 `server-addr`。

## 后续建议

- 本地开发可以关闭鉴权，正式环境建议开启鉴权。
- 如果配置需要持久化，建议接入外部 MySQL。
