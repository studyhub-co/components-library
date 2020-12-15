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
  editMode?: boolean;
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

  console.log(expectedOutput);

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

// export class MySQLAnswer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.handleClickBuildSchemaSQL = this.handleClickBuildSchemaSQL.bind(this);
//     this.generateOutputAndSave = this.generateOutputAndSave.bind(this);
//     this.changeSchemaSQL = this.changeSchemaSQL.bind(this);
//     this.changeQuerySQL = this.changeQuerySQL.bind(this);
//
//     this.state = {
//       schema_SQL: props.schema_SQL,
//       query_SQL: props.query_SQL,
//       text: props.text,
//     };
//   }
//
//   componentWillReceiveProps(nextProps, nextContext) {
//     if (nextProps !== this.props) {
//       this.setState(nextProps);
//     }
//   }
//
//   changeSchemaSQL(value) {
//     this.setState({
//       schema_SQL: value,
//     });
//   }
//
//   changeQuerySQL(value) {
//     this.setState({
//       query_SQL: value,
//     });
//   }
//
//   handleClickBuildSchemaSQL() {
//     if (this.state.schema_SQL) {
//       this.props.onChangeMySQL(this.state.schema_SQL, this.state.query_SQL);
//     }
//   }
//
//   generateOutputAndSave() {
//     if (this.state.schema_SQL && this.state.query_SQL) {
//       this.props.onChangeMySQL(this.state.schema_SQL, this.state.query_SQL);
//     }
//   }
//
//   render() {
//     const schemaPlaceHolder =
//       'Schema Panel\n' +
//       'Use this panel to setup your database problem (CREATE TABLE, INSERT, ' +
//       'and whatever other statements you need to prepare a representative ' +
//       'sample of your real database).';
//
//     const sqlQueryPlaceHolder = 'Query Panel\n' + 'Use this panel to create SQL query for SELECT from database';
//
//     return (
//       <Form.Group>
//         <AceEditor
//           placeholder={schemaPlaceHolder}
//           onChange={this.changeSchemaSQL}
//           value={this.state.schema_SQL}
//           showPrintMargin
//           showGutter
//           mode="mysql"
//           theme="textmate"
//           height={'20rem'}
//           setOptions={{
//             enableBasicAutocompletion: false,
//             enableLiveAutocompletion: false,
//             enableSnippets: false,
//             showLineNumbers: true,
//             tabSize: 2,
//           }}
//         />
//         <br />
//         <Button variant="primary" onClick={this.handleClickBuildSchemaSQL}>
//           Build Schema
//         </Button>
//         <br />
//         <br />
//         <AceEditor
//           placeholder={sqlQueryPlaceHolder}
//           onChange={this.changeQuerySQL}
//           value={this.state.query_SQL}
//           showPrintMargin
//           showGutter
//           readOnly={this.props && !this.props.schema_is_valid}
//           mode="mysql"
//           theme="textmate"
//           height={'20rem'}
//           setOptions={{
//             enableBasicAutocompletion: false,
//             enableLiveAutocompletion: false,
//             enableSnippets: false,
//             showLineNumbers: true,
//             tabSize: 2,
//           }}
//         />
//         <br />
//         <Button
//           disabled={this.props && !this.props.schema_is_valid}
//           variant="primary"
//           onClick={this.generateOutputAndSave}
//         >
//           Generate output & save answer
//         </Button>
//         {this.props && this.props.text ? (
//           <div>
//             <br />
//             <h3>Expected output</h3>
//             <pre>{this.props.text}</pre>
//           </div>
//         ) : null}
//       </Form.Group>
//     );
//   }
// }
