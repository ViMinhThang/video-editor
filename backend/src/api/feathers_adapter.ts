import { WebService } from "./web_service";
import { Id, NullableId, Params } from "@feathersjs/feathers";

export class FeathersWrapper<T> {
  constructor(private ws: WebService<T>) {}
  get(id: Id) {
    return this.ws.getOne(id);
  }

  find(params: Params) {
    return this.ws.getMany(params.query);
  }

  create(data: any, params: Params) {
    return this.ws.store(data);
  }

  remove(id: NullableId, params: Params) {
    return this.ws.delete(id);
  }

  update(id: NullableId, data: any, params: Params) {
    return this.ws.replace(id, data);
  }

  patch(id: NullableId, data: any, params: Params) {
    return this.ws.modify(id, data);
  }
}
