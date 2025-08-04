export enum typeEnum {
  Video = 'video',
  Audio = 'audio',
  Text = 'text',
}


export interface Track{
    id?:number
    project_id:number
    type:typeEnum
    order:number
}