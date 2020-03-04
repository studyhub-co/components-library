import React from 'react';
export declare const DEFAULT_MATHJAX_OPTIONS: {
    extensions: string[];
    jax: string[];
    tex2jax: {
        inlineMath: string[][];
        displayMath: string[][];
        processEscapes: boolean;
    };
    'HTML-CSS': {
        availableFonts: string[];
    };
};
interface EditableLabelProps {
    value: string;
    cursorPointer: boolean;
    editMode: boolean;
}
declare const EditableLabel: React.FC<EditableLabelProps>;
export default EditableLabel;
