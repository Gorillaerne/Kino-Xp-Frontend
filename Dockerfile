FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy frontend build files
COPY . .

# Allow overriding backend URL via build arg
ARG API_URL=http://localhost:8080
RUN echo "export const API_BASE_URL = '${API_URL}';" > ./config.js

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
