import { z } from 'zod';
export declare const PricingLineItemSchema: z.ZodObject<{
    componentId: z.ZodString;
    componentName: z.ZodString;
    componentType: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    amount: z.ZodNumber;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    amount: number;
    unitPrice: number;
    componentId: string;
    componentName: string;
    componentType: string;
    quantity: number;
}, {
    description: string;
    amount: number;
    unitPrice: number;
    componentId: string;
    componentName: string;
    componentType: string;
    quantity: number;
}>;
export declare const PricingResultSchema: z.ZodObject<{
    tenantId: z.ZodString;
    pricingVersionId: z.ZodString;
    planId: z.ZodString;
    currency: z.ZodString;
    totalAmount: z.ZodNumber;
    lineItems: z.ZodArray<z.ZodObject<{
        componentId: z.ZodString;
        componentName: z.ZodString;
        componentType: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        amount: z.ZodNumber;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        amount: number;
        unitPrice: number;
        componentId: string;
        componentName: string;
        componentType: string;
        quantity: number;
    }, {
        description: string;
        amount: number;
        unitPrice: number;
        componentId: string;
        componentName: string;
        componentType: string;
        quantity: number;
    }>, "many">;
    evaluationTimestamp: z.ZodString;
    billingPeriodStart: z.ZodString;
    billingPeriodEnd: z.ZodString;
    idempotencyComponents: z.ZodObject<{
        tenantId: z.ZodString;
        planVersionId: z.ZodString;
        billingPeriodStart: z.ZodString;
        billingPeriodEnd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tenantId: string;
        billingPeriodStart: string;
        billingPeriodEnd: string;
        planVersionId: string;
    }, {
        tenantId: string;
        billingPeriodStart: string;
        billingPeriodEnd: string;
        planVersionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    planId: string;
    currency: string;
    evaluationTimestamp: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    pricingVersionId: string;
    totalAmount: number;
    lineItems: {
        description: string;
        amount: number;
        unitPrice: number;
        componentId: string;
        componentName: string;
        componentType: string;
        quantity: number;
    }[];
    idempotencyComponents: {
        tenantId: string;
        billingPeriodStart: string;
        billingPeriodEnd: string;
        planVersionId: string;
    };
}, {
    tenantId: string;
    planId: string;
    currency: string;
    evaluationTimestamp: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    pricingVersionId: string;
    totalAmount: number;
    lineItems: {
        description: string;
        amount: number;
        unitPrice: number;
        componentId: string;
        componentName: string;
        componentType: string;
        quantity: number;
    }[];
    idempotencyComponents: {
        tenantId: string;
        billingPeriodStart: string;
        billingPeriodEnd: string;
        planVersionId: string;
    };
}>;
export type PricingLineItem = z.infer<typeof PricingLineItemSchema>;
export type PricingResult = z.infer<typeof PricingResultSchema>;
//# sourceMappingURL=pricing-result.d.ts.map