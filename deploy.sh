#!/bin/bash

# Lovemore Netlify Deployment Script

echo "🚀 Building site..."
npm run build

echo "📦 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"
