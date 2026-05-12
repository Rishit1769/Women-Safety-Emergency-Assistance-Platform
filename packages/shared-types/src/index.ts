// ─── User / Auth ──────────────────────────────────────────────────
export type UserRole = 'USER' | 'VOLUNTEER' | 'POLICE' | 'ADMIN';

export interface UserPublic {
  id:          string;
  name:        string;
  phone:       string;
  role:        UserRole;
  isVerified:  boolean;
  createdAt:   string;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
}

// ─── SOS / Alert ─────────────────────────────────────────────────
export type AlertStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'VOLUNTEER_ASSIGNED'
  | 'POLICE_NOTIFIED'
  | 'RESOLVED'
  | 'CANCELLED'
  | 'FALSE_ALARM';

export type AlertType =
  | 'PERSONAL_SAFETY'
  | 'MEDICAL'
  | 'FIRE'
  | 'ACCIDENT'
  | 'HARASSMENT'
  | 'OTHER';

export type TriggerMethod =
  | 'BUTTON_PRESS'
  | 'VOICE'
  | 'SHAKE_DETECTION'
  | 'FAKE_CALL'
  | 'SCHEDULED'
  | 'GUARDIAN_TRIGGER';

export interface SosAlertBase {
  id:              string;
  alertCode:       string;
  userId:          string;
  alertType:       AlertType;
  triggerMethod:   TriggerMethod;
  status:          AlertStatus;
  latitude:        number;
  longitude:       number;
  address?:        string;
  createdAt:       string;
  updatedAt:       string;
}

// ─── Location ────────────────────────────────────────────────────
export interface LatLng {
  latitude:  number;
  longitude: number;
}

// ─── Community ───────────────────────────────────────────────────
export type ReportCategory =
  | 'STREET_HARASSMENT'
  | 'UNSAFE_AREA'
  | 'POOR_LIGHTING'
  | 'SUSPICIOUS_ACTIVITY'
  | 'INFRASTRUCTURE_ISSUE'
  | 'OTHER';

export interface CommunityReportBase {
  id:           string;
  category:     ReportCategory;
  description:  string;
  latitude:     number;
  longitude:    number;
  anonymous:    boolean;
  upvoteCount:  number;
  createdAt:    string;
}

// ─── Socket.IO events ────────────────────────────────────────────
export type SocketEvent =
  | 'SOS_CREATED'
  | 'LOCATION_UPDATE'
  | 'VOLUNTEER_ACCEPTED'
  | 'POLICE_ACCEPTED'
  | 'ALERT_RESOLVED';

export interface SosCreatedPayload   { alert: SosAlertBase; }
export interface LocationUpdatePayload { alertId: string; latitude: number; longitude: number; }
export interface VolunteerAcceptedPayload { alertId: string; volunteerId: string; volunteerName: string; }
export interface PoliceAcceptedPayload    { alertId: string; stationName: string; }
export interface AlertResolvedPayload     { alertId: string; resolvedAt: string; }

// ─── API Response shape ──────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?:   T;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}
