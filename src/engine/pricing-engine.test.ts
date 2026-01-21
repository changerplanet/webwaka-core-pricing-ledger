import { describe, it, expect } from 'vitest';
import { PricingEngine } from './pricing-engine.js';
import { createImmutablePlanVersion, type PricingPlanVersion } from '../models/pricing-plan-version.js';
import type { PricingContext } from '../models/pricing-context.js';
import type { 
  FlatFeeComponent, 
  UsageComponent, 
  SeatComponent, 
  TieredComponent, 
  TimeBoundComponent 
} from '../models/pricing-components.js';

const TENANT_ID = '11111111-1111-1111-1111-111111111111';
const PLAN_ID = '22222222-2222-2222-2222-222222222222';
const VERSION_ID = '33333333-3333-3333-3333-333333333333';

function createBaseContext(overrides: Partial<PricingContext> = {}): PricingContext {
  return {
    tenantId: TENANT_ID,
    evaluationTimestamp: '2024-01-15T12:00:00.000Z',
    billingPeriodStart: '2024-01-01T00:00:00.000Z',
    billingPeriodEnd: '2024-01-31T23:59:59.999Z',
    usage: {},
    ...overrides
  };
}

function createBasePlanVersion(
  components: PricingPlanVersion['components'],
  overrides: Partial<PricingPlanVersion> = {}
): Readonly<PricingPlanVersion> {
  return createImmutablePlanVersion({
    id: VERSION_ID,
    planId: PLAN_ID,
    tenantId: TENANT_ID,
    version: 1,
    currency: 'NGN',
    components,
    effectiveFrom: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  });
}

