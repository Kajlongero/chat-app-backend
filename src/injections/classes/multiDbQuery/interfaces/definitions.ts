export interface MultiDbQueryDefinitions {
  close: () => Promise<void>;
  query: <T, E>(query: string, params: any[]) => Promise<T | E>;
  connect: () => Promise<void>;
  readonly idleCount?: () => number;
  readonly totalCount?: () => number;
  readonly waitingCount?: () => number;
}
