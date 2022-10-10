git pull
npm run build:linux
cp -r ./firmwares/ ./dist/linux-arm64-unpacked/firmwares
cp -r ./esptool-2.8/ ./dist/linux-arm64-unpacked/esptool-2.8