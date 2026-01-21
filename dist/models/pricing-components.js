import { z } from 'zod';
const BaseComponentSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional()
});
export const FlatFeeComponentSchema = BaseComponentSchema.extend({
    type: z.literal('flat_fee'),
    amount: z.number().nonnegative()
});
export const UsageComponentSchema = BaseComponentSchema.extend({
    type: z.literal('usage'),
    unitPrice: z.number().nonnegative(),
    unitName: z.string().min(1),
    includedUnits: z.number().int().nonnegative().default(0)
});
export const SeatComponentSchema = BaseComponentSchema.extend({
    type: z.literal('seat'),
    pricePerSeat: z.number().nonnegative(),
    minimumSeats: z.number().int().positive().default(1),
    maximumSeats: z.number().int().positive().optional()
});
const TierSchema = z.object({
    from: z.number().int().nonnegative(),
    to: z.number().int().positive().optional(),
    unitPrice: z.number().nonnegative(),
    flatAmount: z.number().nonnegative().optional()
});
export const TieredComponentSchema = BaseComponentSchema.extend({
    type: z.literal('tiered'),
    tierMode: z.enum(['volume', 'graduated']),
    tiers: z.array(TierSchema).min(1),
    unitName: z.string().min(1)
});
export const TimeBoundComponentSchema = BaseComponentSchema.extend({
    type: z.literal('time_bound'),
    amount: z.number().nonnegative(),
    validFrom: z.string().datetime(),
    validTo: z.string().datetime()
});
export const PricingComponentSchema = z.discriminatedUnion('type', [
    FlatFeeComponentSchema,
    UsageComponentSchema,
    SeatComponentSchema,
    TieredComponentSchema,
    TimeBoundComponentSchema
]);
