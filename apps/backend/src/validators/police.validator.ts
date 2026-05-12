import { z } from 'zod';

export const createPoliceAccountSchema = z.object({
  badgeNumber: z.string().min(2).max(30),
  rank: z.string().max(50).optional(),
  stationId: z.string().uuid(),
});

export const assignAlertSchema = z.object({
  alertId: z.string().uuid(),
});

export const escalateAlertSchema = z.object({
  alertId: z.string().uuid(),
  reason: z.string().min(5).max(500),
});

export const dutyStatusSchema = z.object({
  isOnDuty: z.boolean(),
});

export type CreatePoliceAccountBody = z.infer<typeof createPoliceAccountSchema>;
export type AssignAlertBody = z.infer<typeof assignAlertSchema>;
export type EscalateAlertBody = z.infer<typeof escalateAlertSchema>;
export type DutyStatusBody = z.infer<typeof dutyStatusSchema>;
