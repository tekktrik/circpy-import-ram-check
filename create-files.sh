mkdir fatmount
for filesys in $(find tests -maxdepth 1 -not -name tests); do
    suffix=$(realpath --relative-to=tests $filesys)
    imagename="fat12_$suffix.img"
    truncate $imagename -s 1M
    mkfs.vfat -F12 -S512 $imagename
    sudo mount -o loop $imagename fatmount/
    sudo cp $filesys/* -r fatmount/
    sudo umount fatmount
done
sudo rm -rf fatmount
wget https://downloads.circuitpython.org/bin/raspberry_pi_pico/en_US/adafruit-circuitpython-raspberry_pi_pico-en_US-8.0.3.uf2 -O firmware.uf2
