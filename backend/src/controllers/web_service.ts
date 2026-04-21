export interface WebService<T, CreateDTO = any, UpdateDTO = any, QueryDTO = Record<string, any>> {
  getOne(id: number | string): Promise<T | undefined>;
  getMany(query: QueryDTO): Promise<T[]>;
  store(data: CreateDTO): Promise<T | undefined>;
  delete(id: number | string): Promise<boolean>;
  replace(id: number | string, data: UpdateDTO): Promise<T | undefined>;
  modify(id: number | string, data: UpdateDTO): Promise<T | undefined>;
}
