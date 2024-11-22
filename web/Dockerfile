# 使用官方 Node.js 镜像
FROM node:22-alpine3.19

# 创建应用目录
WORKDIR /usr/src/app

# 安装应用依赖
COPY package*.json ./
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8080

# 启动服务器
CMD ["node", "server.js"]
