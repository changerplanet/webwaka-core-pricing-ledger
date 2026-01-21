import { PricingContextSchema } from '../models/pricing-context.js';
import { PricingResultSchema } from '../models/pricing-result.js';
function evaluateFlatFee(component) {
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'flat_fee',
        quantity: 1,
        unitPrice: component.amount,
        amount: component.amount,
        description: `Flat fee: ${component.name}`
    };
}
function evaluateUsage(component, usage) {
    const usedUnits = usage[component.id] ?? 0;
    const billableUnits = Math.max(0, usedUnits - component.includedUnits);
    const amount = billableUnits * component.unitPrice;
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'usage',
        quantity: billableUnits,
        unitPrice: component.unitPrice,
        amount,
        description: `Usage: ${billableUnits} ${component.unitName}(s) @ ${component.unitPrice} each (${component.includedUnits} included)`
    };
}
function evaluateSeat(component, seats) {
    const actualSeats = seats ?? component.minimumSeats;
    const billableSeats = Math.max(component.minimumSeats, actualSeats);
    const effectiveSeats = component.maximumSeats
        ? Math.min(billableSeats, component.maximumSeats)
        : billableSeats;
    const amount = effectiveSeats * component.pricePerSeat;
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'seat',
        quantity: effectiveSeats,
        unitPrice: component.pricePerSeat,
        amount,
        description: `Seats: ${effectiveSeats} seat(s) @ ${component.pricePerSeat} each`
    };
}
function evaluateTiered(component, usage) {
    const usedUnits = usage[component.id] ?? 0;
    let amount = 0;
    let description = '';
    if (component.tierMode === 'volume') {
        const applicableTier = component.tiers.find(tier => usedUnits >= tier.from && (tier.to === undefined || usedUnits <= tier.to));
        if (applicableTier) {
            amount = usedUnits * applicableTier.unitPrice + (applicableTier.flatAmount ?? 0);
            description = `Volume tier: ${usedUnits} ${component.unitName}(s) @ ${applicableTier.unitPrice} each`;
        }
    }
    else {
        const tierBreakdown = [];
        let remainingUnits = usedUnits;
        for (const tier of component.tiers) {
            if (remainingUnits <= 0)
                break;
            const tierSize = tier.to !== undefined ? tier.to - tier.from + 1 : Infinity;
            const unitsInTier = Math.min(remainingUnits, tierSize);
            amount += unitsInTier * tier.unitPrice + (tier.flatAmount ?? 0);
            tierBreakdown.push(`${unitsInTier} @ ${tier.unitPrice}`);
            remainingUnits -= unitsInTier;
        }
        description = `Graduated tier: ${tierBreakdown.join(', ')}`;
    }
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'tiered',
        quantity: usedUnits,
        unitPrice: amount / (usedUnits || 1),
        amount,
        description
    };
}
function evaluateTimeBound(component, evaluationTimestamp) {
    const evalTime = new Date(evaluationTimestamp).getTime();
    const validFrom = new Date(component.validFrom).getTime();
    const validTo = new Date(component.validTo).getTime();
    const isValid = evalTime >= validFrom && evalTime <= validTo;
    const amount = isValid ? component.amount : 0;
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'time_bound',
        quantity: isValid ? 1 : 0,
        unitPrice: component.amount,
        amount,
        description: `Time-bound fee: ${component.name} (${isValid ? 'active' : 'inactive'})`
    };
}
function evaluateComponent(component, context) {
    switch (component.type) {
        case 'flat_fee':
            return evaluateFlatFee(component);
        case 'usage':
            return evaluateUsage(component, context.usage);
        case 'seat':
            return evaluateSeat(component, context.seats);
        case 'tiered':
            return evaluateTiered(component, context.usage);
        case 'time_bound':
            return evaluateTimeBound(component, context.evaluationTimestamp);
        default:
            const _exhaustive = component;
            throw new Error(`Unknown component type: ${_exhaustive.type}`);
    }
}
export class PricingEngine {
    static evaluate(planVersion, context) {
        const validatedContext = PricingContextSchema.parse(context);
        if (validatedContext.tenantId !== planVersion.tenantId) {
            throw new Error(`Tenant mismatch: context tenant ${validatedContext.tenantId} does not match plan version tenant ${planVersion.tenantId}`);
        }
        const lineItems = planVersion.components.map(component => evaluateComponent(component, validatedContext));
        const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const result = {
            tenantId: validatedContext.tenantId,
            pricingVersionId: planVersion.id,
            planId: planVersion.planId,
            currency: planVersion.currency,
            totalAmount,
            lineItems,
            evaluationTimestamp: validatedContext.evaluationTimestamp,
            billingPeriodStart: validatedContext.billingPeriodStart,
            billingPeriodEnd: validatedContext.billingPeriodEnd,
            idempotencyComponents: {
                tenantId: validatedContext.tenantId,
                planVersionId: planVersion.id,
                billingPeriodStart: validatedContext.billingPeriodStart,
                billingPeriodEnd: validatedContext.billingPeriodEnd
            }
        };
        return PricingResultSchema.parse(result);
    }
}
