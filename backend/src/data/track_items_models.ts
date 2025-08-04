export interface TrackItem{
    id?:number
    track_id : number
    start_time:number
    end_time:number
    x:number
    y:number
    scale: number
    rotation: number,
    text_content:string,
    create_at?:Date
}