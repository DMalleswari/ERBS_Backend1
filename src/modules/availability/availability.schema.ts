import { z } from "zod";

export const availabilityParamSchema = z.object({
  resourceId: z.uuid("resourceId must be a valid UUID"),
});

export const availabilityQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((value) => value.from < value.to, {
    message: "from must be before to",
    path: ["from"],
  });

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
