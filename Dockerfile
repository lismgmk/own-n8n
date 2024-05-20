# # Use official n8n image as the base
# ARG N8N_VERSION
# FROM n8nio/n8n:1.27.2

# USER root
# # Install your custom node
# RUN mkdir /custom 
# COPY . /custom  
# RUN cd /custom && npm i && npm run build && npm pack \
# 	&& cd /usr/local/lib/node_modules/n8n && npm install /custom/custom.tgz
FROM n8nio/n8n:1.27.2
USER root
RUN cd /usr/local/lib/node_modules/n8n && npm install npm install socket.io-client