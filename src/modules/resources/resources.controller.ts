import type { Request, Response } from "express";
import { AppError } from "../../shared/errors";
import { sendData, sendPage } from "../../shared/http";
import {
  createResourceSchema,
  resourceIdParamSchema,
  resourceListQuerySchema,
  updateResourceSchema,
} from "./resources.schema";
import { resourceService } from "./resources.service";

function actorId(req: Request): string {
  if (!req.auth) {
    throw new AppError("Unauthorized", 401);
  }
  return req.auth.id;
}

export class ResourcesController {
  async create(req: Request, res: Response): Promise<void> {
    const body = createResourceSchema.parse(req.body);
    sendData(res, await resourceService.create(body, actorId(req)), 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = resourceListQuerySchema.parse(req.query);
    const result = await resourceService.list(query);
    sendPage(res, result.items, result.meta);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const params = resourceIdParamSchema.parse(req.params);
    sendData(res, await resourceService.getById(params.id));
  }

  async update(req: Request, res: Response): Promise<void> {
    const params = resourceIdParamSchema.parse(req.params);
    const body = updateResourceSchema.parse(req.body);
    sendData(res, await resourceService.update(params.id, body, actorId(req)));
  }

  async remove(req: Request, res: Response): Promise<void> {
    const params = resourceIdParamSchema.parse(req.params);
    await resourceService.remove(params.id, actorId(req));
    res.status(204).send();
  }
}

export const resourcesController = new ResourcesController();
