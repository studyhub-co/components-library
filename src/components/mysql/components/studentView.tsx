import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-textmate';
import Button from '@material-ui/core/Button';
import { makeServiceRequest } from '../serviceRequests';

interface MySQLStudentModeProps {
  // props
  SQLSchema: string;
  executedJsonSQL: string;
  onStudentResponseChange(SQLQuery: string, expectedOutput: string, expectedOutputJson: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    button: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  }),
);

const Index: React.FC<MySQLStudentModeProps> = props => {
  const {
    // direct props
    SQLSchema: SQLSchemaProp,
    onStudentResponseChange,
    executedJsonSQL,
  } = props;

  const [StudentSQLQuery, setStudentSQLQuery] = useState('');
  const [executedMysqlError, setExecutedMysqlError] = useState('');

  const sqlQueryPlaceHolder = 'Query Panel. \n' + 'Use this panel to create SQL query';

  const hasAnswer = false;

  const classes = useStyles();

  const reset = () => {
    onStudentResponseChange('', '', '');
    setExecutedMysqlError('');
    setStudentSQLQuery('');
  };

  const executeSQL = () => {
    setExecutedMysqlError('');

    if (!StudentSQLQuery) return;

    makeServiceRequest({ SQLSchema: SQLSchemaProp, SQLQuery: StudentSQLQuery }, 'validate_mysql_schema_query')
      .then((response: any) => {
        if (response.SQLSchemaResultJson) {
          onStudentResponseChange(response.SQLQuery, response.expectedOutput, response.expectedOutputJson);
        } else {
          alert('Invalid SQL schema');
        }
      })
      .catch(e => {
        // if not ok - send error to the user
        if (e.response?.status === 400) {
          if (e.response.data.hasOwnProperty('SQLQuery')) {
            setExecutedMysqlError(e.response.data['SQLQuery']);
          }
        }
      });

    // this.setState({executedMysqlError: e.response.responseJSON['error']})
    //  validation error TODO - move to API
    // let validationErrorMessage = 'Validation error: \n';
    // for (const [key, value] of Object.entries(e.response.data)) {
    //   validationErrorMessage += `${key} : ${value} \n`;
    //   alert(validationErrorMessage);
    // }
    // }
    //   if (e.response?.status === 503) {
    //     alert(e.response.data.detail);
    //   }
    // });

    // $.ajax({
    //   type: 'POST',
    //   url: '/api/v1/curricula/questions/' +
    //     this.props.question.uuid +
    //     '/service?type=execute_mysql',
    //   dataType: 'json',
    //   data: JSON.stringify({value: this.state.querySQL}),
    //   contentType: 'application/json; charset=utf-8',
    //   async: true,
    //   context: this,
    //   success: function (data, status, jqXHR) {
    //     this.setState({executedJsonSQL: data['json_mysql_result']})
    //   },
    //   error: function (error) {
    //     if (error.status === 400) { // validation error
    //       this.setState({executedMysqlError: error.responseJSON['error']})
    //     }
    //   }
    // })
  };

  const reactDataData: any = [];
  const reactDataColumns: any = [];

  if (executedJsonSQL) {
    const dataDict = JSON.parse(executedJsonSQL);

    // populate columns
    dataDict.columns.map((column: any, index: number) => {
      reactDataColumns.push({
        name: column,
        selector: '' + index,
        sortable: true,
      });
    });

    // populate data
    dataDict.data.map((row: any, index: number) => {
      const reactDataRow: { [index: number]: {} } = {};
      for (let i = 0; i < row.length; i++) {
        reactDataRow[i] = row[i];
      }
      reactDataData.push(reactDataRow);
    });
  }

  return (
    <div>
      <AceEditor
        placeholder={sqlQueryPlaceHolder}
        onChange={setStudentSQLQuery}
        value={StudentSQLQuery}
        readOnly={hasAnswer}
        showPrintMargin
        showGutter
        mode="mysql"
        theme="textmate"
        height={'15rem'}
        width={'100%'}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs>
            <div className={classes.button}>
              <Button color="primary" variant="contained" onClick={executeSQL}>
                {/*disabled={!this.state.querySQL || hasAnswer}>*/}
                Run
              </Button>
            </div>
          </Grid>
          <Grid item xs>
            <div className={classes.button}>
              <Button color="primary" variant="contained" onClick={reset}>
                {/*disabled={!this.state.querySQL || hasAnswer}>*/}
                Reset
              </Button>
            </div>
          </Grid>
        </Grid>
        {executedMysqlError || reactDataColumns.length > 0 ? (
          <div className="bounding-box">
            <span style={{ color: 'red' }}>{executedMysqlError}</span>
            {reactDataColumns.length > 0 && (
              <DataTable
                noHeader
                pagination={Boolean(true)}
                paginationPerPage={3}
                columns={reactDataColumns}
                data={reactDataData}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;

// import React from 'react'
// import PropTypes from 'prop-types'
//
// import DataTable from 'react-data-table-component'
// import Button from 'react-bootstrap/Button'
// // import Form from 'react-bootstrap/Form'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/Container'
//
// import AceEditor from 'react-ace'
// import brace from 'brace'
//
// import 'brace/mode/mysql'
// import 'brace/theme/textmate'
//
// export class MYSQLAnswer extends React.Component {
//   constructor (props) {
//     super(props)
//     this.changeQuerySQL = this.changeQuerySQL.bind(this)
//     this.executeSQL = this.executeSQL.bind(this)
//     this.reset = this.reset.bind(this)
//     this.state = {
//       querySQL: '',
//       executedMysqlError: '',
//       executedJsonSQL: ''
//     }
//
//     this.baseState = this.state
//   }
//
//   componentWillReceiveProps (nextProps) {
//     if (nextProps.question.uuid !== this.props.question.uuid) {
//       // reset answer
//       this.reset()
//     }
//   }
//
//   reset () {
//     this.setState(this.baseState)
//   }
//
//   changeQuerySQL (value) {
//     this.props.updateAnswer([this.props.question.uuid, {
//       my_sql: {
//         query_SQL: value
//       }}])
//     this.setState({querySQL: value})
//   }
//
//   executeSQL () {
//     this.setState({executedMysqlError: '', executedJsonSQL: ''})
//     $.ajax({
//       type: 'POST',
//       url: '/api/v1/curricula/questions/' +
//         this.props.question.uuid +
//         '/service?type=execute_mysql',
//       dataType: 'json',
//       data: JSON.stringify({value: this.state.querySQL}),
//       contentType: 'application/json; charset=utf-8',
//       async: true,
//       context: this,
//       success: function (data, status, jqXHR) {
//         this.setState({executedJsonSQL: data['json_mysql_result']})
//       },
//       error: function (error) {
//         if (error.status === 400) { // validation error
//           this.setState({executedMysqlError: error.responseJSON['error']})
//         }
//       }
//     })
//   }
//
//   render () {
//     var hasAnswer = false // user gave answer
//     if (this.props.answer || this.props.question.is_correct) {
//       hasAnswer = true
//     }
//
//     const reactDataData = []
//     const reactDataColumns = []
//
//     if (this.state.executedJsonSQL) {
//       const dataDict = JSON.parse(this.state.executedJsonSQL)
//
//       // populate columns
//       dataDict.columns.map((column, index) => {
//         reactDataColumns.push({
//           name: column,
//           selector: '' + index,
//           sortable: true
//         })
//       })
//
//       // populate data
//       dataDict.data.map((row, index) => {
//         let reactDataRow = {}
//         for (let i = 0; i < row.length; i++) {
//           reactDataRow[i] = row[i]
//         }
//         reactDataData.push(reactDataRow)
//       })
//     }
//
//     const sqlQueryPlaceHolder = 'Query Panel\n' +
//       'Use this panel to create SQL query for SELECT from database'
//
//     return (
//       <div>
//         <div className='bounding-box'>
//           {/* <Form.Group> */}
//           <AceEditor
//             placeholder={sqlQueryPlaceHolder}
//             onChange={this.changeQuerySQL}
//             value={this.state.querySQL}
//             readOnly={hasAnswer}
//             showPrintMargin
//             showGutter
//             mode='mysql'
//             theme='textmate'
//             height={'15rem'}
//             width={'100%'}
//             setOptions={{
//               enableBasicAutocompletion: false,
//               enableLiveAutocompletion: false,
//               enableSnippets: false,
//               showLineNumbers: true,
//               tabSize: 2
//             }}
//           />
//           <Container>
//             <Row>
//               <Col md={4} sm={0} />
//               <Col md={4} sm={6} xs={6} >
//                 <Button
//                   onClick={this.executeSQL}
//                   disabled={!this.state.querySQL || hasAnswer}>
//                   Run
//                 </Button>
//               </Col>
//               <Col md={4} sm={6} xs={6}>
//                 <Button
//                   disabled={hasAnswer}
//                   onClick={this.reset}>
//                   Reset
//                 </Button>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//         {this.state.executedMysqlError || reactDataColumns.length > 0
//           ? <div className='bounding-box'>
//             <span style={{'color': 'red'}}>{this.state.executedMysqlError}</span>
//             {reactDataColumns.length > 0 &&
//             <DataTable
//                 noHeader
//                 pagination={Boolean(true)}
//                 paginationPerPage={3}
//                 columns={reactDataColumns}
//                 data={reactDataData}
//             />
//             }
//             {/* </Form.Group> */}
//           </div> : null }
//       </div>
//     )
//   }
// }
