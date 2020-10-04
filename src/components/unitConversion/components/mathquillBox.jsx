import React from 'react';

import { addStyles, EditableMathField } from 'react-mathquill';

// this will add jQuery to window
import './mathquill-loader';
// this will add MathQuill to window
import * as MathQuill from '@edtr-io/mathquill/build/mathquill.js';

addStyles();

export class MathquillBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const MQ = window.MathQuill.getInterface(2);

    this.answer = MQ.MathField(document.getElementById('' + this.props.row + this.props.column), {
      autoCommands: 'class',
      autoOperatorNames: 'pi', // we want to disable all commands, but MQ throw error if list is empty, so leave pi operator
      handlers: {
        edit: mathField => {
          // if change by API (not user), then not fire
          if (mathField.data.fromJsCall) {
            return;
          }
          this.handleChange(mathField.latex(), this.props.row, this.props.column, mathField);
        },
      },
    });
  }
  componentDidUpdate() {
    // mathquill focus is lost after render
    if (this.props.answer == null && this.props.focus) {
      this.answer.focus();
    }
  }
  handleChange(data, row, col, mathquillObj) {
    this.props.onMathQuillChange(data, row, col, mathquillObj);
  }
  render() {
    const mathFieldStyle = {
      minWidth: 100,
      fontSize: 30,
    };
    return (
      <div>
        <p style={{ marginBottom: 5 }}>
          <span id={'' + this.props.row + this.props.column} style={mathFieldStyle} />
        </p>
      </div>
    );
  }
}
// TODO replace with ts
// MathquillBox.propTypes = {
//     onMathQuillChange: PropTypes.func,
//     row: PropTypes.number.isRequired,
//     column: PropTypes.number.isRequired,
//     focus: PropTypes.bool,
//     answer: PropTypes.object
// }
