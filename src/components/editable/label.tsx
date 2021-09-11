import React from 'react';

import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import Input, { InputProps } from '@material-ui/core/Input';
// import { FaPencilAlt } from 'react-icons/fa';
import { withStyles } from '@material-ui/core';

import { StyledMathButton } from './style';

import './style.css';

// export const DEFAULT_MATHJAX_OPTIONS = {
//   extensions: ['tex2jax.js'],
//   jax: ['input/TeX', 'output/HTML-CSS'],
//   tex2jax: {
//     inlineMath: [
//       ['$', '$'],
//       ['\\(', '\\)'],
//     ],
//     displayMath: [
//       ['$$', '$$'],
//       ['\\[', '\\]'],
//     ],
//     processEscapes: true,
//   },
//   'HTML-CSS': { availableFonts: ['TeX'] },
// };

//  remove color from Material UI to all change with parent hover

// FYI: mathjax is not support input, so use text in not edit mode
// const BlueInput = withStyles({
//   root: {
//     color: 'inherit',
//   },
// })((props: InputProps) => <Input color="primary" {...props} />);

const BlueInput = withStyles({
  root: {
    color: 'inherit',
  },
})((props: InputProps) =>
  props.readOnly ? (
    <MathJaxContext>
      <MathJax>{props.value as string}</MathJax>
    </MathJaxContext>
  ) : (
    <Input color="primary" {...props} />
  ),
);

//  <MathJax>{'\\(\\frac{10}{4x} \\approx 2^{12}\\)'}</MathJax>}
// <Input color="primary" {...props} />

interface EditableLabelProps {
  value: string;
  placeholder?: string;
  cursorPointer: boolean;
  editMode: boolean | undefined;
  mathMode?: boolean;
  onChange: (text: string) => void;
  mathButtons?: undefined | string[];
}

addStyles();

// TODO
// 1. Add multiple lines support
// 2. MathJax - udpate, it seems we don't need MathJax, we have static mathquill field for this.
// 3. handleInputKeyUp
const EditableLabel: React.FC<EditableLabelProps> = props => {
  const { value, editMode, onChange, placeholder, mathButtons, mathMode } = props;

  const [state, setState] = React.useState({
    hovered: false,
  });

  const onHover = () => {
    if (editMode) {
      setState({ hovered: !state.hovered });
    } else {
      setState({ hovered: false });
    }
  };

  /*
   math mode = mathquill field
   not math mode = use simple text + mathjax
   */

  return (
    <div onMouseOver={onHover} onMouseOut={onHover}>
      {mathMode ? (
        editMode ? (
          <div>
            <EditableMathField
              // // @ts-ignore
              // style={{ width: '100%' }}
              className={'editable-math-field'}
              latex={value} // latex value for the input field
              onChange={mathField => {
                // console.log(mathField.latex());
                onChange(mathField.latex());
              }}
            />
          </div>
        ) : (
          <div>
            <StaticMathField
              // // @ts-ignore
              // style={{ width: '100%' }}
              className={'editable-math-field'}
            >
              {value}
            </StaticMathField>
          </div>
        )
      ) : (
        <BlueInput
          fullWidth
          disableUnderline={!editMode}
          // className={classes.margin}
          onChange={e => {
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          // defaultValue={value}
          value={value}
          readOnly={!editMode}
          inputProps={{
            'aria-label': 'naked',
            style: { cursor: editMode || props.cursorPointer ? 'pointer' : 'default' },
          }}
        />
      )}

      {editMode && mathButtons && (
        <div style={{ padding: '1rem 0' }}>
          {mathButtons.map((buttonName, index) => {
            return (
              <StyledMathButton
                className="mq-editor-button"
                key={index}
                onClick={() => {
                  onChange(value + buttonName);
                }}
              >
                <StaticMathField>{buttonName}</StaticMathField>
              </StyledMathButton>
            );
          })}
        </div>
      )}

      {/* TODO do we need this? */}
      {/*{state.hovered && <FaPencilAlt />}*/}
    </div>
  );
};

export default EditableLabel;
