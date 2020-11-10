import React from 'react';

import { MathquillBox } from './mathquillBox';

export class ConversionTable extends React.Component {
  constructor(props) {
    super(props);
    // this.onMathQuillChange = this.onMathQuillChange.bind(this);
  }

  getColumns(row) {
    const border = { border: '1px solid black', padding: 2 };
    const noTop = { borderTop: 'none' };
    const noBottom = { borderBottom: 'none' };
    const noRight = { borderRight: 'none' };

    const tdColumns = [];
    for (let i = 0; i < this.props.numColumns; i++) {
      let styles = border;
      if (row === 1) {
        styles = Object.assign(styles, noTop);
      }
      if (row === 2) {
        styles = Object.assign(styles, noBottom);
      }
      if (i === this.props.numColumns - 1) {
        styles = Object.assign(styles, noRight);
      }
      tdColumns.push(
        <td style={styles} key={i}>
          <MathquillBox row={row} column={i + 1} onMathQuillChange={this.props.onMathQuillChange} />
        </td>,
      );
    }
    return tdColumns;
  }

  render() {
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
      textDecoration: this.props.strikethroughN ? 'line-through' : 'none',
    };

    const strikethroughStyleD = {
      textDecoration: this.props.strikethroughD ? 'line-through' : 'none',
    };

    const topLeft = {
      border: '1px solid black',
      borderTop: 'none',
      borderLeft: 'none',
      padding: 2,
      fontFamily: 'symbola',
      // fontSize: 30,
    };
    const bottomRight = {
      border: '1px solid black',
      borderBottom: 'none',
      textAlign: 'right',
      borderLeft: 'none',
      padding: 2,
      fontFamily: 'symbola',
      // fontSize: 30,
    };

    return (
      <div>
        <table style={style}>
          <tbody>
            <tr>
              <td style={{ ...topLeft, whiteSpace: 'nowrap' }}>
                {/* student view */}
                {this.props.number && this.props.unit ? (
                  <React.Fragment>
                    {this.props.number}{' '}
                    <span style={{ ...unitStyle, ...strikethroughStyleN }}>{this.props.unit.split('/')[0]}</span>
                  </React.Fragment>
                ) : null}
                {/* edit mode view */}
                {this.props.editMode && (
                  <div>
                    <MathquillBox row={1} column={0} onMathQuillChange={this.props.onQuestionValueChange} />
                  </div>
                )}
              </td>
              {this.getColumns(1)}
            </tr>
            <tr>
              <td style={bottomRight}>
                {this.props.number && this.props.unit ? (
                  <span style={{ ...unitStyle, ...strikethroughStyleD }}>{this.props.unit.split('/')[1]}</span>
                ) : null}
              </td>
              {this.getColumns(2)}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
// TODO replace with ts
// ConversionTable.propTypes = {
//     onMathQuillChange: PropTypes.func,
//     strikethroughN: PropTypes.bool,
//     strikethroughD: PropTypes.bool,
//     numColumns: PropTypes.number,
//     number: PropTypes.any,
//     unit: PropTypes.string
// }
