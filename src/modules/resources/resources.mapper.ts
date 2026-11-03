import type { ResourceDto, ResourceRecord } from "./resources.types";

export function toResourceDto(resource: ResourceRecord): ResourceDto {
  return {
    id: resource.id,
    name: resource.name,
    description: resource.description,
    resourceTypeId: resource.resourceTypeId,
    capacity: resource.capacity,
    location: resource.location,
    isActive: resource.isActive,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}
