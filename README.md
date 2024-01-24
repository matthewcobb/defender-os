# DefenderOS

## Features
- Carplay fully configurable upto 60fps @ 1080p (hardware capability dependent)
- Configurable key bindings
- Ability to choose microphone device and camera device

# Compiling using electron
Run the pi build script `npm run build:pi` and `npm run copy` to copy to an external drive.

**PLEASE NOTE: We must use node v16.\* to build with electron. `node-usb` lib has some issues that mean it will not work if compiled in a newer version**

# Installation

## Screen
Update /boot/config.txt
```
hdmi_group=2
hdmi_mode=87
hdmi_timings=400 0 100 10 140 1280 10 20 20 2 0 0 0 60 0 43000000 3
```

## ssh into pi
`ssh pi@hostname.local`

Update OS and install base packages.
```
sudo apt-get update -y
sudo apt-get upgrade -y
```

## Install samba
```
sudo apt-get install samba samba-common-bin
sudo smbpasswd -a pi
sudo nano /etc/samba/smb.conf # allow_read access to home folders
```

# Install electron packages
sudo apt-get install zlib1g-dev
sudo apt-get install fuse libfuse2
sudo apt-get install libatk1.0-0
```

## Thanks
Thank you to the react-carplay and node-carplay repos with which this would not be possible.
