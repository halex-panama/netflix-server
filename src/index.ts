import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const app: Express = express();
app.use(cors());

const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.themoviedb.org/3";

// Helper function to make API requests
const fetchFromTMDB = async (
  endpoint: string,
  queryParams: Record<string, string> = {}
) => {
  const params = new URLSearchParams({ api_key: API_KEY, ...queryParams });
  const response = await fetch(`${API_URL}${endpoint}?${params}`);
  return response.json();
};

// Define endpoints
app.get(
  "/:mediaType(popular|top_rated)",
  async (req: Request, res: Response) => {
    try {
      const { mediaType } = req.params;
      const type = mediaType.includes("movie") ? "movie" : "tv";
      const data = await fetchFromTMDB(`/${type}/${mediaType}`);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get(
  "/:mediaType(movie|tv)/:id/:info(videos|credits|images|similar)?",
  async (req: Request, res: Response) => {
    try {
      const { mediaType, id, info } = req.params;
      const endpoint = info
        ? `/${mediaType}/${id}/${info}`
        : `/${mediaType}/${id}`;
      const data = await fetchFromTMDB(endpoint);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/search/:mediaType(movie|tv)", async (req: Request, res: Response) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;
    const data = await fetchFromTMDB(`/search/${mediaType}`, {
      query: query as string,
      page: page as string,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
