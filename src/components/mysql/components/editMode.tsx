import React, { useState } from 'react';

// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import Button from '@material-ui/core/Button';

import AceEditor from 'react-ace';
// import brace from 'brace';

// import 'brace/mode/mysql';
// import 'brace/theme/textmate';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-textmate';

interface MySQLEditModeProps {
  // props
  SQLQuery: string;
  SQLSchema: string;
  schemaIsValid: boolean;
  expectedOutput: string;
  // editMode?: boolean;
  onChangeMySQL(SQLSchema: string, SQLQuery: string): void;
}

const Index: React.FC<MySQLEditModeProps> = props => {
  const {
    // direct props
    // editMode: editModeProp,
    SQLQuery: SQLQueryProp,
    SQLSchema: SQLSchemaProp,
    schemaIsValid,
    expectedOutput,
    onChangeMySQL,
  } = props;

  const [SQLQuery, setSQLQuery] = useState(SQLQueryProp);
  const [SQLSchema, setSQLSchema] = useState(SQLSchemaProp);
  // const [schemaIsValid, setSchemaIsValid] = useState(schemaIsValidProp);
  // const [editMode, setEditMode] = useState(editModeProp);

  const schemaPlaceHolder =
    'Schema Panel. \n' +
    'Use this panel to set up your MySQL tables and data (use CREATE TABLE, INSERT, \n' +
    'and other MySQL statements that you need to prepare a representative \n' +
    'sample of your real database).';

  const sqlQueryPlaceHolder =
    'Query Panel. \n' +
    'Use this panel to create a SELECT MySQL query from the database.\n' +
    'The output of this query will be compared with the output of a student answer.';

  return (
    <div>
      <AceEditor
        placeholder={schemaPlaceHolder}
        onChange={setSQLSchema}
        value={SQLSchema}
        showPrintMargin
        showGutter
        mode="mysql"
        theme="textmate"
        height={'20rem'}
        width={'100%'}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <br />
      <Button color="primary" variant="contained" onClick={() => onChangeMySQL(SQLSchema, SQLQuery)}>
        Build Schema and Insert Data
      </Button>
      <br />
      <br />
      <AceEditor
        placeholder={sqlQueryPlaceHolder}
        onChange={setSQLQuery}
        value={SQLQuery}
        showPrintMargin
        showGutter
        readOnly={!schemaIsValid}
        mode="mysql"
        theme="textmate"
        height={'20rem'}
        width={'100%'}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <br />
      <Button
        disabled={!schemaIsValid}
        variant="contained"
        color="primary"
        onClick={() => onChangeMySQL(SQLSchema, SQLQuery)}
      >
        Generate output
      </Button>
      {expectedOutput ? (
        <div>
          <br />
          <h3>Expected output</h3>
          <pre>{expectedOutput}</pre>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
