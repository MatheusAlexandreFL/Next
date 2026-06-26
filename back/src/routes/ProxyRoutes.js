const express = require("express");
const https = require("https");
const http = require("http");
const router = express.Router();

/**
 * GET /proxy/video?url=<encoded_url>
 *
 * Proxy de vídeo: busca o arquivo no servidor remoto (Google Drive, etc.)
 * e repassa o stream para o cliente, resolvendo problemas de CORS.
 *
 * Suporta:
 *  - Google Drive (uc?id=... ou /file/d/.../view)
 *  - Qualquer URL direta de vídeo (.mp4, .webm, etc.)
 */
router.get("/proxy/video", async (req, res) => {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ erro: "Parâmetro 'url' é obrigatório." });
  }

  // Converte URLs do Google Drive para o formato de download direto
  const extractDriveId = (u) => {
    const matchFile = u.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
    const matchUc   = u.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
    const matchOpen = u.match(/drive\.google\.com\/open\?.*id=([^&]+)/);
    return matchFile?.[1] || matchUc?.[1] || matchOpen?.[1];
  };

  const driveId = extractDriveId(url);
  if (driveId) {
    url = `https://drive.google.com/uc?export=download&id=${driveId}&confirm=t`;
  }

  const fetchAndPipe = (targetUrl, redirectCount = 0) => {
    if (redirectCount > 5) {
      return res.status(502).json({ erro: "Muitos redirecionamentos." });
    }

    const lib = targetUrl.startsWith("https") ? https : http;

    const request = lib.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Range": req.headers["range"] || "",
      }
    }, (upstream) => {
      const { statusCode, headers } = upstream;

      // Segue redirecionamentos
      if ([301, 302, 303, 307, 308].includes(statusCode) && headers.location) {
        return fetchAndPipe(headers.location, redirectCount + 1);
      }

      // Repassa headers relevantes
      res.setHeader("Content-Type", headers["content-type"] || "video/mp4");
      if (headers["content-length"]) res.setHeader("Content-Length", headers["content-length"]);
      if (headers["content-range"]) res.setHeader("Content-Range", headers["content-range"]);
      if (headers["accept-ranges"]) res.setHeader("Accept-Ranges", headers["accept-ranges"]);
      res.setHeader("Access-Control-Allow-Origin", "*");

      res.status(statusCode === 206 ? 206 : 200);
      upstream.pipe(res);
    });

    request.on("error", (err) => {
      console.error("Erro no proxy de vídeo:", err.message);
      if (!res.headersSent) {
        res.status(502).json({ erro: "Falha ao buscar o vídeo." });
      }
    });
  };

  fetchAndPipe(url);
});

module.exports = router;
