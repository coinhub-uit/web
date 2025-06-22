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

export interface PlanWithHistoryDto {
  id: number;
  days: number;
  planHistories: PlanHistoryDto[];
}

export interface PlanHistoryDto {
  id: number;
  createdAt: string;
  rate: string;
}
