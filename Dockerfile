FROM node:18
COPY . /app
WORKDIR /app
RUN npm install
RUN npm install sqlite3@^5.0.11
EXPOSE 4000
CMD [ "npm", "seed" ]
CMD [ "npm", "start" ]
