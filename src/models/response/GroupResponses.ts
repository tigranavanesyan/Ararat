import { IGroup } from "./IGroup";
import { ILog } from "./Ilog";
import { IRec, IInd } from "./IRec";

export interface IgetGroups {
    groups: Array<IGroup>;
}
export interface IgetGroup {
    group: IGroup;
}

export interface IgetLogs {
    logs: Array<ILog>;
}

export interface IgetRecs {
    recs: Array<IRec>;
    inds: Array<IInd>;
}