/* eslint-disable import/no-anonymous-default-export */
import fs from 'fs'
import { resolve } from 'path'
import { addDownloadNumber } from '../../../../../../lib/downloadCounter'
let AdmZip = require("adm-zip");

export default function (req: any, res: any) {

  // console.log(req.query)

  let path = `datapacks/release/${req.query.canal}-${req.query.version}`

  if (req.query.version == 'dev') {
    path = `datapacks/dev/${req.query.canal}`
  }

  // console.log(path)

  let reqModules = req.query.modules.split('|')
  let datapack

  // console.log(resolve(path + '/package.json'))

  try {
    datapack = JSON.parse(fs.readFileSync(resolve(path + '/package.json'), { encoding: 'utf8' }))

  } catch (error) {
    // console.log('package.json', error)
    return
  }

  let zip = new AdmZip();

  ['icon.png', 'pack.mcmeta', 'LICENSE'].forEach(file => {
    try {
      zip.addLocalFile(resolve(path + '/' + file))
    } catch (error) {
      return
    }
  });

  zip.addLocalFolder(resolve(path + '/data/minecraft'), '/data/minecraft')

  for (let module of reqModules) {
    if (!(datapack.modules.includes(module))) {
      reqModules.splice(reqModules.indexOf(module), 1)
      continue
    }
    try {
      zip.addLocalFolder(resolve(path + '/data/' + module), '/data/' + module)
      // console.log(resolve(path + '/data/' + module))
    } catch (error) {
      // console.log('zip module', error)
      continue
    }
  }

  //let zipName = `glib-${req.query.canal}-${req.query.version}-${reqModules.join('+')}.zip`
  let zipName = reqModules.length == 1 ? `Glibs-${reqModules[0]}.zip` : `Glibs-${req.query.canal}.zip`


  // zip.writeZip(zipName, path.resolve('datapacks/downloads/'))
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader("Content-Disposition", "attachment; filename=" + zipName)
  res.send(zip.toBuffer())
  addDownloadNumber();
}