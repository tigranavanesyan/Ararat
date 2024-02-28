export interface IRec {
    _id: string;
    name: string;
    users: {
        _id: string;
        role: string;
    }
    level: string;
}

export interface IInd {
    _id: string;
    name: string;
    sname: string;
    tname: string;
}