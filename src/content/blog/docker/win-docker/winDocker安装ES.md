---
title: "Windows Docker 安装 Elasticsearch 和 Kibana"
description: "在 Windows Docker Desktop 中部署 Elasticsearch、Kibana，并安装 IK 中文分词器。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Elasticsearch 适合全文检索、日志查询、聚合分析等场景。Kibana 用于可视化管理和查询 ES 数据。本文记录如何在 Windows Docker Desktop 中部署 Elasticsearch 7.17、Kibana 和 IK 中文分词器。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

## 调整 WSL 2 虚拟内存参数

Elasticsearch 需要较大的 `vm.max_map_count`。以管理员身份打开 PowerShell 或 CMD，执行：

```powershell
wsl -d docker-desktop -e sysctl -w vm.max_map_count=262144
```

Windows 重启后这个设置可能失效，如果 ES 再次启动失败，可以重新执行一次。

## 准备目录

创建工作目录：

```txt
D:\es-env
```

在目录下创建：

```txt
D:\es-env\config
D:\es-env\data
D:\es-env\plugins
```

在 `config` 目录下新建 `elasticsearch.yml`：

```yaml
http.host: 0.0.0.0
```

## 编写 docker-compose

在 `D:\es-env` 下新建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:7.17.14
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - TAKE_FILE_OWNERSHIP=true
    volumes:
      - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
      - ./data:/usr/share/elasticsearch/data
      - ./plugins:/usr/share/elasticsearch/plugins
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - es-net

  kibana:
    image: kibana:7.17.14
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - I18N_LOCALE=zh-CN
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - es-net

networks:
  es-net:
    driver: bridge
```

## 启动服务

在 `D:\es-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器状态：

```powershell
docker ps
```

## 验证 Elasticsearch 和 Kibana

访问 Elasticsearch：

```txt
http://localhost:9200
```

如果返回包含 `You Know, for Search` 的 JSON，说明 ES 启动成功。

访问 Kibana：

```txt
http://localhost:5601
```

首次启动可能需要等待 1-2 分钟。

## 安装 IK 中文分词器

进入 ES 容器：

```powershell
docker exec -it elasticsearch /bin/bash
```

安装与 ES 版本匹配的 IK 插件：

```bash
bin/elasticsearch-plugin install https://get.infini.cloud/elasticsearch/analysis-ik/7.17.14
```

安装完成后退出容器并重启 ES：

```bash
exit
docker restart elasticsearch
```

## 测试中文分词

打开 Kibana 的 Dev Tools，执行：

```json
POST _analyze
{
  "analyzer": "ik_max_word",
  "text": "精装一室一厅近地铁"
}
```

如果返回结果中能看到中文词语被拆分，说明 IK 插件已经生效。

## 常见问题

### ES 容器启动后立刻退出

先检查 `vm.max_map_count`，再查看日志：

```powershell
docker logs elasticsearch
```

### Kibana 访问不到 ES

确认两个服务在同一个 Docker 网络中，并且 `ELASTICSEARCH_HOSTS` 指向 `http://elasticsearch:9200`。

## 后续建议

- 生产环境需要单独规划账号、权限、备份和集群部署。
- 插件版本必须和 Elasticsearch 版本严格匹配。
- Windows 本地环境适合开发验证，不建议直接作为生产部署方案。
