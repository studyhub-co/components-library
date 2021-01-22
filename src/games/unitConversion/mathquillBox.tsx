import React, { useEffect, useRef } from 'react';

interface MathquillBoxProps {
  onMathQuillChange: (data: any, row: number, col: number, mathquillObj: any) => void;
  row: number;
  column: number;
  conversionSessionHash: string;
  focus?: boolean;
  answer?: object;
}

export const MathquillBox: React.FC<MathquillBoxProps> = props => {
  const {
    // direct props
    column,
    focus,
    answer,
    row,
    onMathQuillChange,
    conversionSessionHash: csh,
  } = props;

  const answerField = useRef();

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);

    answerField.current = MQ.MathField(document.getElementById(csh + '-' + row + column), {
      autoCommands: 'class',
      autoOperatorNames: 'pi', // we want to disable all commands, but MQ throw error if list is empty, so leave pi operator
      handlers: {
        edit: (mathField: any) => {
          // if change by API (not user), then not fire
          if (mathField.data.fromJsCall) {
            return;
          }
          handleChange(mathField.latex(), row, column, mathField);
        },
      },
    });
  }, [column, row]);

  useEffect(() => {
    // mathquill focus is lost after render
    if (answer === null && focus) {
      const field = answerField.current as any;
      field.focus();
    }
  });

  const handleChange = (data: string, row: number, col: number, mathquillObj: any) => {
    onMathQuillChange(data, row, col, mathquillObj);
  };

  const mathFieldStyle = {
    minWidth: 100,
    fontSize: 30,
  };

  return (
    <div>
      <p style={{ marginBottom: 5 }}>
        <span id={csh + '-' + row + column} style={mathFieldStyle} />
      </p>
    </div>
  );
};

// export class MathquillBox extends React.Component {
//   constructor (props) {
//     super(props)
//     this.handleChange = this.handleChange.bind(this)
//   }
//   componentDidMount () {
//     var MQ = MathQuill.getInterface(2)
//
//     this.answer = MQ.MathField(document.getElementById('' + this.props.row + this.props.column), {
//       autoCommands: 'class',
//       autoOperatorNames: 'pi', // we want to disable all commands, but MQ throw error if list is empty, so leave pi operator
//       handlers: {
//         edit: (mathField) => {
//           // if change by API (not user), then not fire
//           if (mathField.data.fromJsCall) { return }
//           this.handleChange(mathField.latex(), this.props.row, this.props.column, mathField)
//         }
//       }
//     })
//     // if (this.props.focus){
//     //   this.answer.focus()
//     // }
//   }
//   componentDidUpdate () {
//     // mathquill focus is lost after render
//     if (this.props.answer == null && this.props.focus) {
//       this.answer.focus()
//     }
//   }
//   handleChange (data, row, col, mathquillObj) {
//     this.props.onMathQuillChange(data, row, col, mathquillObj)
//   }
//   render () {
//     var mathFieldStyle = {
//       minWidth: 100,
//       fontSize: 30
//     }
//     return (
//       <div>
//         <p style={{marginBottom: 5}}>
//           <span id={'' + this.props.row + this.props.column} style={mathFieldStyle} />
//         </p>
//       </div>
//     )
//   }
// }
// MathquillBox.propTypes = {
//   onMathQuillChange: PropTypes.func,
//   row: PropTypes.number.isRequired,
//   column: PropTypes.number.isRequired,
//   focus: PropTypes.bool,
//   answer: PropTypes.object
// }
