import GcodeDoc from 'gcode-utils-document'

function GCodeDriver(stream) {
  let doc = new GcodeDoc
  this.stream = stream || {
    write: function(str) {
      doc.append(str)
    }
  };
  this.getDoc = () => {
    return doc
  }
}

GCodeDriver.prototype = {
  send: function(code, params) {
    var command = code;

    if(!command) return;

    if(params) {
      'xyzabcijkf'.split('').forEach(function(k) {
        if(params[k] === undefined || params[k] === null)
          return;

        command += ' ' + k.toUpperCase() + params[k];
      });
    }

    this.stream.write(command);
  }
, init: function() {
    // this.send('G90'); // Absolute mode
  }
, unit: function(name) {
    name = name.toLowerCase();
    this.send({'inch':'G20','mm':'G21'}[name]);
  }
, speed: function(n) {
    this.send('S'+n);
  }
, feed: function(n) {
    this.send('F'+n);
  }
, coolant: function(type) {
    if(type === 'mist') {
      // special
      this.send('M07');
    }
    else if(type) {
      // flood
      this.send('M08');
    }
    else {
      // off
      this.send('M09');
    }
  }
, zero: function(params) {
    this.send('G28.3', params);
  }
, atc: function(id) {
    this.send('M6', {T: id});
  }
, rapid: function(params) {
    this.send('G0', params);
  }
, linear: function(params) {
    this.send('M3')
    this.send('G1', params);
    this.send('M5')
  }
, arcCW: function(params) {
    this.send('M3')
    this.send('G2', params);
    this.send('M5')
  }
, arcCCW: function(params) {
    this.send('M3')
    this.send('G3', params);
    this.send('M5')
  }
, meta: function(params) {
    var comment = '(';
    for(var k in params) {
      comment += k+'='+params[k];
    }
    comment += ')';

    this.send(comment);
  }
};

module.exports = GCodeDriver;
