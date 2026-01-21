import { z } from 'zod';

export const PricingContextSchema = z.object({
  tenantId: z.string().uuid(),
  evaluationTimestamp: z.string().datetime(),
  billingPeriodStart: z.string().datetime(),
  billingPeriodEnd: z.string().datetime(),
  usage: z.record(z.string(), z.number().nonnegative()).default({}),
  seats: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type PricingContext = z.infer<typeof PricingContextSchema>;
