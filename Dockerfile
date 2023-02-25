FROM node:14

# Create app directory, this is in our container/ i our image
WORKDIR /chantrea/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8000
CMD [ "node", "dist/main" ]