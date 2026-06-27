import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: any, res: any) {
  // In Vercel serverless functions, query parameters are automatically parsed in req.query
  let imageUrl = req.query.url as string;
  if (!imageUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    console.log(`[Vercel Proxy] Request received for: ${imageUrl}`);

    // If it is a Jumpshare share webpage, fetch it first to extract the raw direct image URL
    if (
      (imageUrl.includes("jumpshare.com/share/") || imageUrl.includes("jumpshare.com/v/") || imageUrl.includes("jmp.sh/")) &&
      !imageUrl.endsWith("+") &&
      !imageUrl.includes("direct.jumpshare.com")
    ) {
      try {
        console.log(`[Vercel Proxy] Scraping HTML page to extract image from: ${imageUrl}`);
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
            console.log(`[Vercel Proxy] Successfully extracted og:image: ${resolved}`);
            imageUrl = resolved;
          } else {
            // Try matching twitter:image tag
            const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image:?s?r?c?["']\s+content=["']([^"']+)["']/i) ||
                                      html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image:?s?r?c?["']/i);
            if (twitterImageMatch && twitterImageMatch[1]) {
              const resolved = twitterImageMatch[1].replace(/&amp;/g, "&");
              console.log(`[Vercel Proxy] Successfully extracted twitter:image: ${resolved}`);
              imageUrl = resolved;
            } else {
              // Try finding any direct.jumpshare.com absolute URL
              const directMatch = html.match(/https:\/\/direct\.jumpshare\.com\/[^\s"']+/i);
              if (directMatch && directMatch[0]) {
                const resolved = directMatch[0].replace(/&amp;/g, "&");
                console.log(`[Vercel Proxy] Successfully found direct.jumpshare.com matching pattern: ${resolved}`);
                imageUrl = resolved;
              } else {
                // Fallback: append '+' to standard share link
                imageUrl = imageUrl.includes("/share/") ? imageUrl.replace("/share/", "/v/") + "+" : imageUrl + "+";
                console.log(`[Vercel Proxy] No tags found, falling back to direct '+' pattern: ${imageUrl}`);
              }
            }
          }
        } else {
          console.warn(`[Vercel Proxy] Failed to fetch share page, using fallback '+' format: ${imageUrl}`);
          imageUrl = imageUrl.includes("/share/") ? imageUrl.replace("/share/", "/v/") + "+" : imageUrl + "+";
        }
      } catch (scrapeErr) {
        console.error("[Vercel Proxy] Error during HTML scraping, using fallback:", scrapeErr);
        imageUrl = imageUrl.includes("/share/") ? imageUrl.replace("/share/", "/v/") + "+" : imageUrl + "+";
      }
    }

    console.log(`[Vercel Proxy] Fetching raw binary from resolved image target: ${imageUrl}`);
    // Fetch the binary image data from the resolved direct URL
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      console.error(`[Vercel Proxy] Failed to fetch raw binary: ${response.status} ${response.statusText}`);
      return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

    // Retrieve and send binary data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (error) {
    console.error("[Vercel Proxy] Error routing image request:", error);
    res.status(500).send("Internal Server Error");
  }
}
