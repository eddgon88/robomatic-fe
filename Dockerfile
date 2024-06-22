FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --development

FROM nginx:1.23

COPY --from=build /app/dist/robomatic-fe /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
