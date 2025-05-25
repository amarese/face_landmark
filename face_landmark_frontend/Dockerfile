FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

ENV PORT=5000
ENV REACT_APP_API_URL=http://localhost:4000

CMD ["npm", "start"] 