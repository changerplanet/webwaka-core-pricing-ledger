import { z } from 'zod';
export const PricingLineItemSchema = z.object({
    componentId: z.string().uuid(),
    componentName: z.string(),
    componentType: z.string(),
    quantity: z.number().nonnegative(),
    unitPrice: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    description: z.string()
});
export const PricingResultSchema = z.object({
    tenantId: z.string().uuid(),
    pricingVersionId: z.string().uuid(),
    planId: z.string().uuid(),
    currency: z.string().length(3),
    totalAmount: z.number().nonnegative(),
    lineItems: z.array(PricingLineItemSchema),
    evaluationTimestamp: z.string().datetime(),
    billingPeriodStart: z.string().datetime(),
    billingPeriodEnd: z.string().datetime(),
    idempotencyComponents: z.object({
        tenantId: z.string().uuid(),
        planVersionId: z.string().uuid(),
        billingPeriodStart: z.string().datetime(),
        billingPeriodEnd: z.string().datetime()
    })
});
