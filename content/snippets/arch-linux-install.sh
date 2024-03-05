---
title: Arch Linux install script
tags: arch linux snippets
---

#!/bin/bash

################################################################################
#                                                                              #
#           NOTE: For the latest version of this script, see:                  #
#                                                                              #
#           https://typechecked.net/link/arch/desktop.sh (desktop version)         #
#           https://typechecked.net/link/arch/zbook.sh   (laptop version)          #
#                                                                              #
################################################################################

# loadkeys colemak -- (ie. "iyasefjr cyifmae" typing colemak-style on qwerty)
# iwctl device list
# iwctl station wlan0 scan
# iwctl station wlan0 get-networks
# iwctl station wlan0 connect $SSID
# curl -LO https://typechecked.net/link/arch-linux-install.sh
# bash arch-linux-install.sh

set -e

function log {
  local LINE="[arch-linux-install] $*"
  echo "$LINE"
  echo "${LINE//?/-}"
}

function ask {
  read -p "$1> "
  eval "export $2=\$REPLY"
}

log "Setup questions:"
ask 'User passphrase' __PASSPHRASE__
ask 'Wireless SSID' __SSID__
ask 'Wireless passphrase' __WIFI_PASSPHRASE__

log "Checking network reachability"
ping -c 3 google.com

log "Setting up NTP"
timedatectl set-ntp true

log "Updating mirror list"
reflector -c Spain,France,Germany -a 6 --sort rate --save /etc/pacman.d/mirrorlist

log "Refreshing packages"
pacman -Syy

log "Partitioning disk"
cat << HERE | sfdisk /dev/nvme0n1
label: gpt
device: /dev/nvme0n1

/dev/nvme0n1p1: size=500MiB, type=uefi
/dev/nvme0n1p2: type=linux
HERE

log "Formatting /boot"
mkfs.fat -F32 /dev/nvme0n1p1

log "Mounting /dev/nvme0n1p2 at /"
echo -n "${__PASSPHRASE__}" | cryptsetup luksFormat /dev/nvme0n1p2 -
echo -n "${__PASSPHRASE__}" | cryptsetup open /dev/nvme0n1p2 cryptroot --key-file -
mkfs.ext4 /dev/mapper/cryptroot
mount /dev/mapper/cryptroot /mnt

mkdir -p /mnt/boot
mount /dev/nvme0n1p1 /mnt/boot

log "Creating /etc/fstab"
mkdir /mnt/etc
genfstab -U -p /mnt >> /mnt/etc/fstab

log "Installing base packages"
pacstrap /mnt base base-devel

cp /etc/pacman.d/mirrorlist /mnt/etc/pacman.d/

cat << HERE > /mnt/arch-install-chroot.sh
set -e

function log {
  local LINE="[arch-linux-install] \$*"
  echo "\$LINE"
  echo "\${LINE//?/-}"
}

log "Setting up database for 'pacman -F filename' searching"
pacman -Fy

log "Installing kernel and other packages"
pacman -S --noconfirm linux linux-lts linux-headers linux-lts-headers linux-firmware amd-ucode

log "Installing other packages you want"
pacman -S --noconfirm man-db terminus-font # for 4K display, instead of `setfont -d`

log "Preparing ramdisks for kernel boot"
sed -i 's/^HOOKS=(base udev autodetect modconf block filesystems keyboard fsck)/HOOKS=(base udev autodetect keyboard keymap modconf block encrypt filesystems fsck)/' /etc/mkinitcpio.conf

echo FONT=ter-132n >> /etc/vconsole.conf
echo KEYMAP=colemak >> /etc/vconsole.conf

mkinitcpio -p linux
mkinitcpio -p linux-lts

log "Setting up locale"
sed -i \
  -e 's/^#en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' \
  -e 's/^#en_AU.UTF-8 UTF-8/en_AU.UTF-8 UTF-8/' /etc/locale.gen
locale-gen

log "Setting up users"
echo "root:\$__PASSPHRASE__" | chpasswd
useradd -m -g users -G wheel wincent
echo "wincent:\$__PASSPHRASE__" | chpasswd
echo '%wheel ALL=(ALL) ALL' > /etc/sudoers.d/wheel
echo 'Defaults:wincent !lecture' > /etc/sudoers.d/wincent

log "Setting up boot"
pacman -S --noconfirm efibootmgr dosfstools os-prober mtools

