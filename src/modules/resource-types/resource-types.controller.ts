import type { Request, Response } from "express";
import { AppError } from "../../shared/errors";
import { sendData, sendPage } from "../../shared/http";
import {
  createResourceTypeSchema,
  resourceTypeIdParamSchema,
  resourceTypeListQuerySchema,
  updateResourceTypeSchema,
} from "./resource-types.schema";
import { resourceTypeService } from "./resource-types.service";

function actorId(req: Request): string {
  if (!req.auth) {
    throw new AppError("Unauthorized", 401);
  }
  return req.auth.id;
}

export class ResourceTypesController {
  async create(req: Request, res: Response): Promise<void> {
    const body = createResourceTypeSchema.parse(req.body);
    sendData(res, await resourceTypeService.create(body, actorId(req)), 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = resourceTypeListQuerySchema.parse(req.query);
    const result = await resourceTypeService.list(query);
    sendPage(res, result.items, result.meta);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const params = resourceTypeIdParamSchema.parse(req.params);
    sendData(res, await resourceTypeService.getById(params.id));
  }

  async update(req: Request, res: Response): Promise<void> {
    const params = resourceTypeIdParamSchema.parse(req.params);
    const body = updateResourceTypeSchema.parse(req.body);
    sendData(res, await resourceTypeService.update(params.id, body, actorId(req)));
  }

  async remove(req: Request, res: Response): Promise<void> {
    const params = resourceTypeIdParamSchema.parse(req.params);
    await resourceTypeService.remove(params.id, actorId(req));
    res.status(204).send();
  }
}

export const resourceTypesController = new ResourceTypesController();
