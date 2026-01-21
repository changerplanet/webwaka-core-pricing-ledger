import { z } from 'zod';
import { PricingComponentSchema } from './pricing-components.js';
export const PricingPlanVersionSchema = z.object({
    id: z.string().uuid(),
    planId: z.string().uuid(),
    tenantId: z.string().uuid(),
    version: z.number().int().positive(),
    currency: z.string().length(3),
    components: z.array(PricingComponentSchema).min(1),
    effectiveFrom: z.string().datetime(),
    effectiveTo: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    metadata: z.record(z.string(), z.unknown()).optional()
});
export function createImmutablePlanVersion(data) {
    const validated = PricingPlanVersionSchema.parse(data);
    const immutableComponents = validated.components.map(component => Object.freeze({ ...component }));
    const immutableVersion = Object.freeze({
        ...validated,
        components: immutableComponents,
        metadata: validated.metadata ? Object.freeze({ ...validated.metadata }) : undefined
    });
    return immutableVersion;
}
export function assertImmutable(version) {
    if (!Object.isFrozen(version)) {
        throw new Error('PricingPlanVersion must be immutable. Use createImmutablePlanVersion().');
    }
}
