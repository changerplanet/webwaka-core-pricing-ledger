import { z } from 'zod';
export const PricingPlanSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    metadata: z.record(z.string(), z.unknown()).optional()
});
