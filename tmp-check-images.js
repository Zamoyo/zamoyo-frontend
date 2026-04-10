const https = require('https');
const urls = [
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606220588913-b3aecb492b45?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80'
];

let completed = 0;
urls.forEach(url => {
  const req = https.request(url, { method: 'HEAD' }, res => {
    console.log(url, res.statusCode, res.headers['content-type']);
    if (++completed === urls.length) process.exit(0);
  });
  req.on('error', err => {
    console.error(url, 'ERROR', err.message);
    if (++completed === urls.length) process.exit(1);
  });
  req.end();
});
