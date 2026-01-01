const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5001;

const server = http.createServer((req, res) => {
    console.log(`${req.method} 请求: ${req.url}`);

    // 使用 WHATWG URL API
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    // --------------------
    // API 接口
    // --------------------
    if (parsedUrl.pathname === "/api/greet") {
        if (req.method === "GET") {
            const name = parsedUrl.searchParams.get("name") || "游客";
            const message = `你好，${name}！欢迎使用 Node 升级网站示例`;
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ message }));
            return;
        }

        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                try {
                    const data = JSON.parse(body);
                    const name = data.name || "游客";
                    const message = `你好，${name}！这是 POST 请求返回的问候`;
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    res.end(JSON.stringify({ message }));
                } catch (err) {
                    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                    res.end(JSON.stringify({ error: "请求体错误" }));
                }
            });
            return;
        }

        // 非 GET/POST
        res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "方法不支持" }));
        return;
    }

    // --------------------
    // 静态文件处理
    // --------------------
    let filePath = path.join(__dirname, "public", parsedUrl.pathname === "/" ? "index.html" : parsedUrl.pathname.slice(1));
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif"
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 未找到页面");
            return;
        }
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
        res.end(data);
    });

});

const PORT = process.env.PORT || 5001; // 云端自动分配端口 
server.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

