FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# The actual code will be mounted as a volume
EXPOSE 3000

# Start the development server
CMD ["npm", "start"] 