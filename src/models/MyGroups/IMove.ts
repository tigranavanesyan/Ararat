export interface IMove {
    id: string;
    user_id: string,
    name: string;
    sname: string;
    deleted: Array<{color: string, move: string, deleted?: boolean}[]>;
    moves: Array<{color: string, move: string, deleted?: boolean}>
}