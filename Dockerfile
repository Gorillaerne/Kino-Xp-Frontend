FROM nginx:alpine

WORKDIR /usr/share/nginx/html


COPY . .


# Allow overriding backend URL via build arg
RUN echo "export const API_BASE_URL = '${API_URL}';" > ./config.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
