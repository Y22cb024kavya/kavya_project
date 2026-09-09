const http = require("http");
const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "../frontend/build");
const PORT = 3000;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  let filePath = path.join(BUILD_DIR, reqPath);

  // If path is directory, look for index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // If file doesn't exist, fallback to root index.html (SPA fallback)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(BUILD_DIR, "index.html");
  }

  const ext = path.extname(filePath);
  let contentType = "text/html";
  if (ext === ".js") contentType = "application/javascript";
  if (ext === ".css") contentType = "text/css";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".xml") contentType = "application/xml";
  if (ext === ".txt") contentType = "text/plain";
  if (ext === ".json") contentType = "application/json";

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(PORT, () => {
  console.log(`Verify server running at http://localhost:${PORT}/`);
});
