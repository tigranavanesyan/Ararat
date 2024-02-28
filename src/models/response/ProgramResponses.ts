import { ITheme } from "../Program/ITheme";
import { IMaterial } from "../Program/IMaterial";

export interface IgetThemes {
    themes: Array<ITheme>;
}
export interface IgetTheme {
    theme: ITheme;
}
export interface IgetMaterials {
    materials: Array<IMaterial>;
}
export interface IgetMaterial {
    material: IMaterial[];
}