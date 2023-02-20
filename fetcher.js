
const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error('Usage: node fetcher.js <url> <local_file_path>');
  process.exit(1);
}

const fileUrl = url.parse(args[0]);
const filePath = path.resolve(args[1]);

const options = {
  hostname: fileUrl.hostname,
  path: fileUrl.path,
  headers: {
    'User-Agent': 'Node.js'
  }
};

http.get(options, (response) => {
  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });
  response.on('end', () => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(`Error saving file: ${err.message}`);
        process.exit(1);
      } else {
        const fileSize = fs.statSync(filePath).size;
        console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
      }
    });
  });
}).on('error', (err) => {
  console.error(`Error downloading file: ${err.message}`);
  process.exit(1);
});
