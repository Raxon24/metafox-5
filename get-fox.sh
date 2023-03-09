#!/bin/bash

sudo apt update & sudo apt upgrade

#  Install needed PKG

sudo apt install -y wget unzip nano curl ca-certificates gnupg lsb-release dirmngr gnupg gnupg-l10n gnupg-utils gpg gpg-agent gpg-wks-client
  gpg-wks-server gpgconf gpgsm libassuan0 libksba8 libnpth0 pinentry-curses dbus-user-session pinentry-gnome3 tor parcimonie xloadimage scdaemon
  pinentry-doc

# Debian Bullseye 11 (stable)
# remove all Docker install

sudo apt-get remove docker docker-engine docker.io containerd runc

sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      
# Install Docker Engine

sudo apt-get update

sudo chmod a+r /etc/apt/keyrings/docker.gpg
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker run hello-world

mkdir ./public_html

unzip ./upload.zip -d ./public_html/

cp ./public_html/htaccess.example ./public_html/.htaccess

chown -R daemon:daemon ./public_html

if [ ! -f ./docker/server.env ]
then
  cp ./docker/server.env.sample ./docker/server.env
fi

docker compose up -d

# Install frented

docker compose exec frontend-build yarn bundle:release

if [[ -d ./source/frontend_web/app/dist ]] 
then
    rm -rf ./public_html/storage/app/web
    cp -rf ./source/frontend_web/app/dist ./public_html/storage/app/web
fi

# Final Info

cat ./docker/server.env

cat wellcome.md




