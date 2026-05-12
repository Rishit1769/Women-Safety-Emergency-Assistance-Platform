import { z } from 'zod';

export const registerVolunteerSchema = z.object({
  skills: z.array(z.string().min(1)).optional(),
  languagesSpoken: z.array(z.string().min(1)).optional(),
  serviceRadiusKm: z.number().int().min(1).max(50).optional(),
  ngoAffiliation: z.string().max(200).optional(),
});

export const updateAvailabilitySchema = z.object({
  status: z.enum(['available', 'busy', 'offline']),
});

export const acceptAlertSchema = z.object({
  alertId: z.string().uuid(),
});

export type RegisterVolunteerBody = z.infer<typeof registerVolunteerSchema>;
export type UpdateAvailabilityBody = z.infer<typeof updateAvailabilitySchema>;
export type AcceptAlertBody = z.infer<typeof acceptAlertSchema>;
