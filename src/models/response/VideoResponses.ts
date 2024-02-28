import { IVideo } from "../IVideo";

export interface IgetVideos {
    videos: Array<IVideo>;
}
export interface IgetVideo {
    video: IVideo;
}

export interface IgetVideoCounter {
    my: number;
    learn: number
}