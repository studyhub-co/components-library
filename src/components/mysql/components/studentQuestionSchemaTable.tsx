import React from 'react';
import DataTable from 'react-data-table-component';

// TODO replace :any with correct types

interface MySQLSchemaTableProps {
  // props
  SQLSchemaJson: string;
}

const Index: React.FC<MySQLSchemaTableProps> = props => {
  const {
    // direct props
    SQLSchemaJson,
  } = props;

  const reactDataTables: any = [];

  try {
    JSON.parse(SQLSchemaJson).map((table: any) => {
      const tableName = Object.keys(table)[0];
      const dataList = table[tableName]['data'];
      const columnList = table[tableName]['columns'];
      const reactDataData: any = [];
      const reactDataColumns: any = [];

      // populate columns
      columnList.map((column: string, index: number) => {
        reactDataColumns.push({
          name: column,
          selector: '' + index,
          sortable: true,
        });
      });

      // populate data
      dataList.map((row: any, index: number) => {
        const reactDataRow: { [index: number]: {} } = {};
        for (let i = 0; i < row.length; i++) {
          reactDataRow[i] = row[i];
        }
        reactDataData.push(reactDataRow);
      });

      const reactTable: { [index: string]: {} } = {};
      reactTable[tableName] = { columns: reactDataColumns, data: reactDataData };

      reactDataTables.push(reactTable);
    });
  } catch (e) {}

  return (
    <div>
      {reactDataTables.map((table: any, i: any) => {
        const tableName = Object.keys(table)[0];
        return (
          <div key={i} style={{ textAlign: 'left' }}>
            <DataTable
              pagination={Boolean(true)}
              paginationPerPage={3}
              title={tableName}
              columns={table[tableName].columns}
              data={table[tableName].data}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Index;
