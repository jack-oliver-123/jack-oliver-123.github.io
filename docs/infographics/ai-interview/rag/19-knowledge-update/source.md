---
title: "19. RAG 知识库如何实现动态与持续更新？"
description: "介绍 RAG 知识库动态更新的实现方式，梳理增量入库、版本管理、索引刷新和数据一致性的工程方案"
tags: ["AI应用开发", "RAG"]
draft: false
featured: false
---

## 60 秒回答

持续更新的核心是可追溯、幂等的变更流水线。权威源产生新增、修改、删除事件；系统以稳定文档 ID、内容哈希和源版本去重，重新解析受影响文档，生成带版本的 chunk 与向量，并把正文、稀疏索引、向量索引、ACL 和缓存作为同一发布单元管理。

上线不应原地覆盖后立即全量切流。我会构建影子版本，校验数量、抽样内容与回归集，影子读比较后灰度，通过索引别名或版本路由原子切换，并保留旧版本用于回滚。监控更新延迟、失败队列、孤儿 chunk、删除传播和新鲜度 SLO。

## 详细解析

### 变更捕获与幂等

数据源可以通过 CDC、Webhook 或定时扫描提供变更。事件携带源记录 ID 与单调版本；消费者用幂等键避免重放产生重复。内容哈希用于跳过未变化正文，但权限、元数据或解析器版本变化仍可能要求更新派生数据。

### 更新与删除

修改文档时，用文档 ID 找到旧 chunk，生成新版本并在发布边界替换。删除必须传播到正文副本、向量、稀疏索引、图关系、缓存和备份策略。若数据库删除为异步可见，应把可见性延迟纳入合规与新鲜度 SLO。

### 发布与恢复

若正文与索引处于同一事务边界，可用版本字段原子提交。跨数据库、稀疏索引、向量索引和缓存的更新不能因规模小就直接双写；应通过 Transactional Outbox 或 CDC 发布事件，由幂等消费者更新派生数据，并持续对账。大规模切块或模型升级更适合重建新索引。灰度期间按请求固定到同一索引版本，失败时切回旧别名，并保留事件日志以便修复后重放。

## 工程实践与边界

- 记录源版本、解析器、切块、Embedding 和索引版本，支持端到端 lineage。
- 建立死信队列和人工修复工具，不让坏文档阻塞全部更新。
- 在发布门禁检查 ACL、空文本、异常 chunk 数、向量维度和抽样检索。
- 用“源变更到可检索”的分位数定义新鲜度，并针对高优先级数据单独设 SLO。

## 常见误区

- **“增量更新就是 upsert 向量”**：正文、稀疏索引、权限、缓存与关系也要一致更新。
- **“内容哈希没变就什么都不用做”**：ACL、有效期或模型版本可能已变化。
- **“删除数据库记录即可”**：派生索引和缓存可能继续返回旧内容。
- **“双写天然一致”**：任一写入失败都会分叉，需要 outbox、重试和对账。

## 面试追问

1. **Embedding 升级如何上线？** 新空间不能与旧向量混用，重建完整新索引，影子验证后切换查询编码器和索引绑定。
2. **怎样发现漏更新？** 定期按源数据做数量、版本与哈希对账，并抽样从源到索引反向追踪。
3. **回滚后新写入怎么办？** 保留变更日志和兼容写路径，旧版本服务期间继续捕获事件，修复后重放到新版本。

## 参考资料

- [Debezium Documentation](https://debezium.io/documentation/reference/stable/)
- [Milvus documentation: Insert, Upsert & Delete](https://github.com/milvus-io/milvus-docs/blob/v3.0.x/site/en/userGuide/insert-and-delete/insert-update-delete.md)
- [Qdrant: Points](https://qdrant.tech/documentation/concepts/points/)
- [Debezium Outbox Event Router](https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html)
