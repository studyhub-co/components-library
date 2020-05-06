import React from 'react';
import { Choice as IChoice } from './IData/choices';
declare type onSelectType = (uuid: string) => void;
declare type deleteChoice = (uuid: string) => void;
declare type onChange = (choice: IChoice) => void;
interface ChoiceProps {
    choice: IChoice;
    index: number;
    editMode: boolean;
    onSelect: onSelectType;
    selected: boolean;
    deleteChoice: deleteChoice;
    onChange: onChange;
}
declare const Choice: React.FC<ChoiceProps>;
export default Choice;
