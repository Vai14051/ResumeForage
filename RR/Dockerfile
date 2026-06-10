FROM node:20-alpine

WORKDIR /app
# Copy package files first
COPY package*.json ./
COPY prisma ./prisma
# install all dependencies 
RUN npm ci 
# copy source code 
COPY . .
# geenrate prisma client+complie typescript 
RUN npx prisma generate
RUN npm run build 

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

# #  Production stage -2
# FROM node:20-alpine AS production 

# WORKDIR /app
# # Only install production dependencies
# COPY package*.json ./
# # Copy complied code from builder stage 
# RUN npm ci --production

# # Copy Prisma  generated client form builder stage
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# COPY --from=builder /app/prisma ./prisma

# EXPOSE 3000

# # Run migrations and then start the server 

# CMD [ "sh","-c","npx prisma migrate deploy && node dist/server.js" ]