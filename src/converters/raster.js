import GcodeDoc from 'gcode-utils-document'

var paper = require('paper');
var canvas = new paper.Canvas(26, 26);
paper.setup(canvas);

function preamble(input,options){
  let feedRate = options.feed || 3000;
  return `G21 G90\nG1 F${feedRate}\n`
}

function postamble(input,options){
  return ';end'
}

// Not compatible with alpha, move to binary color scheme
function getIntensity(raster,x,y){
  let color = raster.getPixel(x, y)
  let on = color.gray > 0.1 ? 0 : 1
  return on;
}

function convertRaster(raster,options){
  let direction = 1;
  let height = raster.height
  let width = raster.width
  let doc = new GcodeDoc();
  doc.setRelativePositioning()

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      let intensity = getIntensity(raster,x,y)
      let xOffset = direction * options.toolDiameter
      if(intensity > 0){
        doc.spindleOn(intensity)
        doc.linearX(xOffset)
        doc.spindleOff()
      } else {
        doc.linearX(xOffset)
      }
    }

    //Reverse direction after each row
    direction = -direction

    //Go to next row
    doc.linearY(-options.toolDiameter)
  }
  return doc
}

export default function convert(input,options={},callback){
  options.toolDiameter = options.toolDiameter || 0.15
  var raster = new paper.Raster(input);
  raster.onLoad = () => {
    let doc = convertRaster(raster,options)

    doc
      .prepend(preamble(input,options))
      .append(postamble(input,options))

    console.log(doc)
    callback(null, doc)
  }
}
