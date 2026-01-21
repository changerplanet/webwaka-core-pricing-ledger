import type { PricingPlanVersion } from '../models/pricing-plan-version.js';
import type { PricingContext } from '../models/pricing-context.js';
import type { PricingResult } from '../models/pricing-result.js';
export declare class PricingEngine {
    static evaluate(planVersion: Readonly<PricingPlanVersion>, context: PricingContext): PricingResult;
}
//# sourceMappingURL=pricing-engine.d.ts.map