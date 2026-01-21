import { z } from 'zod';
export declare const PricingContextSchema: z.ZodObject<{
    tenantId: z.ZodString;
    evaluationTimestamp: z.ZodString;
    billingPeriodStart: z.ZodString;
    billingPeriodEnd: z.ZodString;
    usage: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    seats: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    usage: Record<string, number>;
    evaluationTimestamp: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    metadata?: Record<string, unknown> | undefined;
    seats?: number | undefined;
}, {
    tenantId: string;
    evaluationTimestamp: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    metadata?: Record<string, unknown> | undefined;
    usage?: Record<string, number> | undefined;
    seats?: number | undefined;
}>;
export type PricingContext = z.infer<typeof PricingContextSchema>;
//# sourceMappingURL=pricing-context.d.ts.map