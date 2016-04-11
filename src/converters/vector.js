import canvg from 'canvg'
import gcanvas from 'gcanvas'
// import gcanvas from '../../gcanvas'
import fs from 'fs'
import LaserDriver from './gcanvas-laser-driver'
let laserDriver = new LaserDriver
// var gctx = new gcanvas()
var gctx = new gcanvas(laserDriver)

function preamble(input,options){
  let feedRate = options.feed || 3000;
  return `G21\n F${feedRate}\n`
}

function postamble(input,options){
  return `G0 X0 Y0`
}

gctx.toolDiameter = 0.2

gctx.fill = function(windingRule, depth) {
  gctx.save()
  gctx.strokeStyle = gctx.fillStyle
  gctx.stroke('outer', depth)
  gctx.restore()
}

//Mirrored Y in gcanvas workaround
gctx.map('x-yz');

// Correctly mirror in positive y-axis
// let minimum = getMinumum(doc)
// doc.filter(function(p) {
//   // flip_y_moves
//   p.y = -p.y
      //rerange_y
//   y = y - minimum
// });

export default function convert(input, options, callback){
  var svg = ''+fs.readFileSync(input)
  canvg(gctx.canvas, svg)

  let doc = gctx.driver.getDoc()

  doc
      .prepend(preamble(input,options))
      .append(postamble(input,options))

  callback(null, doc)
}
