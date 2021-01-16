import React from 'react';

import { MathquillBox } from './mathquillBox';

interface ConversionTableProps {
  onMathQuillChange: (data: any, row: number, col: number, mathquillObj: object) => void;
  strikethroughN: boolean;
  strikethroughD: boolean;
  numColumns: number;
  number: string;
  unit: string;
}

export const ConversionTable: React.FC<ConversionTableProps> = props => {
  const {
    // direct props
    onMathQuillChange,
    strikethroughN,
    strikethroughD,
    numColumns,
    number,
    unit,
  } = props;

  const getColumns = row => {
    const border = { border: '1px solid black', padding: 2 };
    const noTop = { borderTop: 'none' };
    const noBottom = { borderBottom: 'none' };
    const noRight = { borderRight: 'none' };

    const tdColumns = [];
    for (let i = 0; i < numColumns; i++) {
      let styles = border;
      if (row === 1) {
        styles = Object.assign(styles, noTop);
      }
      if (row === 2) {
        styles = Object.assign(styles, noBottom);
      }
      if (i === numColumns - 1) {
        styles = Object.assign(styles, noRight);
      }
      tdColumns.push(
        <td style={styles} key={i}>
          <MathquillBox row={row} column={i + 1} onMathQuillChange={onMathQuillChange} />
        </td>,
      );
    }
    return tdColumns;
  };

  const style = {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderCollapse: 'collapse',
    borderStyle: 'hidden',
    display: 'table-cell',
    verticalAlign: 'middle',
  };
  const unitStyle = {
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
  };

  const strikethroughStyleN = {
    textDecoration: strikethroughN ? 'line-through' : 'none',
  };

  const strikethroughStyleD = {
    textDecoration: strikethroughD ? 'line-through' : 'none',
  };

  const topLeft = {
    border: '1px solid black',
    borderTop: 'none',
    borderLeft: 'none',
    padding: 2,
    fontFamily: 'symbola',
    fontSize: 30,
  };
  const bottomRight = {
    border: '1px solid black',
    borderBottom: 'none',
    textAlign: 'right',
    borderLeft: 'none',
    padding: 2,
    fontFamily: 'symbola',
    fontSize: 30,
  };

  return (
    <div>
      <table style={style}>
        <tbody>
          <tr>
            <td style={Object.assign({}, topLeft, { whiteSpace: 'nowrap' })}>
              {number} <span style={Object.assign({}, unitStyle, strikethroughStyleN)}>{unit.split('/')[0]}</span>
            </td>
            {getColumns(1)}
          </tr>
          <tr>
            <td style={bottomRight}>
              <span style={Object.assign({}, unitStyle, strikethroughStyleD)}>{unit.split('/')[1]}</span>
            </td>
            {getColumns(2)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// export class ConversionTable extends React.Component {
//   constructor (props) {
//     super(props)
//     this.onMathQuillChange = this.onMathQuillChange.bind(this)
//   }
//
//   onMathQuillChange (data, row, col, mathquillObj) {
//     this.props.onMathQuillChange(data, row, col, mathquillObj)
//   }
//
//   getColumns (row) {
//     var border = {'border': '1px solid black', 'padding': 2}
//     var noTop = {borderTop: 'none'}
//     var noBottom = {borderBottom: 'none'}
//     var noRight = {borderRight: 'none'}
//
//     var tdColumns = []
//     for (var i = 0; i < this.props.numColumns; i++) {
//       var styles = border
//       if (row === 1) { styles = Object.assign(styles, noTop) }
//       if (row === 2) { styles = Object.assign(styles, noBottom) }
//       if (i === (this.props.numColumns - 1)) { styles = Object.assign(styles, noRight) }
//       tdColumns.push(
//         <td style={styles} key={i}>
//           <MathquillBox
//             row={row}
//             column={i + 1}
//             onMathQuillChange={this.onMathQuillChange}
//           />
//         </td>)
//     }
//     return tdColumns
//   }
//
//   render () {
//     var style = {
//       marginLeft: 'auto',
//       marginRight: 'auto',
//       borderCollapse: 'collapse',
//       borderStyle: 'hidden',
//       display: 'table-cell',
//       verticalAlign: 'middle'
//     }
//     var unitStyle = {
//       fontStyle: 'italic',
//       fontFamily: 'Times New Roman'
//     }
//
//     var strikethroughStyleN = {
//       textDecoration: (this.props.strikethroughN ? 'line-through' : 'none')
//     }
//
//     var strikethroughStyleD = {
//       textDecoration: (this.props.strikethroughD ? 'line-through' : 'none')
//     }
//
//     var topLeft = {
//       border: '1px solid black',
//       borderTop: 'none',
//       borderLeft: 'none',
//       padding: 2,
//       fontFamily: 'symbola',
//       fontSize: 30
//     }
//     var bottomRight = {
//       border: '1px solid black',
//       borderBottom: 'none',
//       textAlign: 'right',
//       borderLeft: 'none',
//       padding: 2,
//       fontFamily: 'symbola',
//       fontSize: 30}
//
//     return (
//       <div>
//         <table style={style}>
//           <tbody>
//           <tr>
//             <td style={Object.assign({}, topLeft, {whiteSpace: 'nowrap'})}>{this.props.number} <span style={Object.assign({}, unitStyle, strikethroughStyleN)}>{this.props.unit.split('/')[0]}</span></td>
//             {this.getColumns(1)}
//           </tr>
//           <tr>
//             <td style={bottomRight}><span style={Object.assign({}, unitStyle, strikethroughStyleD)}>{this.props.unit.split('/')[1]}</span></td>
//             {this.getColumns(2)}
//           </tr>
//           </tbody>
//         </table>
//       </div>
//     )
//   }
// }
// ConversionTable.propTypes = {
//   onMathQuillChange: PropTypes.func,
//   strikethroughN: PropTypes.bool,
//   strikethroughD: PropTypes.bool,
//   numColumns: PropTypes.number,
//   number: PropTypes.any,
//   unit: PropTypes.string
// }