PARTUUID=\$(lsblk /dev/nvme0n1p2 -o PARTUUID -d -n)

efibootmgr --disk /dev/nvme0n1 --part 1 --create --label "Arch Linux LTS" --loader /vmlinuz-linux-lts --unicode "cryptdevice=PARTUUID=\${PARTUUID}:root root=/dev/mapper/root rw initrd=\initramfs-linux-lts.img" --verbose
efibootmgr --disk /dev/nvme0n1 --part 1 --create --label "Arch Linux" --loader /vmlinuz-linux --unicode "cryptdevice=PARTUUID=\${PARTUUID}:root root=/dev/mapper/root rw initrd=\initramfs-linux.img" --verbose

echo 'efibootmgr --disk /dev/nvme0n1 --part 1 --create --label "Arch Linux LTS" --loader /vmlinuz-linux-lts --unicode "cryptdevice=PARTUUID='\${PARTUUID}':root root=/dev/mapper/root rw initrd=\initramfs-linux-lts.img" --verbose' > /boot/b.sh
echo 'efibootmgr --disk /dev/nvme0n1 --part 1 --create --label "Arch Linux" --loader /vmlinuz-linux --unicode "cryptdevice=PARTUUID='\${PARTUUID}':root root=/dev/mapper/root rw initrd=\initramfs-linux.img" --verbose' > /boot/a.sh
echo \\\\vmlinuz-linux-lts cryptdevice=PARTUUID=\${PARTUUID}:root root=/dev/mapper/root rw initrd=\\\\initramfs-linux-lts.img > /boot/b.nsh
echo \\\\vmlinuz-linux cryptdevice=PARTUUID=\${PARTUUID}:root root=/dev/mapper/root rw initrd=\\\\initramfs-linux.img > /boot/a.nsh

log "Setting up swap"
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
echo -e '\n/swapfile none swap sw 0 0' >> /etc/fstab

log "Installing other dependencies"
pacman -S --noconfirm git ruby tmux vi vim xorg-server

pacman -S --noconfirm inetutils # for hostname
pacman -S --noconfirm apcupsd # for auto-shutdown when UPS battery runs low
systemctl enable apcupsd

log "Installing gfx stuff"
pacman -S --noconfirm libva-mesa-driver linux-firmware mesa-vdpau vulkan-radeon xf86-video-amdgpu

log "Installing network support"
pacman -S --noconfirm wpa_supplicant wireless_tools netctl dhcpcd
pacman -S --noconfirm dialog # for wifi-menu, although we're not using it here

NETCTL_PROFILE=\$(echo "\$__SSID__" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
NETCTL_KEY=\$(wpa_passphrase "\$__SSID__" "\$__WIFI_PASSPHRASE__" | grep psk= | grep -v '#' | cut -d = -f 2)
NETCTL_CONFIG=/etc/netctl/\$NETCTL_PROFILE
NETCTL_SSID=\$(echo "\$__SSID__" | sed 's/ /\\\\ /g')
touch \$NETCTL_CONFIG
chmod 600 \$NETCTL_CONFIG
echo "Description='\$NETCTL_PROFILE'" >> "\$NETCTL_CONFIG"
echo "Interface=wlp4s0" >> "\$NETCTL_CONFIG"
echo "Connection=wireless" >> "\$NETCTL_CONFIG"
echo "Security=wpa" >> "\$NETCTL_CONFIG"
echo "ESSID=\$NETCTL_SSID" >> "\$NETCTL_CONFIG"
echo "IP=dhcp" >> "\$NETCTL_CONFIG"
echo "Key=\\\\\"\$NETCTL_KEY" >> "\$NETCTL_CONFIG"
netctl enable "\$NETCTL_PROFILE"

ln -sf /usr/share/zoneinfo/Europe/Madrid /etc/localtime
hwclock --systohc

log "Cloning dotfiles"
sudo -u wincent mkdir -p /home/wincent/code
sudo -u wincent git clone --recursive https://github.com/wincent/wincent.git /home/wincent/code/wincent

exit
HERE

log "Entering chroot environment"
arch-chroot /mnt /bin/bash arch-install-chroot.sh

log "Finished: rebooting"
rm /mnt/arch-install-chroot.sh

# Ignoring errors about unmounting...
set +e
umount -a

reboot
