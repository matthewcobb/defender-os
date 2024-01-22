#!/bin/bash

echo "-------------------------"
echo "🌈 Copying compiled files"
echo "-------------------------"

# Path to the package.json file
PACKAGE_JSON_PATH="./package.json"

# Check if jq is installed
if ! command -v jq &> /dev/null
then
  echo "jq could not be found, please install it to proceed."
  exit 1
fi

# Extracting the version from package.json
VERSION=$(jq -r '.version' "$PACKAGE_JSON_PATH")
NAME=$(jq -r '.name' "$PACKAGE_JSON_PATH")
SRC=$NAME-$VERSION-arm64.AppImage
NEWNAME=defender-os.AppImage

# Check if the version was extracted successfully
if [ -z "$VERSION" ]; then
  echo "🛑 Unable to extract version from package.json"
  exit 1
fi

# Make executable
chmod +x ./dist/$SRC
echo "✅ Release made executable."
echo "🤖 Sending to SSD..."

if [ -d /Volumes/Extreme\ SSD/ ]; then
  # Copy to pi
  cp -R ./dist/$SRC /Volumes/Extreme\ SSD/
  echo "✅ Sent."

    # Rename on pi
  mv /Volumes/Extreme\ SSD/$SRC /Volumes/Extreme\ SSD/$NEWNAME
  echo "✅ v$VERSION sent to Pi!"
else
  echo "🛑 Unable to connect to Pi, directory not found."
  exit 1
fi
