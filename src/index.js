import RasterConvertor from './converters/raster'
import VectorConvertor from './converters/vector'
import fileExtension from 'file-extension'

export default function convert(input, options, callback){
  let fileType = options.fileType || fileExtension(input)

  switch(fileType) {
    //Raster
    case 'raster':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      RasterConvertor(input, options, callback)
      break;
    //Vector
    case 'vector':
    case 'svg':
    case 'dxf':
    case 'stl':
      VectorConvertor(input, options, callback)
      break;
    default:
      console.log('Unsupported file type:', fileType)
  }
}
