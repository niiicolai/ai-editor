# Use the official nginx image as a base
FROM nginx:latest

# Set maintainer label (optional but good practice)
LABEL maintainer="yourname@example.com"

# Copy custom configuration files into the image
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY html/ /usr/share/nginx/html/

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Set the default command (inherited from base image, but can be explicit)
CMD ["nginx", "-g", "daemon off;"]
