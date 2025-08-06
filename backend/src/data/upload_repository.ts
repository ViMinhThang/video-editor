import { Asset } from "./models/track_items_models";

export interface uploadRepository{
    storeAsset(params:Asset): Promise<boolean|undefined>
}