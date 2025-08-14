// @ts-check

/**
 * Implement the classes etc. that are needed to solve the
 * exercise in this file. Do not forget to export the entities
 * you defined so they are available for the tests.
 */

export function Size(width=80, height=60) {
  this.width = width;
  this.height = height;
}

Size.prototype.resize = function (newWidth, newHeight) {
  this.width = newWidth;
  this.height = newHeight;
}

export function Position(x=0, y=0) {
  this.x = x;
  this.y = y;
}

Position.prototype.move = function (x, y){
  this.x = x;
  this.y = y;
}

export class ProgramWindow {
  constructor() {
    this.screenSize = new Size(800, 600);
    this.size = new Size();
    this.position = new Position();
  }

  resize(size) {
    const maxWidth = this.screenSize.width -  this.position.x;
    const maxHeight = this.screenSize.height -  this.position.y;

    if (size.width > maxWidth) {
      size.width = maxWidth;
    }
    if (size.height > maxHeight) {
      size.height = maxHeight;
    }
    if(size.width < 1){
      size.width = 1;
    }
    if (size.height < 1){
      size.height = 1;
    }

    this.size.resize(size.width, size.height);
  }

  move(position){
    if (position.x<0) {
      position.x = 0;
    }
    if (position.y<0) {
      position.y = 0;
    }
    const maxX = this.screenSize.width - this.size.width;
    const maxY = this.screenSize.height - this.size.height;

    if (position.x > maxX) {
      position.x = maxX;
    }
    if (position.y > maxY) {
      position.y = maxY;
    }
    this.position.move(position.x, position.y)
  }
}

export function changeWindow(programWindow) {
  const newSize = new Size(400,300)
  programWindow.resize(newSize);
  const newPosition = new Position(100, 150)
  programWindow.move(newPosition);
  return programWindow
}