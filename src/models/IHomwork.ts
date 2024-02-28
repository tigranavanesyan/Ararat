import { IMaterial } from "./Program/IMaterial";
import { User } from "./User";

export interface IHomework {
    _id: string,
    group_id: string,
    end: Date,
    lesson?: Date,
    completed?: Array<string>,
    autocheck?: boolean,
    results?: [{
        user_id: string,
        results: [
            {
                material: string,
                result: string
            }
        ]
    }],

    program: IMaterial[],
    history: Array<{ material?: string, moves:[{_id?: string; user_id: string, name: string; sname: string; movesHistory?: string[], moves: Array<{color: string, move: string}>}]}>
}

export interface IHomeworkEdit {
    move?: { id?: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;};
    movesHistory?: string[],
    material?: string,
    program?: string[],
    autocheck?: string,
}