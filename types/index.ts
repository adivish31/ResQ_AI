/**
 * ResQ AI - Core Type Definitions
 * Domain models for disaster response platform
 * Separation of concerns: Types independent of implementation
 */

// ============================================
// DOMAIN MODELS
// ============================================

/**
 * Geographic coordinate representation
 */
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Incident category classification
 */
export type IncidentCategory =
  | "FIRE"
  | "FLOOD"
  | "EARTHQUAKE"
  | "MEDICAL"
  | "ACCIDENT"
  | "SECURITY"
  | "INFRASTRUCTURE"
  | "OTHER";

/**
 * Urgency level for incident prioritization
 */
export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Incident status tracking
 */
export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

/**
 * Core Incident model representing a help request
 */
export interface Incident {
  id: string;
  description: string;
  lat: number;
  lng: number;
  category: IncidentCategory;
  urgency: UrgencyLevel;
  summary: string;
  status: IncidentStatus;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Input data for creating a new incident
 */
export interface CreateIncidentInput {
  description: string;
  lat: number;
  lng: number;
}

/**
 * Incident with calculated distance (for geolocation queries)
 */
export interface IncidentWithDistance extends Incident {
  distanceInMeters: number;
}

// ============================================
// AI SERVICE TYPES
// ============================================

/**
 * AI analysis result from Gemini
 */
export interface AIAnalysisResult {
  category: IncidentCategory;
  urgency: UrgencyLevel;
  summary: string;
}

/**
 * AI service response wrapper
 */
export interface AIResponse {
  success: boolean;
  data?: AIAnalysisResult;
  error?: string;
}

// ============================================
// GEOLOCATION SERVICE TYPES
// ============================================

/**
 * Parameters for geospatial queries
 */
export interface GeoQueryParams {
  lat: number;
  lng: number;
  radiusInMeters: number;
}

/**
 * Result from proximity search
 */
export interface NearbyIncidentsResult {
  incidents: IncidentWithDistance[];
  count: number;
}

// ============================================
// API/ACTION RESPONSE TYPES
// ============================================

/**
 * Standard API response wrapper for success cases
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard API response wrapper for error cases
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

/**
 * Generic API response type
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Partial incident update payload
 */
export type UpdateIncidentInput = Partial<
  Pick<Incident, "status" | "category" | "urgency" | "summary">
>;

/**
 * Filter options for incident queries
 */
export interface IncidentFilters {
  status?: IncidentStatus[];
  category?: IncidentCategory[];
  urgency?: UrgencyLevel[];
  startDate?: Date;
  endDate?: Date;
}

