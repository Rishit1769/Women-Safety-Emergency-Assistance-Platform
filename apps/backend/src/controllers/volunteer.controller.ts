import { Request, Response } from 'express';
import * as VolunteerService from '../services/volunteer.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/response';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const volunteer = await VolunteerService.registerVolunteer({
    userId: req.user!.id,
    ...req.body,
  });
  sendCreated(res, volunteer, 'Volunteer profile created successfully');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const volunteer = await VolunteerService.getVolunteerProfile(req.user!.id);
  sendSuccess(res, volunteer, 'Volunteer profile retrieved');
});

export const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const updated = await VolunteerService.updateAvailability({
    userId: req.user!.id,
    status: req.body.status,
  });
  sendSuccess(res, updated, 'Availability updated');
});

export const acceptAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await VolunteerService.acceptAlert(req.user!.id, req.body.alertId);
  sendSuccess(res, alert, 'Alert accepted');
});

export const getAlertsFeed = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await VolunteerService.getActiveAlertsFeed(req.user!.id);
  sendSuccess(res, alerts, 'Active alerts retrieved');
});
