interface VideoItemArray {
  [index:number]:ItemDict
}
export interface ItemArray {
  [index:number]:any
}
export interface ItemDict {
  [key:string]:any
}
interface VideoItems {
  todayVideoItems:any;
  thisweekVideoItems:any;
  ratingOrderItems:any;
  viewCountOrderItems:any;
}
export interface Tube {
  description: string;
  isChannelListUpdated: string;
  channelList: Array<any>;
  lastUpdate: string;
  tubeName: string;
  todayPlaylistLog: ItemDict;
  thisweekPlaylistLog: ItemDict;
  ratingPlaylistLog: ItemDict;
  mostViewPlaylistLog: ItemDict;
  thumbnail: ItemDict;
  videoItems: VideoItems;
  videoUrl: ItemDict;
  tubeId: string;
  idname: string;
  _id?: any;
}
