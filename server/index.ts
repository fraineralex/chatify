import { createServer } from 'node:http';

const PORT = process.env.PORT ?? 3000;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(PORT, () => console.log(`Listening on http:localhost:${PORT}`));
