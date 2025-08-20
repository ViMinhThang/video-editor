import { Express, Request, Response } from "express";
import { asset_repo } from "../../../../domain";

export const createAssetRoutes = (app: Express) => {
  app.get("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const asset = await asset_repo.getAssetById(Number(req.params.id));
      if (!asset) return res.status(404).json({ message: "Asset not found" });
      res.json(asset);
    } catch (err) {
      console.error("Error get asset:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/assets", async (req: Request, res: Response) => {
    try {
      const assets = await asset_repo.getAssets(req.query);
      res.json(assets);
    } catch (err) {
      console.error("Error get assets:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/assets", async (req: Request, res: Response) => {
    try {
      const newAsset = await asset_repo.storeAsset(req.body);
      res.status(201).json(newAsset);
    } catch (err) {
      console.error("Error create asset:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/assets/:id", async (req: Request, res: Response) => {
    try {
      const success = await asset_repo.deleteAsset(Number(req.params.id));
      if (!success) return res.status(404).json({ message: "Asset not found" });
      res.status(204).send();
    } catch (err) {
      console.error("Error delete asset:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/assets/:id", async (req: Request, res: Response) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.patch("/api/assets/:id", async (req: Request, res: Response) => {
    res.status(501).json({ message: "Not implemented" });
  });
};
