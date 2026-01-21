import { z } from 'zod';
export declare const PricingPlanSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tenantId: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    description?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    tenantId: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    description?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type PricingPlan = z.infer<typeof PricingPlanSchema>;
//# sourceMappingURL=pricing-plan.d.ts.map