import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedInfo: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Override req data with parsed (and stripped) data
      req.body = parsedInfo.body;
      req.query = parsedInfo.query;
      req.params = parsedInfo.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.format()));
      } else {
        next(error);
      }
    }
  };
};
