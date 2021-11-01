/* eslint-disable import/no-anonymous-default-export */
import fs from 'fs'
import {resolve} from 'path'
let AdmZip = require("adm-zip");

export default function(req, res) {

  console.log(req.query)

  let path = `datapacks/release/${req.query.canal}-${req.query.version}`
  
  if(req.query.version == 'dev'){
    path = `datapacks/dev/${req.query.canal}`
  }

  console.log(path)

  let reqModules = req.query.modules.split('|')
  let datapack

  console.log(resolve(path + '/package.json'))

  try {
    datapack = JSON.parse(fs.readFileSync(resolve(path + '/package.json'), {encoding:'utf8'}))
      
  } catch (error) {
    console.log('package.json', error)
    return
  }

  let zip = new AdmZip();

  // fs.readdirSync(resolve(path)).forEach(file => {
  //   console
  //     // if (file.isDire)
  //     try {
  //       zip.addLocalFile(resolve(path + '/' + file))
  //     } catch (error) {
  //       console.log('file not found', error)
  //     }
  //   });

  for (let module of reqModules){
    if( !(datapack.modules.includes(module)) ){
      reqModules.splice(reqModules.indexOf(module), 1)
      continue
    }
    try {
      zip.addLocalFolder(resolve(path + '/data/' + module), '/data/' + module)
      console.log(resolve(path + '/data/' + module))
    } catch (error) {
      console.log('zip module', error)
      continue
    }
  }

  let zipName = `glib-${req.query.canal}-${req.query.version}-${reqModules.join('+')}.zip`


  // zip.writeZip(zipName, path.resolve('datapacks/downloads/'))
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader("Content-Disposition", "attachment; filename="+zipName)
  res.send(zip.toBuffer())
}