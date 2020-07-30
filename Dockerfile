FROM node

RUN mkdir -p /usr/src/app/backend
WORKDIR /usr/src/app/backend


COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
