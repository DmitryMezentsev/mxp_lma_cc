FROM nginx:latest

COPY docker/nginx/default.conf /etc/nginx/conf.d/
COPY ./build/ /app/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]