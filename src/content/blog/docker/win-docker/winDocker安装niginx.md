---
title: "Windows Docker 安装 Nginx"
description: "在 Windows Docker Desktop 中部署 Nginx，用于静态站点托管和反向代理。"
tags: ["Docker"]
draft: false
featured: false
---

## 适用场景

Nginx 常用于静态资源托管、反向代理、负载均衡和 HTTPS 入口。本文记录如何在 Windows Docker Desktop 中部署一个可挂载配置和静态页面目录的 Nginx。

## 准备工作

确认 Docker Desktop 已启动：

```powershell
docker --version
```

创建工作目录：

```txt
D:\nginx-env
```

在目录下创建：

```txt
D:\nginx-env\conf
D:\nginx-env\html
D:\nginx-env\logs
```

## 编写 Nginx 配置

在 `D:\nginx-env\conf` 下新建 `nginx.conf`：

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        # 如果需要反向代理后端服务，可以按需打开下面配置
        # location /api/ {
        #     proxy_pass http://host.docker.internal:8080/;
        #     proxy_set_header Host $host;
        #     proxy_set_header X-Real-IP $remote_addr;
        # }
    }
}
```

## 准备测试页面

在 `D:\nginx-env\html` 下新建 `index.html`：

```html
<h1>Hello Nginx</h1>
```

## 编写 docker-compose

在 `D:\nginx-env` 下新建 `docker-compose.yml`：

```yaml
services:
  nginx:
    image: nginx:1.24.0-alpine
    container_name: nginx-local
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./conf/nginx.conf:/etc/nginx/nginx.conf
      - ./html:/usr/share/nginx/html
      - ./logs:/var/log/nginx
    environment:
      - TZ=Asia/Shanghai
```

## 启动 Nginx

在 `D:\nginx-env` 目录执行：

```powershell
docker-compose up -d
```

查看容器状态：

```powershell
docker ps
```

## 验证访问

浏览器访问：

```txt
http://localhost
```

如果能看到 `Hello Nginx`，说明 Nginx 已经启动。

## 发布静态页面

如果你的前端项目构建后生成 `dist` 目录，可以把 `dist` 里的文件复制到：

```txt
D:\nginx-env\html
```

刷新浏览器即可看到新页面。

## 常见问题

### 80 端口被占用

可以修改宿主机端口：

```yaml
ports:
  - "8080:80"
```

然后访问：

```txt
http://localhost:8080
```

### 配置文件挂载错误

确保 `nginx.conf` 是文件，不是目录，也不要保存成 `nginx.conf.txt`。

## 后续建议

- 生产环境建议增加 HTTPS 配置。
- 反向代理时要明确后端服务地址和跨域策略。
- 静态文件更新后可以通过重启容器或刷新页面验证。
