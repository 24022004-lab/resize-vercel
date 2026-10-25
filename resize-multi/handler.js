
import http from "node:http";
import sharp from "sharp";

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Chi chap nhan POST" }));
  }

  try {
    let body = "";

    for await (const chunk of req) {
      body += chunk;
    }

    const { image, width, height } = JSON.parse(body);

    if (!image) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Chua gui anh" }));
    }

    const w = Number(width);
    const h = Number(height);

    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Kich thuoc khong hop le" }));
    }

    const outputBuffer = await sharp(Buffer.from(image, "base64"))
      .resize(w, h, {
        fit: "inside",
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: true,
      image: outputBuffer.toString("base64"),
      contentType: "image/jpeg"
    }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Khong the xu ly anh" }));
  }
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Image resize server running on port 3000");
});
