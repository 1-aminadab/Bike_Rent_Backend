FROM node:18-alpine

WORKDIR /folder
COPY package*.json .
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
 