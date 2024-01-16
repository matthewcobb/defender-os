#!/bin/bash

# Set the DISPLAY environment variable
export DISPLAY=:0.0  # Change this as needed, :0.0 is the default for a local display

# Check if the AppImage is executable and exists
APPIMAGE="/path/to/your/appimage.AppImage"  # Replace with the path to your AppImage
if [ -x "$APPIMAGE" ]; then
  # Launch the AppImage within Openbox
  openbox --startup "$APPIMAGE"
else
  echo "Error: AppImage not found or not executable."
  exit 1
fi
