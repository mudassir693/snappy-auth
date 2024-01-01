FROM node:18

WORKDIR /app

# Copy the .env file and package.json
COPY .env .
COPY package.json .

# Install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code
COPY . .

# Initialize Prisma (You should provide your own prisma initialization steps here)
RUN npx prisma
RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]