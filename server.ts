import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import https from "https";
import http from "http";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Stream proxy route to handle mixed content and CORS
  app.get("/api/stream", (req, res) => {
    let urlString = req.query.url as string;
    if (!urlString) {
      return res.status(400).send("No stream URL provided");
    }

    // A helper to follow redirects and handle HTTP/HTTPS automatically
    const followRedirectAndStream = (currentUrl: string, depth: number = 0) => {
      if (depth > 5) {
        return res.status(502).send("Too many redirects");
      }

      console.log(`Proxying stream: ${currentUrl}`);
      const client = currentUrl.startsWith("https") ? https : http;

      // Ensure we don't send restrictive headers
      const options = {
        headers: {
          'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*, audio/*',
          'Connection': 'keep-alive'
        }
      };

      const request = client.get(currentUrl, options, (streamRes) => {
        if (streamRes.statusCode && streamRes.statusCode >= 300 && streamRes.statusCode < 400 && streamRes.headers.location) {
          // Follow redirect
          let redirectUrl = streamRes.headers.location;
          if (!redirectUrl.startsWith('http')) {
             const baseUrl = new URL(currentUrl);
             redirectUrl = `${baseUrl.protocol}//${baseUrl.host}${redirectUrl}`;
          }
          return followRedirectAndStream(redirectUrl, depth + 1);
        }

        // Forward headers
        res.status(streamRes.statusCode || 200);
        if (streamRes.headers['content-type']) {
          res.setHeader('Content-Type', streamRes.headers['content-type']);
        }
        res.setHeader('Accept-Ranges', 'none'); // Icecast/Shoutcast streams usually don't support ranges cleanly
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

        // Pipe the audio stream back to the client
        streamRes.pipe(res);

        // Handle disconnects
        req.on('close', () => {
          request.destroy();
        });
      });

      request.on('error', (err) => {
        console.error(`Stream proxy error for ${currentUrl}:`, err);
        if (!res.headersSent) {
          res.status(500).send("Stream proxy error");
        }
      });
    };

    followRedirectAndStream(urlString);
  });

  app.get("/api/quran-fallback", async (req, res) => {
    try {
      const response = await fetch("https://misrquran.gov.eg/home");
      const html = await response.text();
      const appJsMatch = html.match(/src="(\/js\/app\.[^"]+\.js)"/);
      if (!appJsMatch) {
         return res.status(404).json({ error: "app js not found" });
      }
      const appJsRes = await fetch("https://misrquran.gov.eg" + appJsMatch[1]);
      const appJs = await appJsRes.text();
      const m3u8Match = appJs.match(/https?:\/\/[^"]+\.m3u8/);
      if (m3u8Match) {
         return res.json({ url: m3u8Match[0] });
      }
      return res.status(404).json({ error: "m3u8 not found" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
