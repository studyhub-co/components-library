import React from 'react';

import { addStyles, StaticMathField, EditableMathField } from 'react-mathquill';
import Input, { InputProps } from '@material-ui/core/Input';
import { FaPencilAlt } from 'react-icons/fa';
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
const BlueInput = withStyles({
  root: {
    color: 'inherit',
  },
})((props: InputProps) => <Input color="primary" {...props} />);

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
// 2. MathJax
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

// export class EditableLabel extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {editing: false}
//     this.handleEditClick = this.handleEditClick.bind(this)
//     this.handleInputChange = this.handleInputChange.bind(this)
//     this.handleInputBlur = this.handleInputBlur.bind(this)
//     this.handleFormSubmit = this.handleFormSubmit.bind(this)
//     this.handleInputKeyUp = this.handleInputKeyUp.bind(this)
//     this.setInputRef = this.setInputRef.bind(this)
//   }
//
//   handleEditClick (e) {
//     var val = this.props.value
//     if (this.props.value === this.props.defaultValue) { val = '' }
//     if (this._inputRef) { this.focus() }
//     this.setState({editing: true,
//       value: val})
//   }
//
//   setInputRef (ref) {
//     this._inputRef = ref
//     if (ref && this.state.editing) { this.focus() }
//   }
//
//   focus () {
//     this._inputRef.focus()
//     var v = this._inputRef.value
//     this._inputRef.value = ''
//     this._inputRef.value = v
//   }
//
//   handleInputChange (e) {
//     this.setState({'value': e.target.value})
//   }
//
//   handleInputBlur (e) {
//     this.save()
//   }
//
//   handleInputKeyUp (e) {
//     if (e.which === 27) {
//       this.setState({editing: false})
//     }
//   }
//
//   handleFormSubmit (e) {
//     e.preventDefault()
//     this.save()
//     return false
//   }
//
//   save () {
//     this.setState({editing: false})
//     this.props.onChange(this.state.value)
//   }
//
//   componentDidMount () {
//     MathJax.Hub.Config(DEFAULT_MATHJAX_OPTIONS)
//     MathJax.Hub.Queue(['Typeset', MathJax.Hub])
//   }
//   componentDidUpdate () {
//     MathJax.Hub.Config(DEFAULT_MATHJAX_OPTIONS)
//     MathJax.Hub.Queue(['Typeset', MathJax.Hub])
//   }
//
//   render () {
//     if (this.state.editing) {
//       return (<form onSubmit={this.handleFormSubmit} style={{display: 'inline'}}>
//         { this.props && this.props.type !== 'textarea'
//           ? <input
//             type='text'
//             value={this.state.value}
//             onChange={this.handleInputChange}
//             onBlur={this.handleInputBlur}
//             ref={this.setInputRef}
//             onKeyUp={this.handleInputKeyUp}/>
//           : <textarea
//             rows='10'
//             style={{'width': '100%'}}
//             value={this.state.value}
//             onChange={this.handleInputChange}
//             onBlur={this.handleInputBlur}
//             ref={this.setInputRef}
//             onKeyUp={this.handleInputKeyUp}/>
//         }
//       </form>)
//     } else {
//       return (
//         <span className={'editable-label' + (((this.props.value && this.props.value.trim()) || this.props.defaultValue) ? '' : ' empty')} onClick={this.handleEditClick}>
//           <span>{this.props.value || this.props.defaultValue}</span>
//           {/* <span className='glyphicon glyphicon-pencil'/> */}
//           <FaPencilAlt className={'glyphicon-pencil'} />
//         </span>
//       )
//     }
//   }
// }
//
// export class EditableExternalEventLabel extends EditableLabel {
//   componentWillReceiveProps (props) {
//     var val = this.props.value
//     if (props.editMode) {
//       if (this.props.value === this.props.defaultValue) {
//         val = ''
//       }
//       if (this._inputRef) {
//         this.focus()
//       }
//       this.setState({
//         editing: true,
//         value: val
//       })
//     }
//   }
//
//   render () {
//     var inputParams = {type: 'text',
//       value: this.state.value || '',
//       onChange: this.handleInputChange,
//       onBlur: this.handleInputBlur,
//       ref: this.setInputRef,
//       onKeyUp: this.handleInputKeyUp}
//
//     var input = <input {...inputParams} />
//     if (this.props.textArea) {
//       input = <textarea {...inputParams} style={{ 'width': '90%' }} />
//     }
//     if (this.state.editing) {
//       return (
//         <form onSubmit={this.handleFormSubmit} style={{display: 'inline'}}>
//           {input}
//         </form>)
//     } else {
//       return (
//         <span
//           className={'editable-label' + (((this.props.value && this.props.value.trim()) || this.props.defaultValue) ? '' : ' empty')}
//           onClick={this.handleEditClick}
//           style={{whiteSpace: 'pre-line'}}
//         >
//           <span>{this.props.value || this.props.defaultValue}</span>
//         </span>)
//     }
//   }
// }
