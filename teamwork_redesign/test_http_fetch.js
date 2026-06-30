const http = require('http');
http.get('http://localhost:8080/', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Data length:', data.length);
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});