describe('PricingEngine', () => {
  describe('FlatFeeComponent', () => {
    it('should evaluate flat fee correctly', () => {
      const component: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base Subscription',
        type: 'flat_fee',
        amount: 5000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext();
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(5000);
      expect(result.lineItems).toHaveLength(1);
      expect(result.lineItems[0].componentType).toBe('flat_fee');
      expect(result.lineItems[0].amount).toBe(5000);
      expect(result.lineItems[0].quantity).toBe(1);
    });
  });

  describe('UsageComponent', () => {
    it('should evaluate usage with included units correctly', () => {
      const componentId = '55555555-5555-5555-5555-555555555555';
      const component: UsageComponent = {
        id: componentId,
        name: 'API Calls',
        type: 'usage',
        unitPrice: 0.01,
        unitName: 'call',
        includedUnits: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({
        usage: { [componentId]: 1500 }
      });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(5);
      expect(result.lineItems[0].quantity).toBe(500);
    });

    it('should not charge for usage within included units', () => {
      const componentId = '55555555-5555-5555-5555-555555555555';
      const component: UsageComponent = {
        id: componentId,
        name: 'API Calls',
        type: 'usage',
        unitPrice: 0.01,
        unitName: 'call',
        includedUnits: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({
        usage: { [componentId]: 500 }
      });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(0);
      expect(result.lineItems[0].quantity).toBe(0);
    });
  });

  describe('SeatComponent', () => {
    it('should evaluate seats correctly', () => {
      const component: SeatComponent = {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'User Seats',
        type: 'seat',
        pricePerSeat: 1000,
        minimumSeats: 1
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({ seats: 5 });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(5000);
      expect(result.lineItems[0].quantity).toBe(5);
    });

    it('should enforce minimum seats', () => {
      const component: SeatComponent = {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'User Seats',
        type: 'seat',
        pricePerSeat: 1000,
        minimumSeats: 3
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({ seats: 1 });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(3000);
      expect(result.lineItems[0].quantity).toBe(3);
    });

    it('should enforce maximum seats', () => {
      const component: SeatComponent = {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'User Seats',
        type: 'seat',
        pricePerSeat: 1000,
        minimumSeats: 1,
        maximumSeats: 10
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({ seats: 15 });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(10000);
      expect(result.lineItems[0].quantity).toBe(10);
    });
  });

  describe('TieredComponent - Volume', () => {
    it('should evaluate volume tiers correctly', () => {
      const componentId = '77777777-7777-7777-7777-777777777777';
      const component: TieredComponent = {
        id: componentId,
        name: 'Storage',
        type: 'tiered',
        tierMode: 'volume',
        unitName: 'GB',
        tiers: [
          { from: 0, to: 10, unitPrice: 100 },
          { from: 11, to: 50, unitPrice: 80 },
          { from: 51, unitPrice: 50 }
        ]
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({ usage: { [componentId]: 25 } });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(2000);
    });
  });

  describe('TieredComponent - Graduated', () => {
    it('should evaluate graduated tiers correctly', () => {
      const componentId = '88888888-8888-8888-8888-888888888888';
      const component: TieredComponent = {
        id: componentId,
        name: 'Messages',
        type: 'tiered',
        tierMode: 'graduated',
        unitName: 'message',
        tiers: [
          { from: 0, to: 100, unitPrice: 1 },
          { from: 101, to: 500, unitPrice: 0.5 },
          { from: 501, unitPrice: 0.1 }
        ]
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({ usage: { [componentId]: 150 } });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(125.5);
    });
  });

  describe('TimeBoundComponent', () => {
    it('should charge when within time bounds', () => {
      const component: TimeBoundComponent = {
        id: '99999999-9999-9999-9999-999999999999',
        name: 'Promotion',
        type: 'time_bound',
        amount: 500,
        validFrom: '2024-01-01T00:00:00.000Z',
        validTo: '2024-02-01T00:00:00.000Z'
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({
        evaluationTimestamp: '2024-01-15T12:00:00.000Z'
      });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(500);
      expect(result.lineItems[0].quantity).toBe(1);
    });

    it('should not charge when outside time bounds', () => {
      const component: TimeBoundComponent = {
        id: '99999999-9999-9999-9999-999999999999',
        name: 'Promotion',
        type: 'time_bound',
        amount: 500,
        validFrom: '2024-01-01T00:00:00.000Z',
        validTo: '2024-01-10T00:00:00.000Z'
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({
        evaluationTimestamp: '2024-01-15T12:00:00.000Z'
      });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(0);
      expect(result.lineItems[0].quantity).toBe(0);
    });
  });

  describe('Multiple Components', () => {
    it('should sum all component amounts correctly', () => {
      const flatFee: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee',
        amount: 1000
      };

      const usageId = '55555555-5555-5555-5555-555555555555';
      const usage: UsageComponent = {
        id: usageId,
        name: 'API Calls',
        type: 'usage',
        unitPrice: 1,
        unitName: 'call',
        includedUnits: 0
      };

      const planVersion = createBasePlanVersion([flatFee, usage]);
      const context = createBaseContext({ usage: { [usageId]: 500 } });
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.totalAmount).toBe(1500);
      expect(result.lineItems).toHaveLength(2);
    });
  });

  describe('Tenant Isolation', () => {
    it('should reject mismatched tenant IDs', () => {
      const component: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee',
        amount: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext({
        tenantId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      });

      expect(() => PricingEngine.evaluate(planVersion, context)).toThrow(
        /Tenant mismatch/
      );
    });

    it('should always include tenantId in result', () => {
      const component: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee',
        amount: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext();
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.tenantId).toBe(TENANT_ID);
      expect(result.idempotencyComponents.tenantId).toBe(TENANT_ID);
    });
  });

  describe('Ledger Compatibility', () => {
    it('should produce ledger-ready output with all required fields', () => {
      const component: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee',
        amount: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext();
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result).toHaveProperty('tenantId');
      expect(result).toHaveProperty('pricingVersionId');
      expect(result).toHaveProperty('planId');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('totalAmount');
      expect(result).toHaveProperty('lineItems');
      expect(result).toHaveProperty('evaluationTimestamp');
      expect(result).toHaveProperty('billingPeriodStart');
      expect(result).toHaveProperty('billingPeriodEnd');
      expect(result).toHaveProperty('idempotencyComponents');

      expect(result).not.toHaveProperty('paymentId');
      expect(result).not.toHaveProperty('subscription');
      expect(result).not.toHaveProperty('tax');
      expect(result).not.toHaveProperty('discount');
    });

    it('should include idempotency components', () => {
      const component: FlatFeeComponent = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee',
        amount: 1000
      };

      const planVersion = createBasePlanVersion([component]);
      const context = createBaseContext();
      const result = PricingEngine.evaluate(planVersion, context);

      expect(result.idempotencyComponents).toEqual({
        tenantId: TENANT_ID,
        planVersionId: VERSION_ID,
        billingPeriodStart: context.billingPeriodStart,
        billingPeriodEnd: context.billingPeriodEnd
      });
    });
  });
});

describe('PricingPlanVersion Immutability', () => {
  it('should freeze the plan version object', () => {
    const component: FlatFeeComponent = {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Base',
      type: 'flat_fee',
      amount: 1000
    };

    const planVersion = createBasePlanVersion([component]);

    expect(Object.isFrozen(planVersion)).toBe(true);
  });

  it('should not allow modifying frozen properties', () => {
    const component: FlatFeeComponent = {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Base',
      type: 'flat_fee',
      amount: 1000
    };

    const planVersion = createBasePlanVersion([component]);

    expect(() => {
      (planVersion as any).version = 999;
    }).toThrow();
  });

  it('should freeze nested components', () => {
    const component: FlatFeeComponent = {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Base',
      type: 'flat_fee',
      amount: 1000
    };

    const planVersion = createBasePlanVersion([component]);

    expect(Object.isFrozen(planVersion.components[0])).toBe(true);
  });
});

describe('Determinism', () => {
  it('should produce identical output for identical input - 10 iterations', () => {
    const componentId = '55555555-5555-5555-5555-555555555555';
    const components = [
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base',
        type: 'flat_fee' as const,
        amount: 1000
      },
      {
        id: componentId,
        name: 'API Calls',
        type: 'usage' as const,
        unitPrice: 0.5,
        unitName: 'call',
        includedUnits: 100
      }
    ];

    const planVersion = createBasePlanVersion(components);
    const context = createBaseContext({ usage: { [componentId]: 250 } });

    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      const result = PricingEngine.evaluate(planVersion, context);
      results.push(JSON.stringify(result));
    }

    const firstResult = results[0];
    for (const result of results) {
      expect(result).toBe(firstResult);
    }
  });
});

describe('Hard Stop — Pricing engine produces deterministic, ledger-ready output without side effects', () => {
  it('should produce deterministic output with no side effects', () => {
    const componentId = '55555555-5555-5555-5555-555555555555';
    const tieredId = '77777777-7777-7777-7777-777777777777';
    
    const components = [
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Base Subscription',
        type: 'flat_fee' as const,
        amount: 5000
      },
      {
        id: componentId,
        name: 'API Calls',
        type: 'usage' as const,
        unitPrice: 0.01,
        unitName: 'call',
        includedUnits: 1000
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        name: 'User Seats',
        type: 'seat' as const,
        pricePerSeat: 1000,
        minimumSeats: 1
      },
      {
        id: tieredId,
        name: 'Storage',
        type: 'tiered' as const,
        tierMode: 'volume' as const,
        unitName: 'GB',
        tiers: [
          { from: 0, to: 10, unitPrice: 100 },
          { from: 11, to: 50, unitPrice: 80 },
          { from: 51, unitPrice: 50 }
        ]
      }
    ];

    const planVersion = createBasePlanVersion(components);
    const context = createBaseContext({
      usage: {
        [componentId]: 5000,
        [tieredId]: 25
      },
      seats: 5
    });

    const capturedState = {
      planVersionBefore: JSON.stringify(planVersion),
      contextBefore: JSON.stringify(context)
    };

    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      const result = PricingEngine.evaluate(planVersion, context);
      results.push(JSON.stringify(result));
    }

    expect(JSON.stringify(planVersion)).toBe(capturedState.planVersionBefore);
    expect(JSON.stringify(context)).toBe(capturedState.contextBefore);

    const firstResult = results[0];
    for (let i = 1; i < results.length; i++) {
      expect(results[i]).toBe(firstResult);
    }

    const parsedResult = JSON.parse(firstResult);
    
    expect(parsedResult).toHaveProperty('tenantId');
    expect(parsedResult).toHaveProperty('pricingVersionId');
    expect(parsedResult).toHaveProperty('planId');
    expect(parsedResult).toHaveProperty('currency');
    expect(parsedResult).toHaveProperty('totalAmount');
    expect(parsedResult).toHaveProperty('lineItems');
    expect(parsedResult).toHaveProperty('idempotencyComponents');
    
    expect(parsedResult).not.toHaveProperty('paymentId');
    expect(parsedResult).not.toHaveProperty('subscription');
    expect(parsedResult).not.toHaveProperty('tax');
    expect(parsedResult).not.toHaveProperty('incentive');

    expect(parsedResult.totalAmount).toBe(
      5000 + 40 + 5000 + 2000
    );
  });

  it('should not depend on current time (no Date.now() dependency)', () => {
    const component = {
      id: '99999999-9999-9999-9999-999999999999',
      name: 'Time Bound',
      type: 'time_bound' as const,
      amount: 500,
      validFrom: '2024-01-01T00:00:00.000Z',
      validTo: '2024-02-01T00:00:00.000Z'
    };

    const planVersion = createBasePlanVersion([component]);
    
    const context1 = createBaseContext({
      evaluationTimestamp: '2024-01-15T00:00:00.000Z'
    });
    const context2 = createBaseContext({
      evaluationTimestamp: '2024-03-01T00:00:00.000Z'
    });

    const result1 = PricingEngine.evaluate(planVersion, context1);
    const result2 = PricingEngine.evaluate(planVersion, context2);

    expect(result1.totalAmount).toBe(500);
    expect(result2.totalAmount).toBe(0);
  });

  it('should have no payment coupling', () => {
    const component = {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Base',
      type: 'flat_fee' as const,
      amount: 1000
    };

    const planVersion = createBasePlanVersion([component]);
    const context = createBaseContext();
    const result = PricingEngine.evaluate(planVersion, context);

    const resultKeys = Object.keys(result);
    const lineItemKeys = result.lineItems.length > 0 
      ? Object.keys(result.lineItems[0]) 
      : [];

    expect(resultKeys).not.toContain('paymentId');
    expect(resultKeys).not.toContain('paymentStatus');
    expect(resultKeys).not.toContain('paymentMethod');
    expect(resultKeys).not.toContain('transactionId');
    expect(lineItemKeys).not.toContain('paymentId');
  });
});
