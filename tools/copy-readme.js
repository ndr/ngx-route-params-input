const fs = require('fs');
const path = require('path');

const filename = 'README.md';

fs.copyFileSync(path.join(__dirname, `../${filename}`), path.join(__dirname, `../projects/ngx-route-params-input/${filename}`));