#!/bin/bash

# Build and publish script for versynch package

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building versynch package...${NC}"

# Clean up previous builds
rm -rf dist/
mkdir -p dist

# Run TypeScript compiler
echo -e "Running TypeScript compiler..."
npx tsc
BUILD_RESULT=$?

if [ $BUILD_RESULT -ne 0 ]; then
  echo -e "\n❌ Build failed! Fix TypeScript errors and try again."
  exit 1
fi

# Copy package.json and README to dist
echo -e "Copying package files..."
cp package.json README.md dist/

# Display success message
echo -e "\n${GREEN}✅ Build completed successfully!${NC}"
echo -e "Files ready in dist/ directory."

# Prompt for publishing
read -p "Do you want to publish this version to npm? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "\n${YELLOW}Publishing to npm...${NC}"
  cd dist && npm publish
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Package published successfully!${NC}"
    echo -e "Package is now available on npm as 'versynch'"
  else
    echo -e "\n❌ Publishing failed. Check npm credentials and try again."
  fi
else
  echo -e "\nSkipping npm publish. Run 'cd dist && npm publish' when ready."
fi
