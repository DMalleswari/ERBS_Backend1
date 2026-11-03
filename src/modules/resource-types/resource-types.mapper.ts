import type { ResourceTypeDto, ResourceTypeRecord } from "./resource-types.types";

export function toResourceTypeDto(type: ResourceTypeRecord): ResourceTypeDto {
  return {
    id: type.id,
    code: type.code,
    name: type.name,
    description: type.description,
    isActive: type.isActive,
    createdAt: type.createdAt.toISOString(),
    updatedAt: type.updatedAt.toISOString(),
  };
}
