import React from 'react';

import { MathquillBox } from './mathquillBox';

interface ConversionTableProps {
  onMathQuillChange: (data: any, row: number, col: number, mathquillObj: any) => void;
  strikethroughN: boolean;
  strikethroughD: boolean;
  conversionSessionHash: string;
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
    conversionSessionHash: csh,
  } = props;

  const getColumns = (row: number) => {
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
          <MathquillBox conversionSessionHash={csh} row={row} column={i + 1} onMathQuillChange={onMathQuillChange} />
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
  } as React.CSSProperties;
  const unitStyle = {
    fontStyle: 'italic',
    fontFamily: 'Times New Roman',
  } as React.CSSProperties;

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
  } as React.CSSProperties;
  const bottomRight = {
    border: '1px solid black',
    borderBottom: 'none',
    textAlign: 'right',
    borderLeft: 'none',
    padding: 2,
    fontFamily: 'symbola',
    fontSize: 30,
  } as React.CSSProperties;

  return (
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
  );
};
