#!/bin/bash

echo "🚀 Setting up database..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🗄️ Pushing schema to database..."
npx prisma db push

# Seed the database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database setup complete!"
echo ""
echo "🔑 You can now use the following doctor IDs in your application:"
echo "Run 'npm run db:seed' to see the generated doctor IDs"
