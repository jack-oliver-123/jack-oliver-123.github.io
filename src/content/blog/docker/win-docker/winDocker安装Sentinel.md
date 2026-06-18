---
title: "Windows Docker 安装 Sentinel Dashboard"
description: "在 Windows Docker Desktop 中部署 Sentinel Dashboard，并说明访问、接入和验证方式。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Sentinel 用于流量控制、熔断降级、系统保护和热点参数防护。本文记录如何在 Windows Docker Desktop 中部署 Sentinel Dashboard 控制台。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

创建工作目录：

```txt
D:\sentinel-env
```

## 编写 docker-compose

在 `D:\sentinel-env` 下新建 `docker-compose.yml`：

```yaml
services:
  sentinel:
    image: bladex/sentinel-dashboard:1.8.6
    container_name: sentinel-local
    restart: always
    ports:
      - "8858:8858"
      - "8719:8719"
    environment:
      - SERVER_PORT=8858
      - sentinel.dashboard.auth.username=sentinel
      - sentinel.dashboard.auth.password=your_sentinel_password
      - TZ=Asia/Shanghai
```

端口说明：

- `8858`：Sentinel Dashboard Web 控制台端口；
- `8719`：客户端与控制台通信的默认端口。

## 启动 Sentinel

在 `D:\sentinel-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器状态：

```powershell
docker ps
```

查看日志：

```powershell
docker logs -f sentinel-local
```

## 登录控制台

浏览器访问：

```txt
http://localhost:8858
```

登录信息：

```txt
用户名: sentinel
密码: your_sentinel_password
```

刚登录时左侧菜单可能为空，这是正常现象。只有应用接入 Sentinel 并产生访问流量后，控制台才会显示对应应用。

## 应用接入示例

Spring Cloud Alibaba 项目可引入 Sentinel 依赖：

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

基础配置示例：

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8858
        port: 8719
```

## 验证方式

1. 启动应用；
2. 访问几次接入 Sentinel 的接口；
3. 刷新 Sentinel Dashboard；
4. 如果应用出现在左侧菜单，说明接入成功。

## 常见问题

### 控制台没有应用

Sentinel Dashboard 是懒加载机制，只有应用接入并产生流量后才会显示。

### 端口冲突

如果 `8858` 被占用，可以修改宿主机映射端口，例如：

```yaml
ports:
  - "8868:8858"
```

访问地址也要改成：

```txt
http://localhost:8868
```

## 后续建议

- 不要使用默认密码暴露到公网。
- 生产环境建议结合配置中心或持久化规则源管理限流规则。
