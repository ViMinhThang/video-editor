export interface WebService<T> {
  getOne(id: any): Promise<T | undefined>;
  getMany(query: any): Promise<T[]>;
  store(data: any): Promise<T | undefined>;
  delete(id: any): Promise<boolean>;
  replace(id: any, data: any): Promise<T | undefined>;
  modify(id: any, data: any): Promise<T | undefined>;
}
