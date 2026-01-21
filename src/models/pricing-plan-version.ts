import { z } from 'zod';
import { PricingComponentSchema, type PricingComponent } from './pricing-components.js';

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

export type PricingPlanVersion = z.infer<typeof PricingPlanVersionSchema>;

export function createImmutablePlanVersion(
  data: PricingPlanVersion
): Readonly<PricingPlanVersion> {
  const validated = PricingPlanVersionSchema.parse(data);
  
  const immutableComponents: ReadonlyArray<Readonly<PricingComponent>> = 
    validated.components.map(component => Object.freeze({ ...component }));
  
  const immutableVersion: Readonly<PricingPlanVersion> = Object.freeze({
    ...validated,
    components: immutableComponents as PricingComponent[],
    metadata: validated.metadata ? Object.freeze({ ...validated.metadata }) : undefined
  });
  
  return immutableVersion;
}

export function assertImmutable(version: PricingPlanVersion): void {
  if (!Object.isFrozen(version)) {
    throw new Error('PricingPlanVersion must be immutable. Use createImmutablePlanVersion().');
  }
}
