export interface PlanDto {
  id: number;
  days: number;
}

export interface PlanAvailableDto {
  planHistoryId: number;
  rate: number;
  planId: number;
  days: 0;
}
