import fs from 'fs';

// Use the built-in fetch in Node 18+ for multipart form submission
// This avoids needing any external form-data library.

const BASE_URL = 'http://localhost:3000';

const login = async () => {
  const res = await fetch(`${BASE_URL}/user-api/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
  });

  const data = await res.json();
  const cookies = res.headers.get('set-cookie');
  return { data, cookies };
};

const uploadResume = async (cookie) => {
  const form = new FormData();
  form.append('resume', fs.createReadStream('sample.pdf'));
  form.append('targetRole', 'Software Engineer');

  const res = await fetch(`${BASE_URL}/resume-api/upload`, {
    method: 'POST',
    headers: {
      Cookie: cookie || ''
    },
    body: form,
  });

  const data = await res.text();
  console.log('Upload status:', res.status);
  console.log('Upload response body:', data);
};

(async () => {
  try {
    const { data: loginData, cookies } = await login();
    console.log('Login response:', loginData);
    console.log('Received cookie:', cookies);

    await uploadResume(cookies);
  } catch (err) {
    console.error('Error during test:', err);
  }
})();
