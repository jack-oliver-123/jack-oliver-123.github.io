---
title: "Windows Docker 安装 Seata"
description: "在 Windows Docker Desktop 中部署 Seata Server，并说明控制台访问和基础接入方式。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Seata 用于处理分布式事务，常见于多个服务或多个数据库之间需要保证一致性的场景。本文记录如何在 Windows Docker Desktop 中快速启动 Seata Server。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

创建工作目录：

```txt
D:\seata-env
```

## 编写 docker-compose

在 `D:\seata-env` 下新建 `docker-compose.yml`：

```yaml
services:
  seata-server:
    image: seataio/seata-server:1.8.0
    container_name: seata-local
    restart: always
    ports:
      - "8099:8099"
      - "7091:7091"
    environment:
      - SEATA_IP=127.0.0.1
      - STORE_MODE=file
      - TZ=Asia/Shanghai
```

端口说明：

- `8099`：Seata Server RPC 通信端口；
- `7091`：Seata Web 控制台端口。

## 启动 Seata

在 `D:\seata-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器状态：

```powershell
docker ps
```

查看日志：

```powershell
docker logs -f seata-local
```

## 登录控制台

浏览器访问：

```txt
http://localhost:7091
```

默认账号密码通常是：

```txt
seata / seata
```

## 创建 undo_log 表

如果业务数据库需要使用 AT 模式，需要在每个参与分布式事务的业务库中创建 `undo_log` 表：

```sql
CREATE TABLE `undo_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch_id` bigint(20) NOT NULL,
  `xid` varchar(100) NOT NULL,
  `context` varchar(128) NOT NULL,
  `rollback_info` longblob NOT NULL,
  `log_status` int(11) NOT NULL,
  `log_created` datetime NOT NULL,
  `log_modified` datetime NOT NULL,
  `ext` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

## 应用接入示例

Spring Cloud Alibaba 项目可引入 Seata 依赖：

```xml
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

基础配置示例：

```yaml
spring:
  cloud:
    seata:
      tx-service-group: app-tx-group
      service:
        vgroup-mapping:
          app-tx-group: default
        grouplist:
          default: 127.0.0.1:8099
```

代码中可以在需要全局事务的方法上使用：

```java
@GlobalTransactional(name = "app-global-tx", rollbackFor = Exception.class)
public void executeBusiness() {
    // 执行业务操作
}
```

## 常见问题

### 服务连接不上 Seata

优先检查：

- `SEATA_IP` 是否配置为客户端可访问的地址；
- `8099` 端口是否开放；
- 应用中的事务组名称是否和配置一致。

## 后续建议

- 本地开发可以使用 `file` 模式快速验证。
- 生产环境建议使用数据库或注册中心配置，并单独规划高可用部署。
