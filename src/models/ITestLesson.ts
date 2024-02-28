import { IMaterial } from "./Program/IMaterial";

export interface ITestLesson {
    _id: string,
    program: IMaterial[],
    history: Array<{ material?: string, moves:{_id?: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>, movesHistory?: string[]}}>
}

export interface ITestLessonEdit {
    program?: string[],
    material?: string,
    current?: string,
    move?: { id?: string; user_id: string, name: string; sname: string; moves: Array<{color: string, move: string}>;};
    deleted?: {user_id: string, moves: Array<{color: string, move: string}>;},
    movesHistory?: string[],
    moveMode?: boolean,
}