// export class UnitConversionCanvas extends UnitConversionBase {
//   constructor (props) {
//     super(props)
//     this.submitQuestion = this.submitQuestion.bind(this)
//   }
//
//   keydown (e) {
//     if (e.code === 'Enter') {
//       // detect that calculator field and button is not focused
//       if (!document.getElementById('calculatorField').classList.contains('mq-focused') &&
//         (document.activeElement !== document.getElementById('checkButton')) &&
//         (document.activeElement !== document.getElementById('addStep')) &&
//         (document.activeElement !== document.getElementById('removeStep'))
//       ) {
//         this.submitQuestion()
//       }
//     }
//   }
//
//   updateAnswer (answer) {
//     var MQ = MathQuill.getInterface(2)
//     MQ.MathField(document.getElementById('15')).latex(answer)
//     MQ.MathField(document.getElementById('15')).focus()
//   }
//
//   componentDidMount () {
//     var MQ = MathQuill.getInterface(2)
//     if (this.props.level === 5) {
//       this.setState({
//         answersSteps: []
//       })
//     } else {
//       this.setState({
//         answersSteps: [[ // first column set by default
//           {'data': '', 'box': MQ(document.getElementById('11'))},
//           {'data': '', 'box': MQ(document.getElementById('21'))}
//         ]]
//       })
//     }
//     document.addEventListener('keydown', this.keydown.bind(this), false)
//   }
//
//   componentWillUnmount () {
//     document.removeEventListener('keydown', this.keydown, false)
//   }
//
//   submitQuestion () {
//     var answers = this.state.answersSteps
//     var uncrossedUnits = this.state.uncrossedUnits
//     var qNumber = this.props.number
//     var qUnit = this.props.unit
//
//     var spanNElement = null
//     var spanDElement = null
//
//     var isRightAnswer = true
//
//     if (!this.state.answersSteps || this.state.answersSteps.length === 0 || !this.state.answer || !this.state.answer['data']) {
//       return
//     }
//
//     // checking for correct units conversions
//     for (var column = 0; column < answers.length; column++) { // walk through columns
//       var numerator = answers[column][0]
//       if (numerator['box']) {
//         spanNElement = numerator['box'].__controller.container[0]
//       }
//       var denominator = answers[column][1]
//       if (denominator['box']) {
//         spanDElement = denominator['box'].__controller.container[0]
//       }
//       var qnQty, qdQty
//
//       if (this.clearDataText(numerator['data']) === '' || this.clearDataText(denominator['data']) === '') { // catch emtpy text
//         qnQty = null
//         qdQty = null
//       } else {
//         qnQty = Qty.parse(this.clearDataText(numerator['data']))
//         qdQty = Qty.parse(this.clearDataText(denominator['data']))
//       }
//
//       var incorrectKind = false
//       var incorrectCount = 0
//
//       if (qnQty && qdQty) {
//         // check for unit kind
//         var correctQsUnits = [qUnit.split('/')[0]]
//
//         if (qUnit.split('/')[1]) { // km/s
//           correctQsUnits.push(qUnit.split('/')[1])
//         }
//
//         for (var i = 0; i < correctQsUnits.length; i++) {
//           var initialUnitQty = Qty.parse(correctQsUnits[i])
//           if (initialUnitQty.kind() !== (qnQty.kind() && qdQty.kind())) {
//             incorrectCount++
//           }
//         }
//         if (incorrectCount > (correctQsUnits.length - 1)) { // for km/s can be only one incorrect
//           incorrectKind = true
//         }
//       }
//
//       // check conversions steps
//       if (qnQty && qdQty && !incorrectKind && qnQty.isCompatible(qdQty) && this.compareWithSigFigs(qnQty, qdQty)) {
//         if (spanNElement) { spanNElement.classList.add('green-border') }
//         if (spanDElement) { spanDElement.classList.add('green-border') }
//       } else {
//         if (incorrectKind) {
//           this.setState({
//             incorrectUnitType: true
//           })
//         } else {
//           this.setState({
//             incorrectConversion: true
//           })
//         }
//         isRightAnswer = false
//         if (spanNElement) { spanNElement.classList.add('red-border') }
//         if (spanDElement) { spanDElement.classList.add('red-border') }
//       }
//     } // end for
//
//     // check answer
//     var initialQty = new Qty(Number(qNumber), qUnit)
//     var answerSpan = document.getElementById('15')
//
//     var answerQty
//     if (this.state.answer && this.state.answer['data'] && this.clearDataText(this.state.answer['data']) !== '') {
//       answerQty = Qty.parse(this.clearDataText(this.state.answer['data']))
//     } else {
//       answerQty = null
//     }
//
//     if (answerQty && answerQty.isCompatible(initialQty) && this.compareWithSigFigs(initialQty, answerQty)) {
//       answerSpan.classList.add('green-border')
//     } else {
//       var correctAnswer
//
//       if (initialQty.toBase().scalar < 1) {
//         // leave just significant figures for answer
//         correctAnswer = this.sigFigs(initialQty.toBase().scalar, 4)
//       } else {
//         correctAnswer = initialQty.toBase().scalar.toFixed(2)
//       }
//
//       var incompleteConversion = true
//       // checking for incomplete units conversions
//       if (uncrossedUnits && uncrossedUnits['nums'].length === 1 && uncrossedUnits['denoms'].length <= 1) {
//         var remainUnit = uncrossedUnits['nums'][0]
//         if (uncrossedUnits['denoms'].length === 1) {
//           remainUnit += '/' + uncrossedUnits['denoms']
//         } else { // try to use initial denominator
//           if (typeof qUnit.split('/')[1] !== 'undefined') {
//             remainUnit += '/' + qUnit.split('/')[1]
//           }
//         }
//         // compare answer and remain unit
//         if (this.state.answer) {
//           var answerText = this.constructor.parseToValueUnit(this.clearDataText(this.state.answer['data']))
//
//           if (answerText && typeof answerText[1] !== 'undefined' && answerText[1] === remainUnit) {
//             incompleteConversion = false
//           }
//         }
//       }
//
//       if (incompleteConversion) {
//         isRightAnswer = false
//         this.setState({
//           incompleteConversion: true
//         })
//       }
//
//       this.setState({
//         incorrectAnswer: true,
//         correctAnswer: correctAnswer + ' ' + initialQty.toBase().toString().split(' ')[1]
//       })
//       isRightAnswer = false
//       answerSpan.classList.add('red-border')
//     }
//
//     if (isRightAnswer === true) {
//       playAudio('correct')
//       this.reset()
//       this.props.nextQuestion(500)
//     } else {
//       playAudio('incorrect')
//       this.props.gameOver()
//     }
//
//     // erase calculator
//     if (document.getElementById('calculatorField')) {
//       var MQ = MathQuill.getInterface(2)
//       MQ(document.getElementById('calculatorField')).latex('')
//     }
//   }
//   render () {
//     var buttonStyle = {
//       padding: 2,
//       display: 'block',
//       margin: 'auto',
//       marginTop: 1,
//       marginBottom: 1
//     }
//     var disabledButtonStyle = {
//       padding: 2,
//       display: 'block',
//       margin: 'auto',
//       marginTop: 1,
//       marginBottom: 1,
//       cursor: 'not-allowed',
//       pointerEvents: 'none',
//       color: '#c0c0c0',
//       border: '.2rem solid #c0c0c0',
//       backgroundColor: '#ffffff'
//     }
//
//     var pointerEvents = 'auto'
//
//     if (this.props.gameState === GameState.GAME_OVER) {
//       pointerEvents = 'none'
//       try {
//         document.getElementById('tryAgain').focus()
//       } catch (e) {}
//     }
//
//     return (
//       <div style={{ pointerEvents: pointerEvents }}>
//         <div style={{display: 'block'}}>
//           <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}}>
//             <ConversionTable
//               numColumns={this.state.numColumns}
//               onMathQuillChange={this.onMathQuillChange}
//               number={this.props.number}
//               unit={this.props.unit}
//               strikethroughN={this.state.strikethroughN}
//               strikethroughD={this.state.strikethroughD}
//             />
//             {this.state.incompleteConversion
//               ? <div style={{border: '.1rem solid black'}}>
//                 <div style={{color: 'red'}}>Incorrect: incomplete conversion</div>
//               </div>
//               : null}
//             {this.state.incorrectConversion
//               ? <div style={{border: '.1rem solid black'}}>
//                 <div style={{color: 'red'}}>Incorrect unit conversion</div>
//               </div>
//               : null}
//             {this.state.incorrectUnitType
//               ? <div style={{border: '.1rem solid black'}}>
//                 <div style={{color: 'red'}}>Incorrect unit type</div>
//               </div>
//               : null}
//             {this.props.level > 4 ? null
//               : <div style={{fontSize: 10, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 0, paddingRight: 0}}>
//                 <button id='addStep'
//                         className='hover-button'
//                         style={this.state.numColumns === 4 ? disabledButtonStyle : buttonStyle}
//                         onClick={this.addColumn}>+Add Step</button>
//                 <button id='removeStep'
//                         className='hover-button'
//                         style={this.state.numColumns === 1 ? disabledButtonStyle : buttonStyle} onClick={this.removeColumn}
//                         disabled={this.state.numColumns === 1}>
//                   -Remove Step
//                 </button>
//               </div>
//             }
//             <div style={{fontSize: 30, display: 'table-cell', verticalAlign: 'middle', paddingLeft: 15, paddingRight: 15}}>
//               =
//             </div>
//             <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
//               <MathquillBox
//                 onMathQuillChange={this.onResultChange}
//                 row={1}
//                 column={5}
//               />
//               {this.state.incorrectAnswer
//                 ? <div style={{border: '.1rem solid black'}}>
//                   <div style={{color: 'red'}}>Incorrect answer</div>
//                   <div style={{color: 'green'}}>Correct answer: {this.state.correctAnswer}</div>
//                 </div>
//                 : null}
//             </div>
//           </div>
//         </div>
//         <div style={this.props.gameState === GameState.GAME_OVER ? {display: 'none'} : {display: 'block'}}>
//           <button className='hover-button' style={{marginTop: 15}} onClick={() => this.submitQuestion()}>Submit</button>
//         </div>
//       </div>
//     )
//   }
// }
// UnitConversionCanvas.propTypes = {
//   number: PropTypes.any,
//   unit: PropTypes.string,
//   gameState: PropTypes.string,
//   level: PropTypes.number,
//   nextQuestion: PropTypes.func,
//   gameOver: PropTypes.func
// }