import { MultiDbQueryDefinitions } from "./interfaces/definitions";

export class MultiDbQueryProvider {
  private instance: MultiDbQueryDefinitions;

  constructor(instance: MultiDbQueryDefinitions) {
    this.instance = instance;
  }

  async connect() {
    await this.instance.connect();
  }

  async query<T, E>(query: string, params: any[]) {
    const res = await this.instance.query<T, E>(query, params);

    return res as T;
  }
}

module.exports = MultiDbQueryProvider;
