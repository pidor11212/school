const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const port = 8080;
const root = __dirname;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/plain; charset=utf-8"
};

function localAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

const server = http.createServer((request, response) => {
  const url = decodeURIComponent(request.url.split("?")[0]);
  const target = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  const file = path.resolve(root, target);

  if (!file.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("");
  console.log("School Escape 3D запущен.");
  console.log("");
  console.log("Открой на этом компьютере:");
  console.log(`  http://localhost:${port}/`);
  console.log("");
  console.log("Для QR-кода используй одну из этих ссылок:");
  for (const address of localAddresses()) {
    console.log(`  http://${address}:${port}/`);
  }
  console.log("");
  console.log("Телефон должен быть в той же Wi-Fi сети.");
  console.log("Чтобы остановить сервер, закрой это окно или нажми Ctrl+C.");
});
