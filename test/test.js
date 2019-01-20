const EasyEvents = require('..');

class Test extends EasyEvents{
  constructor() {
    super();
  }
  click() {
    this.emit('event_on', '123', 'asdf');
  }
};

const test = new Test();
test.on('event_on', (val, val2) => {
  console.log(val, val2);
})
test.click();

