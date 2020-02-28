import { Profile } from '../../models/';
export declare const setProfileMe: (id: number) => {
    type: string;
    id: number;
};
export default function profile(state: Profile | undefined, action: any): Profile;
