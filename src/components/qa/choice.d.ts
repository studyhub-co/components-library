import React from 'react';
declare type onChangeType = (uuid: string) => void;
declare type deleteChoice = (uuid: string) => void;
interface ChoiceProps {
    choice: any;
    index: number;
    editMode: boolean;
    onChange: onChangeType;
    selected: boolean;
    deleteChoice: deleteChoice;
}
declare const Choice: React.FC<ChoiceProps>;
export default Choice;
