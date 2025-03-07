export interface IDBDependenciesInjectorModel {
  query: <T>(str: string, params: any[]) => Promise<T>;
  uniqueQuery: <T>(str: string, params: any[]) => Promise<T>;

  get totalCount(): number;
  get waitingCount(): number;
}
