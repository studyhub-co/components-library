import React from 'react';

import { fabric } from 'fabric';

// TODO migrate to TypeScript
// TODO need more comments here, code is too hard to read

const GRID = 50;

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// This is the vector itself
// TODO rename to Vector!
export class CanvasVector {
  constructor(canvas, pointer, color) {
    this.canvas = canvas;
    color = color || 'red';
    const points = [Math.round(pointer.x / GRID) * GRID, Math.round(pointer.y / GRID) * GRID, pointer.x, pointer.y];

    this.startPointer = {
      x: pointer.x,
      y: pointer.y,
    };
    this.onCanvas = false;
    this.line = new fabric.Line(points, {
      strokeWidth: 5,
      fill: color,
      stroke: color,
      originX: 'center',
      originY: 'center',
    });

    const centerX = (this.line.x1 + this.line.x2) / 2;
    const centerY = (this.line.y1 + this.line.y2) / 2;
    this.deltaX = this.line.left - centerX;
    this.deltaY = this.line.top - centerY;

    this.triangle = new fabric.Triangle({
      left: this.line.get('x1') + this.deltaX,
      top: this.line.get('y1') + this.deltaY,
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      pointType: 'arrow_start',
      angle: 0,
      width: 20,
      height: 20,
      fill: color,
    });
    if (this.canvas) {
      this.canvas.add(this.line, this.triangle);
      this.drawing = true;
    }
  }

  calcArrowAngle(x1, y1, x2, y2) {
    let angle = 0;
    const x = x2 - x1;
    const y = y2 - y1;
    if (x === 0) {
      angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : (Math.PI * 3) / 2;
    } else if (y === 0) {
      angle = x > 0 ? 0 : Math.PI;
    } else {
      angle = x < 0 ? Math.atan(y / x) + Math.PI : y < 0 ? Math.atan(y / x) + 2 * Math.PI : Math.atan(y / x);
    }
    return (angle * 180) / Math.PI + 90;
  }

  draw(pointer) {
    if (this.drawing) {
      this.line.set({ x2: pointer.x, y2: pointer.y });
      this.triangle.set({
        left: pointer.x + this.deltaX,
        top: pointer.y + this.deltaY,
        angle: this.calcArrowAngle(this.line.x1, this.line.y1, this.line.x2, this.line.y2),
      });
      if (this.canvas) {
        this.canvas.renderAll();
      }
    }
  }

  complete(pointer) {
    this.drawing = false;
    const snappedxCoordinate = Math.round(pointer.x / GRID) * GRID;
    const snappedyCoordinate = Math.round(pointer.y / GRID) * GRID;
    const snappedxCoordinateArrowhead = Math.round((pointer.x + this.deltaX) / GRID) * GRID;
    const snappedyCoordinateArrowhead = Math.round((pointer.y + this.deltaY) / GRID) * GRID;

    this.endPointer = {
      x: snappedxCoordinate,
      y: snappedyCoordinate,
    };

    this.line.set({
      x2:
        snappedxCoordinate -
        4 *
          Math.sin(
            (this.calcArrowAngle(this.line.x1, this.line.y1, snappedxCoordinate, snappedyCoordinate) * Math.PI) / 180,
          ),
      y2:
        snappedyCoordinate +
        4 *
          Math.cos(
            (this.calcArrowAngle(this.line.x1, this.line.y1, snappedxCoordinate, snappedyCoordinate) * Math.PI) / 180,
          ),
    });
    this.triangle.set({
      left:
        snappedxCoordinateArrowhead -
        9 *
          Math.sin(
            (this.calcArrowAngle(this.line.x1, this.line.y1, snappedxCoordinate, snappedyCoordinate) * Math.PI) / 180,
          ),
      top:
        snappedyCoordinateArrowhead +
        9 *
          Math.cos(
            (this.calcArrowAngle(this.line.x1, this.line.y1, snappedxCoordinate, snappedyCoordinate) * Math.PI) / 180,
          ),
      angle: this.calcArrowAngle(this.line.x1, this.line.y1, snappedxCoordinate, snappedyCoordinate),
    });
    if (this.canvas) {
      if (this.getVectorMagnitude() === 0) {
        this.canvas.remove(this.line);
        this.triangle.set({
          left: snappedxCoordinateArrowhead,
          top: snappedyCoordinateArrowhead,
          angle: 0,
        });
      }
      this.canvas.renderAll();
    }
  }

