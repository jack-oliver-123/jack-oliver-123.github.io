---
title: "Windows Docker 安装 Redis"
description: "在 Windows Docker Desktop 中部署 Redis，配置持久化、密码和本地连接验证。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Redis 常用于缓存、计数器、限流、分布式锁和消息队列等场景。本文记录如何在 Windows Docker Desktop 中部署一个带密码和持久化配置的 Redis 实例。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

创建工作目录，例如：

```txt
D:\redis-env
```

在目录下新建两个子目录：

```txt
D:\redis-env\config
D:\redis-env\data
```

## 编写 Redis 配置

在 `D:\redis-env\config` 下新建 `redis.conf`：

```text
bind 0.0.0.0
protected-mode no
appendonly yes
appendfilename "appendonly.aof"
requirepass your_redis_password
maxmemory 512mb
maxmemory-policy allkeys-lru
```

配置说明：

- `appendonly yes`：开启 AOF 持久化；
- `requirepass`：设置访问密码；
- `maxmemory`：限制最大内存；
- `allkeys-lru`：内存达到上限时淘汰最近最少使用的 key。

## 编写 docker-compose

在 `D:\redis-env` 下新建 `docker-compose.yml`：

```yaml
services:
  redis:
    image: redis:7.0.12
    container_name: redis-local
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - ./config/redis.conf:/etc/redis/redis.conf
      - ./data:/data
    command: redis-server /etc/redis/redis.conf
    environment:
      - TZ=Asia/Shanghai
```

## 启动 Redis

在 `D:\redis-env` 目录打开 PowerShell 或 CMD，执行：

```powershell
docker-compose up -d
```

查看容器：

```powershell
docker ps
```

## 验证安装

进入容器：

```powershell
docker exec -it redis-local redis-cli
```

输入密码：

```text
auth your_redis_password
```

写入并读取测试 key：

```text
set test_key "hello redis"
get test_key
```

如果能返回 `hello redis`，说明 Redis 可正常使用。

## 客户端连接信息

```txt
Host: 127.0.0.1
Port: 6379
Password: your_redis_password
```

可以使用 RedisInsight、Another Redis Desktop Manager 等工具连接。

## 常见问题

### 连接被拒绝

检查容器是否启动：

```powershell
docker logs redis-local
```

同时确认本机防火墙没有拦截 `6379`。

### 密码错误

确认客户端密码与 `redis.conf` 中的 `requirepass` 一致。

## 后续建议

- 不要把真实密码提交到公开仓库。
- 生产环境不要直接暴露 Redis 端口到公网。
- 重要数据建议结合 RDB/AOF 和外部备份策略。
