1. dokerfile 
    FROM node:lts-alpine as builder

    # env set
    ENV EVA_ENTRYPOINT=/api


    WORKDIR /
    COPY package.json /
    RUN npm install -g pnpm

    RUN pnpm install --registry=https://registry.npm.taobao.org

    RUN pnpm build

    FROM nginx:alpine

    RUN rm /etc/nginx/conf.d/default.conf
    
    # copy 和 add 命令都是基于当前dockerfile所在目录的
    ADD default.conf /etc/nginx/conf.d/

    COPY  /click-cat/ /usr/share/nginx/html/

    EXPOSE 80

2. default.conf 内容 ，这里必须只有server，可以有多个server，但是只有server
    server {
        listen       80;
        server_name  localhost; # 修改为docker服务宿主机的ip

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html =404;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

