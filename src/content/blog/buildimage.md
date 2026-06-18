---
title: "构建一个完整的 Ubuntu 24.04 LTS 服务器环境镜像"
description: "一个完整的Ubuntu 24.04LTS服务器环境镜像的搭建示例"
tags: ["Ubuntu"]
draft: false
featured: true
---

## 文件结构

```
.
├── Dockerfile
├── supervisord.conf
├── logrotate-supervisor.conf
└── nginx.conf (可选，自定义站点配置)
```

---

## Dockerfile

```Dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai
ENV LANG=en_US.UTF-8
ENV SHELL=/bin/bash

ARG ROOT_PASSWORD=changeme
ARG DEPLOY_USER=deploy

# 阿里云镜像源加速（24.04 DEB822 格式）
RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirrors.aliyun.com/ubuntu/|g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's|http://security.ubuntu.com/ubuntu/|http://mirrors.aliyun.com/ubuntu/|g' /etc/apt/sources.list.d/ubuntu.sources

# 安装基础软件包（不加 --no-install-recommends，保持原生体验）
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    vim \
    git \
    sudo \
    net-tools \
    iputils-ping \
    dnsutils \
    telnet \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    cron \
    logrotate \
    supervisor \
    tzdata \
    locales \
    openssh-server \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    cmake \
    pkg-config \
    libssl-dev \
    htop \
    unzip \
    zip \
    tar \
    gzip \
    xz-utils \
    man-db \
    less \
    file \
    tree \
    jq \
    strace \
    && rm -rf /var/lib/apt/lists/*

# 时区和语言
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    locale-gen en_US.UTF-8

# 创建工作用户（禁止 root 直接 SSH）
RUN useradd -m -s /bin/bash ${DEPLOY_USER} && \
    echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    echo "${DEPLOY_USER}:${ROOT_PASSWORD}" | chpasswd

# 配置 SSH（仅允许工作用户登录）
RUN mkdir -p /var/run/sshd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 允许 pip 全局安装（Ubuntu 24.04 PEP 668 限制）
RUN mkdir -p /etc/pip && \
    echo "[global]\nbreak-system-packages = true" > /etc/pip/pip.conf

# 日志轮转配置
COPY logrotate-supervisor.conf /etc/logrotate.d/supervisor

# Supervisor 配置
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 创建日志目录
RUN mkdir -p /var/log/supervisor

EXPOSE 22 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

---

## supervisord.conf

```ini
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[unix_http_server]
file=/var/run/supervisor.sock
chmod=0700

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///var/run/supervisor.sock

[program:sshd]
command=/usr/sbin/sshd -D
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/sshd.log
stderr_logfile=/var/log/supervisor/sshd_err.log

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/nginx.log
stderr_logfile=/var/log/supervisor/nginx_err.log

[program:cron]
command=/usr/sbin/cron -f
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/cron.log
stderr_logfile=/var/log/supervisor/cron_err.log
```

---

## logrotate-supervisor.conf

```
/var/log/supervisor/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

---

## 构建镜像

```shell
docker build -t ubuntu24-server --build-arg ROOT_PASSWORD=your_secure_password .
```

## 运行容器

```shell
docker run -d \
    --name ubuntu24 \
    -p 2222:22 \
    -p 80:80 \
    -p 443:443 \
    --restart unless-stopped \
    ubuntu24-server
```

## 连接方式

```shell
# SSH 登录（使用 deploy 用户）
ssh deploy@localhost -p 2222

# 进入容器管理服务
docker exec -it ubuntu24 supervisorctl status
```

---

## 镜像包含

| 组件 | 说明 |
|------|------|
| SSH 服务 | 端口 22，仅 deploy 用户可登录，密码通过构建参数传入 |
| Nginx | 端口 80/443，默认站点 |
| Cron | 定时任务服务 |
| Supervisor | 进程管理，支持 `supervisorctl` 交互 |
| Logrotate | 日志自动轮转，保留 7 天 |
| Python 3.12 | 含 pip（已解除 PEP 668 限制）和 venv |
| 编译工具链 | build-essential, cmake, pkg-config, libssl-dev |
| 运维工具 | curl, wget, vim, htop, git, net-tools, jq, tree, strace 等 |
| 健康检查 | 每 30s 检测 Nginx 是否响应 |

---

## 与原生 Ubuntu 24.04 的已知差异

| 差异点 | 说明 | 影响 |
|--------|------|------|
| 无 systemd | 容器用 Supervisor 管理进程，`systemctl` 不可用 | 服务管理方式不同，需用 `supervisorctl` |
| 无内核 | 共享宿主机内核，无法加载内核模块 | 不影响日常开发 |
| 无 D-Bus | 桌面相关服务不可用 | 不影响服务器场景 |
| 无 snap | 容器内 snapd 不工作 | 用 apt 替代 |

---

