FROM node:latest

WORKDIR /app

# Only copy package files first to leverage caching
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy the rest of the application
COPY . .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]