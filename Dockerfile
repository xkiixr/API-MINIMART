FROM --platform=linux/amd64 node:14.18.0
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN apt-get update && apt-get install -y openjdk-8-jre
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 80
USER node
CMD ["npm", "start"]
