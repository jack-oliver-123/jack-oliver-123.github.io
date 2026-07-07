---
title: "Java基础面试题 · 锚点速查表"
description: "全系列 45 道面试题的记忆锚点汇总，一张表快速唤醒所有知识点"
tags: ["Java", "面试题", "记忆锚点", "速查表"]
draft: false
---

## 📋 锚点速查表

> 使用方法：看到锚点 → 脑中展开完整回答 → 用触发词检验是否遗漏关键点

---

### 01 · 语法与数据类型

| 题号 | 锚点 | 触发词 |
|------|------|--------|
| Q1 | == 比地址、equals 比内容、hashCode 是桶定位 | 自反性对称性、HashMap 定位 |
| Q2 | int 栈上裸奔、Integer 堆里穿衣 | 缓存池 -128~127、自动拆装箱 |
| Q3 | 八种基本类型 = 4整+2浮+1字符+1布尔 | 字节数、默认值、包装类 |
| Q4 | String 不可变 → Builder 单线程 → Buffer 多线程 | final char[]、扩容策略 |
| Q5 | double 会丢精度、BigDecimal 用字符串构造 | 浮点 IEEE 754、compareTo |
| Q6 | 窄化强转可能溢出、宽化自动提升 | 截断高位、提升规则 |
| Q7 | Java 只有值传递，引用传的是地址的副本 | 基本类型拷贝值、引用拷贝指针 |
| Q8 | 一次编译到处运行 = .java→字节码→JVM 翻译 | 跨平台、JIT 热点编译 |
| Q9 | new / 反射 / clone / 反序列化 / Unsafe | 五种创建对象方式 |

---

### 02 · 面向对象编程

| 题号 | 锚点 | 触发词 |
|------|------|--------|
| Q1 | 封装藏细节、继承复用、多态一接口多实现 | 访问修饰符、方法表、虚方法 |
| Q2 | 抽象类是模板、接口是契约 | 单继承多实现、default 方法 |
| Q3 | 重载看参数列表、重写看父子关系 | 编译期 vs 运行期绑定 |
| Q4 | 浅拷贝共享引用、深拷贝完全独立 | Cloneable、序列化深拷贝 |
| Q5 | static 属于类、final 不可变 | 类变量、常量池、不可继承 |
| Q6 | SOLID = 单一/开闭/里氏/接口隔离/依赖倒置 | 设计原则五字诀 |
| Q7 | 泛型编译期检查，运行时擦除为 Object | 类型擦除、桥方法 |
| Q8 | 反射 = 运行时获取类信息并操作 | Class 对象、性能开销 |
| Q9 | 注解 = 元数据标签，反射读取处理 | 保留策略、APT 编译期处理 |
| Q10 | 内部类持有外部引用、static 内部类不持有 | 内存泄漏、Handler 经典案例 |

---

### 03 · 异常处理与内存管理

| 题号 | 锚点 | 触发词 |
|------|------|--------|
| Q1 | Throwable 分 Error 和 Exception，Exception 分 checked 和 unchecked | 编译期强制处理、RuntimeException |
| Q2 | 堆存对象、栈存帧、方法区存类信息 | 线程私有/共享、PC 计数器 |
| Q3 | finally 一定执行（除 System.exit）| try-with-resources、返回值陷阱 |
| Q4 | 标记清除有碎片、复制浪费空间、标记整理慢但整齐 | 分代收集、新生代复制、老年代整理 |
| Q5 | OOM 先 dump 再 MAT 分析大对象 | 堆内存不足、Metaspace 溢出 |
| Q6 | throw 抛异常实例、throws 声明可能异常 | 方法签名、调用方处理 |
| Q7 | 可达性分析从 GC Roots 出发，不可达即回收 | 强/软/弱/虚四种引用 |
| Q8 | 双亲委派 = 先问爹再自己加载 | Bootstrap/Ext/App、打破委派 |

---

### 04 · I/O与基础并发

| 题号 | 锚点 | 触发词 |
|------|------|--------|
| Q1 | BIO 排队 → NIO 叫号 → AIO 外卖 | 餐厅模型、Selector、回调 |
| Q2 | volatile = 可见+有序−原子 | 内存屏障、MESI、DCL |
| Q3 | 偏向→轻量→重量 = VIP→排队→叫保安 | Mark Word、CAS、Monitor |
| Q4 | Channel 路、Buffer 车、Selector 调度台 | flip、epoll |
| Q5 | Thread 6 态 = 新→就绪运行→阻塞等待→死 | start/run、线程池 |
| Q6 | serialVersionUID = 身份证号 | transient、反序列化攻击 |
| Q7 | 千 BIO → 万 NIO → 十万 Netty | 连接数选型 |
| Q8 | native = 翻译官 | JNI、系统调用 |
| Q9 | JVM = OS 进程 | 1:1 线程模型、虚拟线程 |

---

### 05 · 设计模式与新特性

| 题号 | 锚点 | 触发词 |
|------|------|--------|
| Q1 | DCL = 双重if + synchronized + volatile | 指令重排、枚举最安全 |
| Q2 | Java 8 四件套 = Lambda+Stream+Optional+新日期 | 惰性求值、flatMap、函数式接口 |
| Q3 | JDK 要接口 → CGLIB 要继承 → final 不行 | Spring AOP、InvocationHandler |
| Q4 | 策略消灭 if-else → 责任链消灭耦合 | Spring Map 注入、FilterChain |
| Q5 | CompletableFuture = 异步回调链 | thenApply/thenCompose、线程池 |
| Q6 | reduce 归一、collect 归容器 | groupingBy、toMap 冲突 |
| Q7 | 简单→工厂方法→抽象工厂 | BeanFactory、FactoryBean |
| Q8 | 观察者 = 发布订阅 OOP 版 | EventListener、EventBus |
| Q9 | Java 21 = 虚拟线程+模式匹配+有序集合 | M:N 模型、switch 匹配 |

---

## 🧠 使用技巧

1. **每日速览**：花 5 分钟扫一遍锚点列，看到锚点立刻在脑中展开
2. **遮挡练习**：遮住触发词列，只看锚点，尝试回忆所有触发词对应的知识点
3. **反向检索**：看到触发词，反推对应的完整回答
4. **间隔重复**：第 1/3/7/14 天重复，长期记忆固化

---

## 🔗 返回目录

→ [Java基础面试题 · 总目录](../00-index/)
