import { z } from 'zod';
export declare const PricingPlanVersionSchema: z.ZodObject<{
    id: z.ZodString;
    planId: z.ZodString;
    tenantId: z.ZodString;
    version: z.ZodNumber;
    currency: z.ZodString;
    components: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"flat_fee">;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        type: "flat_fee";
        amount: number;
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        type: "flat_fee";
        amount: number;
        description?: string | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"usage">;
        unitPrice: z.ZodNumber;
        unitName: z.ZodString;
        includedUnits: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        type: "usage";
        unitPrice: number;
        unitName: string;
        includedUnits: number;
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        type: "usage";
        unitPrice: number;
        unitName: string;
        description?: string | undefined;
        includedUnits?: number | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"seat">;
        pricePerSeat: z.ZodNumber;
        minimumSeats: z.ZodDefault<z.ZodNumber>;
        maximumSeats: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        type: "seat";
        pricePerSeat: number;
        minimumSeats: number;
        description?: string | undefined;
        maximumSeats?: number | undefined;
    }, {
        id: string;
        name: string;
        type: "seat";
        pricePerSeat: number;
        description?: string | undefined;
        minimumSeats?: number | undefined;
        maximumSeats?: number | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"tiered">;
        tierMode: z.ZodEnum<["volume", "graduated"]>;
        tiers: z.ZodArray<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodOptional<z.ZodNumber>;
            unitPrice: z.ZodNumber;
            flatAmount: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }, {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }>, "many">;
        unitName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        type: "tiered";
        unitName: string;
        tierMode: "volume" | "graduated";
        tiers: {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }[];
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        type: "tiered";
        unitName: string;
        tierMode: "volume" | "graduated";
        tiers: {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }[];
        description?: string | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"time_bound">;
        amount: z.ZodNumber;
        validFrom: z.ZodString;
        validTo: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        type: "time_bound";
        amount: number;
        validFrom: string;
        validTo: string;
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        type: "time_bound";
        amount: number;
        validFrom: string;
        validTo: string;
        description?: string | undefined;
    }>]>, "many">;
    effectiveFrom: z.ZodString;
    effectiveTo: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tenantId: string;
    createdAt: string;
    planId: string;
    version: number;
    currency: string;
    components: ({
        id: string;
        name: string;
        type: "flat_fee";
        amount: number;
        description?: string | undefined;
    } | {
        id: string;
        name: string;
        type: "usage";
        unitPrice: number;
        unitName: string;
        includedUnits: number;
        description?: string | undefined;
    } | {
        id: string;
        name: string;
        type: "seat";
        pricePerSeat: number;
        minimumSeats: number;
        description?: string | undefined;
        maximumSeats?: number | undefined;
    } | {
        id: string;
        name: string;
        type: "tiered";
        unitName: string;
        tierMode: "volume" | "graduated";
        tiers: {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }[];
        description?: string | undefined;
    } | {
        id: string;
        name: string;
        type: "time_bound";
        amount: number;
        validFrom: string;
        validTo: string;
        description?: string | undefined;
    })[];
    effectiveFrom: string;
    metadata?: Record<string, unknown> | undefined;
    effectiveTo?: string | undefined;
}, {
    id: string;
    tenantId: string;
    createdAt: string;
    planId: string;
    version: number;
    currency: string;
    components: ({
        id: string;
        name: string;
        type: "flat_fee";
        amount: number;
        description?: string | undefined;
    } | {
        id: string;
        name: string;
        type: "usage";
        unitPrice: number;
        unitName: string;
        description?: string | undefined;
        includedUnits?: number | undefined;
    } | {
        id: string;
        name: string;
        type: "seat";
        pricePerSeat: number;
        description?: string | undefined;
        minimumSeats?: number | undefined;
        maximumSeats?: number | undefined;
    } | {
        id: string;
        name: string;
        type: "tiered";
        unitName: string;
        tierMode: "volume" | "graduated";
        tiers: {
            unitPrice: number;
            from: number;
            to?: number | undefined;
            flatAmount?: number | undefined;
        }[];
        description?: string | undefined;
    } | {
        id: string;
        name: string;
        type: "time_bound";
        amount: number;
        validFrom: string;
        validTo: string;
        description?: string | undefined;
    })[];
    effectiveFrom: string;
    metadata?: Record<string, unknown> | undefined;
    effectiveTo?: string | undefined;
}>;
export type PricingPlanVersion = z.infer<typeof PricingPlanVersionSchema>;
export declare function createImmutablePlanVersion(data: PricingPlanVersion): Readonly<PricingPlanVersion>;
export declare function assertImmutable(version: PricingPlanVersion): void;
//# sourceMappingURL=pricing-plan-version.d.ts.map