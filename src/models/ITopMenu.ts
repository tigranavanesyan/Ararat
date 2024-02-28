
export interface ITopMenu {
    id: number;
    name: string;
    path?: string;
    dropdown?: boolean;
    scope?:Array<string>;
    counter?: number;
}


export interface ITopMenuOnlineLesson {
    id: number;
    name: string;
    path?: string;
    dropdown?: boolean;
    openProgram?: boolean;
    openDescription?: boolean;
    openHomework?: boolean;
    openHistory?: boolean;
    scope?:Array<string>;
}