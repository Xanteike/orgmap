FROM nginx:1.27.3-alpine3.20

RUN addgroup -S sakura && adduser -S sakura -G sakura
COPY . /usr/share/nginx/html
RUN chown -R sakura:sakura /usr/share/nginx/html
USER sakura
ENTRYPOINT ["nginx", "-g", "daemon off;"]