FROM node:16

WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./
RUN yarn install
COPY dist .
RUN ls -a
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "yarn", "start" ]