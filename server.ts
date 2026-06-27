import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Image Proxy Endpoint to bypass Jumpshare hotlinking protection
  app.get("/api/proxy-image", async (req, res) => {
    let imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("Missing url parameter");
    }

    try {
      console.log(`[Proxy] Request received for: ${imageUrl}`);

      // If it is a Jumpshare share webpage, fetch it first to extract the raw direct image URL
      if (
        (imageUrl.includes("jumpshare.com/share/") || imageUrl.includes("jumpshare.com/v/") || imageUrl.includes("jmp.sh/")) &&
        !imageUrl.endsWith("+") &&
        !imageUrl.includes("direct.jumpshare.com")
      ) {
        try {
          console.log(`[Proxy] Scrapes HTML page to extract image from: ${imageUrl}`);
          const webResponse = await fetch(imageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.9",
            }
          });

          if (webResponse.ok) {
            const html = await webResponse.text();
            
            // Try matching og:image meta tag
            const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                                 html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
            if (ogImageMatch && ogImageMatch[1]) {
              const resolved = ogImageMatch[1].replace(/&amp;/g, "&");
              console.log(`[Proxy] Successfully extracted og:image: ${resolved}`);
              imageUrl = resolved;
            } else {
              // Try matching twitter:image tag
              const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image:?s?r?c?["']\s+content=["']([^"']+)["']/i) ||
                                        html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image:?s?r?c?["']/i);
              if (twitterImageMatch && twitterImageMatch[1]) {
                const resolved = twitterImageMatch[1].replace(/&amp;/g, "&");
                console.log(`[Proxy] Successfully extracted twitter:image: ${resolved}`);
                imageUrl = resolved;
              } else {
                // Try finding any direct.jumpshare.com absolute URL
                const directMatch = html.match(/https:\/\/direct\.jumpshare\.com\/[^\s"']+/i);
                if (directMatch && directMatch[0]) {
                  const resolved = directMatch[0].replace(/&amp;/g, "&");
                  console.log(`[Proxy] Successfully found direct.jumpshare.com matching pattern: ${resolved}`);
                  imageUrl = resolved;
                } else {
                  // Fallback: append '+' to standard share link or convert to /v/...
                  if (imageUrl.includes("/share/")) {
                    imageUrl = imageUrl.replace("/share/", "/v/") + "+";
                  } else {
                    imageUrl = imageUrl + "+";
                  }
                  console.log(`[Proxy] No tags found in HTML, falling back to direct '+' pattern: ${imageUrl}`);
                }
              }
            }
          } else {
            console.warn(`[Proxy] Failed to fetch share page, using fallback '+' format: ${imageUrl}`);
            if (imageUrl.includes("/share/")) {
              imageUrl = imageUrl.replace("/share/", "/v/") + "+";
            } else {
              imageUrl = imageUrl + "+";
            }
          }
        } catch (scrapeErr) {
          console.error("[Proxy] Error during HTML scraping, using fallback:", scrapeErr);
          if (imageUrl.includes("/share/")) {
            imageUrl = imageUrl.replace("/share/", "/v/") + "+";
          } else {
            imageUrl = imageUrl + "+";
          }
        }
      }

      console.log(`[Proxy] Fetching raw binary from resolved image target: ${imageUrl}`);
      // Fetch the binary image data from the resolved direct URL
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        console.error(`[Proxy] Failed to fetch raw binary: ${response.status} ${response.statusText}`);
        return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

      // Retrieve binary data
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error) {
      console.error("[Proxy] Error routing image request:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // 2. Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 3. Vite development server / production static asset middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
