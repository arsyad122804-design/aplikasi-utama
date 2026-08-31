const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  // Decode URL in case of special characters
  const decodedUrl = decodeURIComponent(req.url);
  
  // Normalize and resolve path
  let filePath = decodedUrl === "/" ? "./index.html" : "." + decodedUrl;
  filePath = path.join(__dirname, filePath);
  
  // Prevent directory traversal attacks
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n=======================================================`);
  console.log(`✅ APLIKASI UTAMA BERHASIL DIJALANKAN!`);
  console.log(`💻 Di Laptop/PC ini, buka: http://localhost:${PORT}`);
  console.log(`-------------------------------------------------------`);
  console.log(`📱 Cara Akses & Instal dari HP / iPhone / iPad Anda:`);
  console.log(`1. Hubungkan HP & laptop ke jaringan WI-FI yang SAMA.`);
  console.log(`2. Ketahui IP Laptop Anda (di terminal/CMD: ipconfig).`);
  console.log(`3. Buka browser HP Anda lalu ketik: http://[IP_LAPTOP]:${PORT}`);
  console.log(`   (Contoh: http://192.168.1.10:${PORT})`);
  console.log(`=======================================================\n`);
});
