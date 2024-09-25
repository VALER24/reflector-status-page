const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');

const app = express();
const port = 3001;

// Middleware to use EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Utility function to check systemd service status
const checkSystemdStatus = (service) => {
  return new Promise((resolve, reject) => {
    exec(`systemctl is-active ${service}`, (error, stdout, stderr) => {
      if (error) {
        resolve(false);
      } else {
        resolve(stdout.trim() === 'active');
      }
    });
  });
};

// Route for the homepage
app.get('/', async (req, res) => {
  try {
    // Allstar status
    const allstarResponse = await axios.get('https://nodes1.allstarlink.org/cgi-bin/nodes.pl');
    const allstarStatus = allstarResponse.data.includes('57686') ? 'Online' : 'Offline';

    // Echolink status
    const echolinkResponse = await axios.get('https://www.echolink.org/logins.jsp');
    const echolinkStatus = echolinkResponse.data.includes('N0DYG-R') ? 'Online' : 'Offline';

    // DMR Bridge TGIF 350 status
    const dmrBridgeStatus = await checkSystemdStatus('mmdvm_bridge') ? 'Online' : 'Offline';

    // YSF Bridge status
    const ysfBridgeStatus = (await checkSystemdStatus('mmdvm_bridge2') && await checkSystemdStatus('mmdvm_reflector')) ? 'Online' : 'Offline';

    // P25 Bridge status
    const p25BridgeStatus = (await checkSystemdStatus('usrp2p25') && await checkSystemdStatus('mmdvm_reflector')) ? 'Online' : 'Offline';

    // P25/YSF Reflector status
    const reflectorStatus = await checkSystemdStatus('mmdvm_reflector') ? 'Online' : 'Offline';

    res.render('index', {
      allstarStatus,
      echolinkStatus,
      dmrBridgeStatus,
      ysfBridgeStatus,
      p25BridgeStatus,
      reflectorStatus
    });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
