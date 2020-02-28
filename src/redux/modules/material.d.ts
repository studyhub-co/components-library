import { Material } from '../../models/';
export interface MaterialRedux extends Material {
    isFetching: boolean;
}
export declare const fetchMaterial: (uuid: string | undefined) => (dispatch: any) => void;
export default function material(state: MaterialRedux | undefined, action: any): MaterialRedux;
