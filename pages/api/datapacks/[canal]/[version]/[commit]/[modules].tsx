/* eslint-disable import/no-anonymous-default-export */
import fs from 'fs'
import { resolve } from 'path'
import { addDownloadNumber } from '../../../../../../lib/downloadCounter'
let AdmZip = require("adm-zip");

export default function (req: any, res: any) {

  // console.log(req.query)

  let basePath = "";




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

  if (req.query.world === 'true') {
    basePath = "datapacks/"
    let pathW = `worlds/release/${req.query.canal}-${req.query.version}`

    if (req.query.version == 'dev') {
      pathW = `worlds/dev/${req.query.canal}`;
    }

    zip.addLocalFolder(resolve(pathW + '/region'), 'region/');

    ['icon.png', 'level.dat'].forEach(file => {
      try {
        zip.addLocalFile(resolve(pathW + '/' + file))
      } catch (error) {
        return
      }
    });
  }

  ['icon.png', 'pack.mcmeta', 'LICENSE'].forEach(file => {
    try {
      zip.addLocalFile(resolve(path + '/' + file), basePath)
    } catch (error) {
      return
    }
  });

  zip.addLocalFolder(resolve(path + '/data/minecraft'), basePath + '/data/minecraft')

  for (let module of reqModules) {
    if (!(datapack.modules.includes(module))) {
      reqModules.splice(reqModules.indexOf(module), 1)
      continue
    }
    try {
      zip.addLocalFolder(resolve(path + '/data/' + module), basePath + '/data/' + module)
      // console.log(resolve(path + '/data/' + module))
    } catch (error) {
      // console.log('zip module', error)
      continue
    }
  }
  //let zipName = `glib-${req.query.canal}-${req.query.version}-${reqModules.join('+')}.zip`
  let zipName = `Glibs-Out.zip`


  // zip.writeZip(zipName, path.resolve('datapacks/downloads/'))
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader("Content-Disposition", "attachment; filename=" + zipName)
  res.send(zip.toBuffer())
  addDownloadNumber();
}

export const config = {
  api: {
    responseLimit: false,
  },
}