  getVectorMagnitude() {
    return (
      Math.sqrt(
        Math.pow(Math.round((this.line.x2 - this.line.x1) / GRID) * GRID, 2) +
          Math.pow(Math.round((this.line.y2 - this.line.y1) / GRID) * GRID, 2),
      ) / GRID
    );
  }

  getVectorAngle() {
    let angle = this.calcArrowAngle(this.line.x1, this.line.y1, this.line.x2, this.line.y2);
    if (angle >= 360) {
      angle -= 360;
    }
    return angle;
  }

  calcPolarArrowAngle(x1, y1, x2, y2) {
    const x = x2 - x1;
    const y = y1 - y2;
    // Perform atan2 calculation as is inexpensive in comparison to atan
    // to find tangent of angle.
    return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
  }

  getPolarVectorAngle() {
    let angle = this.calcPolarArrowAngle(this.line.x1, this.line.y1, this.line.x2, this.line.y2);
    if (angle >= 360) {
      angle -= 360;
    }
    return angle;
  }

  getXComponent() {
    return Math.round((this.line.x2 - this.line.x1) / GRID);
  }

  getYComponent() {
    return Math.round((this.line.y1 - this.line.y2) / GRID);
  }

  addToCanvas(canvas) {
    this.canvas = canvas;
    if (this.startPointer && this.endPointer) {
      this.canvas.add(this.line, this.triangle);
      this.canvas.bringToFront(this.line, this.triangle);
    }
  }

  delete() {
    if (this.canvas) {
      this.canvas.remove(this.line, this.triangle);
    }
  }

  isOutOfBounds() {
    if (
      this.endPointer &&
      (this.endPointer.x > 300 || this.endPointer.x < 0 || this.endPointer.y > 300 || this.endPointer.y < 0)
    ) {
      return true;
    }
    return false;
  }
}

const canvasTextDefaults = {
  fontSize: 20,
  textAlign: 'center',
  lineHeight: 0.7,
  fontFamily: 'Helvetica',
  fill: 'green',
};

// TODO rename to Text
export class CanvasText {
  constructor(canvas, point, text, renderInfo) {
    renderInfo = renderInfo || {};
    const data = Object.assign({}, canvasTextDefaults, point, renderInfo);
    this.canvas = canvas;
    this.answerText = new fabric.Text(text, data);
    if (this.canvas) {
      this.canvas.add(this.answerText);
    }
  }

  addToCanvas(canvas) {
    this.canvas = canvas;
    this.canvas.add(this.answerText);
  }

  delete() {
    if (this.canvas) {
      this.canvas.remove(this.answerText);
    }
  }
}

// FIXME any reason we need NullVector on canvas if have NullVector checkbox?
export class NullVector {
  getXComponent() {
    return null;
  }

  getYComponent() {
    return null;
  }

  getVectorAngle() {
    return null;
  }

  getVectorMagnitude() {
    return null;
  }

  getPolarVectorAngle() {
    return null;
  }

  delete() {}
}

