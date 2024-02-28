import { IMaterial } from "../Program/IMaterial";
import { User } from "../User";

export interface IGroup {
    _id: string,
    dialog_id: string,
    name: string,
    description: string,
    users: User[],
    level: string,
    current?: string,
    start: string,
    open: boolean,
    program: IMaterial[],
    prevprogram: IMaterial[],
    history: Array<{ material?: string, moves:{_id?: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>, movesHistory?: string[]}}>
    archive: boolean,
    lasthomework: string,
    dates?: [{
        days: [number],
        time: string,
        current: string,
        endtime: string
    }]
    videocounter?: number;
}

export interface IGroupEdit {
    name?: string,
    description?: string,
    traners?: string[],
    level?: string,
    start?: string,
    open?: boolean,
    program?: string[],
    prevprogram?: string[],
    material?: string,
    current?: string,
    move?: { id?: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;};
    deleted?: {user_id: string, moves: Array<{color: string, move: string}>;},
    movesHistory?: string[],
    moveMode?: boolean,
    archive?: boolean,
    dates?: [{
        days: [number],
        time: string,
        current: string,
        endtime: string
    }]
}