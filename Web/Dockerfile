# stage: 1
FROM node:12.18.1 as react-build
WORKDIR /app
COPY . ./
RUN npm i
RUN npm run build

# stage: 2 — the production environment
FROM nginx:alpine

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD nginx