// class NullCheckbox extends React.Component {
//   onChange(event) {
//     this.props.onChange(event);
//   }
//
//   render() {
//     const divStyle = {};
//     const labelStyle = {};
//     let checked = this.props.checked;
//     if (this.props.isAnswer) {
//       divStyle['pointerEvents'] = 'none';
//       labelStyle['backgroundColor'] = 'rgb(127, 250, 127)';
//       checked = true;
//     } else if (this.props.isNotAnswer) {
//       divStyle['pointerEvents'] = 'none';
//       labelStyle['backgroundColor'] = 'red';
//       checked = true;
//     } else if (!this.props.allowInput || this.props.submitted) {
//       divStyle['pointerEvents'] = 'none';
//     }
//     return (
//       <div id="nullVector" className="checkbox" style={divStyle}>
//         <label id="highlightGreen" style={labelStyle}>
//           <input id="nullVectorCheckbox" type="checkbox" checked={checked} onChange={this.onChange.bind(this)} />
//           Null vector
//         </label>
//       </div>
//     );
//   }
// }

// This is the Grid canvas for CanvasVectors
export class VectorCanvas extends React.Component {
  // NOTE It might be better to store the arrow in state
  constructor(props) {
    super(props);
    this.objects = [];
    this.state = {
      isNullVector: false,
      submitted: false,
    };
    this.drawColor = 'red';
    this.fadedColor = '#ffcccc';
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas(this.props.canvasId, {
      selection: false,
      hasControls: false,
    });
    this.drawObjects();
    this.drawGrid();
    this.canvas.on('mouse:down', this.mouseDown.bind(this));
    this.canvas.on('mouse:move', this.mouseMove.bind(this));
    this.canvas.on('mouse:up', this.mouseUp.bind(this));

    this.fixCanvas();
  }

