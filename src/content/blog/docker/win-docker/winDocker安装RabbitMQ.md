---
title: "Windows Docker 安装 RabbitMQ"
description: "在 Windows Docker Desktop 中部署 RabbitMQ，并启用管理控制台和数据持久化。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

RabbitMQ 是常见的消息队列，适合异步任务、服务解耦、削峰填谷和事件通知等场景。本文记录如何在 Windows Docker Desktop 中部署带管理控制台的 RabbitMQ。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

创建工作目录：

```txt
D:\rabbitmq-env
```

创建数据目录：

```txt
D:\rabbitmq-env\data
```

## 编写 docker-compose

在 `D:\rabbitmq-env` 下新建 `docker-compose.yml`：

```yaml
services:
  rabbitmq:
    image: rabbitmq:3.12-management
    container_name: rabbitmq-local
    restart: always
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=your_rabbitmq_password
    volumes:
      - ./data:/var/lib/rabbitmq
```

端口说明：

- `5672`：应用连接 RabbitMQ 的 AMQP 端口；
- `15672`：RabbitMQ Web 管理控制台端口。

## 启动 RabbitMQ

在 `D:\rabbitmq-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器状态：

```powershell
docker ps
```

查看日志：

```powershell
docker logs -f rabbitmq-local
```

## 登录管理控制台

浏览器访问：

```txt
http://localhost:15672
```

登录信息：

```txt
Username: admin
Password: your_rabbitmq_password
```

登录后可以看到 Connections、Channels、Exchanges、Queues 等管理页面。

## 应用连接信息

```txt
Host: localhost
Port: 5672
Username: admin
Password: your_rabbitmq_password
Virtual host: /
```

Spring Boot 配置示例：

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: your_rabbitmq_password
    virtual-host: /
    publisher-confirm-type: correlated
    publisher-returns: true
```

## 简单队列设计思路

常见使用方式：

1. 创建交换机，例如 `app.exchange`；
2. 创建队列，例如 `app.queue`；
3. 用 routing key 绑定交换机和队列；
4. 生产者发送消息；
5. 消费者监听队列处理消息。

## 常见问题

### 管理页面打不开

检查 `15672` 是否映射成功：

```powershell
docker ps
```

### 应用连接失败

检查账号密码、虚拟主机和端口配置是否一致。

## 后续建议

- 不要把真实密码提交到公开仓库。
- 生产环境应规划用户权限、镜像版本、磁盘挂载和队列持久化策略。
