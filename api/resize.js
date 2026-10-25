
import sharp from "sharp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Chi chap nhan POST"
    });
  }

  try {
    const { image, width, height } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "Chua gui anh"
      });
    }

    const inputBuffer = Buffer.from(image, "base64");

    let pipeline = sharp(inputBuffer);

    const w = Number(width);
    const h = Number(height);

    if (w > 0 && h > 0) {
      pipeline = pipeline.resize(w, h, {
        fit: "inside",
        withoutEnlargement: true
      });
    }

    const outputBuffer = await pipeline
      .jpeg({ quality: 80 })
      .toBuffer();

    return res.status(200).json({
      success: true,
      image: outputBuffer.toString("base64"),
      contentType: "image/jpeg"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Khong the xu ly anh"
    });
  }
}