  componentDidUpdate() {
    const newState = {};
    if (this.props.clear && this.state.isNullVector) {
      newState.isNullVector = false;
    }
    if (this.state.submitted && this.props.clear) {
      newState.submitted = false;
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  // populate vector data in external component (e.g. external reducer)
  // the vectors will recreate with external data
  refreshAnswer() {
    // if (!this.props.question) {
    //   return;
    // }

    if (this.arrow) {
      if (this.arrow instanceof NullVector) {
        return;
      }
      // todo check if this.arrow is null vector
      this.props.updateAnswer({
        vector: {
          // angle: this.arrow.getVectorAngle(),
          angle: this.arrow.getPolarVectorAngle(),
          xComponent: this.arrow.getXComponent(),
          yComponent: this.arrow.getYComponent(),
          magnitude: this.arrow.getVectorMagnitude(),
        },
      });
      // this.props.updateAnswer([
      //   this.props.question.uuid,
      //   {
      //     vector: {
      //       xComponent: this.arrow.getXComponent(),
      //       yComponent: this.arrow.getYComponent(),
      //     },
      //   },
      // ]);
    }
  }

  drawGrid() {
    for (let i = 1; i < 600 / GRID; i++) {
      let line = new fabric.Line([i * GRID, 0, i * GRID, 600], {
        stroke: '#ccc',
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });
      this.canvas.add(line);
      this.canvas.sendToBack(line);
      line = new fabric.Line([0, i * GRID, 600, i * GRID], {
        stroke: '#ccc',
        hasControls: false,
        hasBorders: false,
        selectable: false,
      });
      this.canvas.add(line);
      this.canvas.sendToBack(line);
    }
  }

  mouseDown(o) {
    if (this.arrow) {
      // must be upper than setState (render() can change this.arrow - see below)
      this.arrow.delete();
      if (this.arrow instanceof NullVector) {
        this.setState({ isNullVector: false });
      }
    }
    this.arrow = new CanvasVector(this.canvas, this.canvas.getPointer(o.e), this.getColor());
  }

  mouseMove(o) {
    if (this.arrow && this.arrow instanceof CanvasVector) {
      this.arrow.draw(this.canvas.getPointer(o.e));
    }
  }

  mouseUp(o) {
    this.arrow.complete(this.canvas.getPointer(o.e));
    if (this.arrow.isOutOfBounds()) {
      this.arrow.delete();
      this.arrow = null;
    } else if (this.arrow.getYComponent() === 0 && this.arrow.getXComponent() === 0) {
      this.arrow.delete();
      this.arrow = new NullVector();
      // we can't check null vector answer here now - game wants check it immediately, component wants after check answer click
      // this.nullBoxCheck();
    } else if (this.props.onComplete) {
      this.props.onComplete(this.arrow);
    }
    this.refreshAnswer();
  }

  // nullBoxCheck(event) {
  //   const newState = !this.state.isNullVector;
  //   if (newState) {
  //     if (this.arrow) {
  //       this.arrow.delete();
  //     }
  //     this.arrow = new NullVector();
  //
  //     if (this.props.onComplete) {
  //       this.props.onComplete(this.arrow);
  //     }
  //   } else {
  //     if (this.arrow) {
  //       this.arrow.delete();
  //     }
  //     this.arrow = null;
  //   }
  //   this.setState({ isNullVector: newState });
  //   this.refreshAnswer();
  // }

  static calcVectorXStart(value) {
    if (value > 2) {
      return 2 * GRID;
    } else if (value < -2) {
      return 5 * GRID;
    } else {
      return 3 * GRID;
    }
  }

  static calcVectorYStart(value) {
    if (value > 2) {
      return 4 * GRID;
    } else if (value < -2) {
      return 1 * GRID;
    } else {
      return 3 * GRID;
    }
  }

  static calcCanvasMagnitude(value) {
    return value * GRID;
  }

  getColor() {
    if (this.props.fade) {
      return this.fadedColor;
    } else {
      return this.drawColor;
    }
  }

  drawObjects() {
    if (this.canvas && this.props.objects && this.props.objects.length) {
      const oldVectors = this.objects || [];
      this.objects = [];
      for (let i = 0; i < this.props.objects.length; i++) {
        this.props.objects[i].addToCanvas(this.canvas);
        this.objects.push(this.props.objects[i]);
      }
      for (let i = 0; i < oldVectors.length; i++) {
        oldVectors[i].delete();
      }
    }
  }

  // Waits till at least one canvas container is loaded onto the page.
  // Note that we are only going to have one. - up. we can have more than one now
  fixCanvas() {
    const noScroll = document.getElementsByClassName('canvas-container');
    for (let i = 0; i < noScroll.length; i++) {
      // fixme why we need this?
      noScroll[i].addEventListener(
        'touchmove',
        function(e) {
          e.preventDefault();
        },
        false,
      );
    }
  }

  render() {
    if (this.props.clear) {
      if (this.arrow) {
        this.arrow.delete();
      }
      // TODO: VERY VERY bad idea to change component property in render function
      this.arrow = null;
      for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].delete();
      }
      this.objects = [];
    }
    if (this.arrow && this.arrow instanceof CanvasVector) {
      const newArrow = new CanvasVector(this.canvas, this.arrow.startPointer, this.getColor());
      newArrow.complete(this.arrow.endPointer);
      this.arrow.delete();
      this.arrow = newArrow;
    }
    this.drawObjects();
    const canvasStyle = {
      border: '1px solid #ccc',
    };
    const wrapperStyle = {};

    if (!this.props.allowInput || this.state.submitted) {
      wrapperStyle['pointerEvents'] = 'none';
    }

    // let nullBox = '';
    // if (this.props.allowNull) {
    //   nullBox = (
    //     <NullCheckbox
    //       allowInput={this.props.allowInput}
    //       submitted={this.state.submitted}
    //       isAnswer={this.props.isNullAnswer}
    //       isNotAnswer={this.props.isNotNullAnswer}
    //       checked={this.state.isNullVector}
    //       onChange={this.nullBoxCheck.bind(this)}
    //     />
    //   );
    // }

    return (
      <div style={wrapperStyle}>
        <canvas id={this.props.canvasId} width="300" height="300" className="lower-canvas" style={canvasStyle} />
      </div>
    );
  }
}
