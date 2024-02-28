export interface ILog {
    _id: string;
    group_id: {
        _id: string;
        name: string;
    }
    type: string;
    executer: {
        _id: string;
        name: string;
        sname: string;
    }
    to: {
        _id: string;
        name: string;
        sname: string;
    }
    date: Date;
}