export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function pageSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function pageMeta(page: number, limit: number, total: number): PageMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}
