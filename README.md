### Status Page for people to see the status of reflector links such as allstar, echolink, and bridges! Example found here: https://kotalinkstatus.kidsontheair.net/

Install on debian:
 
 - `sudo -s`
 - `cd /opt`
 - `apt update && apt upgrade && apt install git && apt install node.js`
 - `git clone https://github.com/VALER24/reflector-status-page`
 - `cd /reflector-status-page`
 - `npm install express ejs axios child_process`
 - `npm i`
 - `node server.js`

To run daemon:

 - `mv reflector_status_page.service /etc/systemd/system/reflector_status_page.service`
 - `systemctl enable reflector_status_page`
 - `systemctl start reflector_status_page`
