import fs from "fs"
import path from 'path';

interface DatapackVersion{
    canal? :string|null,
    version? :string|null,
    type?: 'dev'|'release'|null,
    modules?: string[]|null
}

export function getCanals(){
    let source = 'D:/Theo/Documents/Codage/glib-manager/datapacks/latest/'
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

function getPackage(folder :string): DatapackVersion|void{
    if(fs.existsSync( path.resolve('datapacks/' + folder))){
        let versionRaw
        try {
            versionRaw = fs.readFileSync(path.resolve('datapacks/' + folder + '/package.json'), {encoding:'utf8'})
            
        } catch (error) {
            let datapack: DatapackVersion = {
                canal: null,
                type: null,
                version: null
            }
        
            if(folder.startsWith('dev/')){
                datapack.canal = folder.slice(folder.split('/')[0].length + 1)
                datapack.type = 'dev'
                datapack.version = 'dev'
            } else if (folder.startsWith('release/')){
                let releaseName = folder.slice(folder.split('/')[0].length + 1)
                datapack.canal = releaseName.split('-')[0]
                datapack.version = releaseName.slice(datapack.canal.length + 1)
                datapack.type = 'release'
            }

            let modules = []

            try {
                modules = fs.readdirSync(path.resolve('datapacks/' + folder + '/data'), { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name)
            } catch (error) {
                return
            }

            datapack.modules = modules
       
            try {
                fs.writeFileSync( path.resolve('datapacks/' + folder + '/package.json'), JSON.stringify(datapack) );
                return datapack
            } catch (error) {
                return
            }
        }
        return JSON.parse(versionRaw)
    }
    
}

function getDatapacks(folder :string): DatapackVersion[]{
    const devs = fs.readdirSync( path.resolve('datapacks/' + folder), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let versions: DatapackVersion[] = []

        for (let dev of devs){

            let datapack: DatapackVersion|void = getPackage(folder + '/' + dev)

            if(datapack){
                versions.push(datapack)
            }
            
        }

    return versions
}

export function getDevs(){

    return getDatapacks('dev')
}

interface Canal {
    canal: string,
    versions: DatapackVersion[]
}

interface IDictionary {
    [index: string]: Canal;
}

export function getReleases(): IDictionary{

    let canals = {} as IDictionary;

    getDatapacks('release').forEach((release: DatapackVersion) => {
        if (release.canal){
            if(!canals[release.canal]){
                canals[release.canal] = {
                    canal: release.canal,
                    versions: []
                }
            }
            canals[release.canal].versions.push(release)
        } else{
            if(!canals['other']){
                canals['other'] = {
                    canal: 'other',
                    versions: []
                }
            }
            canals['other'].versions.push(release)
        }
        
    })

    return canals
}

export function getGlib(){
    return {devs: getDevs(), releases: getReleases()}
}