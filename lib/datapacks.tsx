import axios from "axios";
import fs from "fs"
import path from 'path';

interface DatapackVersion {
    canal?: string | null,
    version?: string | null,
    type?: 'dev' | 'release' | null,
    commit: string,
    modules?: string[] | null
}

function getPackage(folder: string): DatapackVersion | void {
    let commitSha: string
    try {
        commitSha = fs.readFileSync(path.resolve('datapacks/' + folder + '/available.txt'), { encoding: 'utf8' })
    } catch (e) {
        return
    }

    let versionRaw
    try {
        versionRaw = fs.readFileSync(path.resolve('datapacks/' + folder + '/package.json'), { encoding: 'utf8' })

    } catch (error) {
        let datapack: DatapackVersion = {
            canal: null,
            type: null,
            version: null,
            commit: commitSha,
        }

        if (folder.startsWith('dev/')) {
            datapack.canal = folder.split('/')[1]
            datapack.type = 'dev'
            datapack.version = 'dev'
        } else if (folder.startsWith('release/')) {
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

        if (modules.indexOf('minecraft') > -1) {
            modules.splice(modules.indexOf('minecraft'), 1);
        }

        datapack.modules = modules

        try {
            fs.writeFileSync(path.resolve('datapacks/' + folder + '/package.json'), JSON.stringify(datapack));
            return datapack
        } catch (error) {
            return
        }
    }
    return JSON.parse(versionRaw)

}

function getDatapacks(folder: string): DatapackVersion[] {
    const devs = fs.readdirSync(path.resolve('datapacks/' + folder), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let versions: DatapackVersion[] = []

    for (let dev of devs) {

        let datapack: DatapackVersion | void = getPackage(folder + '/' + dev)

        if (datapack) {
            versions.push(datapack)
        }

    }

    versions.sort().reverse()

    return versions
}

export function getDevs() {

    const canals = fs.readdirSync(path.resolve('datapacks/dev'), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let versions: DatapackVersion[] = []

    for (let canal of canals) {

        let latest: string

        try {
            latest = fs.readFileSync(path.resolve('datapacks/dev/' + canal + '/latest.txt'), { encoding: 'utf8' })
        } catch (e) {
            continue
        }

        // console.log(latest)

        let datapack: DatapackVersion | void = getPackage(`dev/${canal}/${latest}`)


        if (datapack) {
            versions.push(datapack)
        }

    }

    return versions
}

interface Canal {
    canal: string,
    versions: DatapackVersion[]
}

interface IDictionary {
    [index: string]: Canal;
}

export function getReleases(): IDictionary {

    let canals = {} as IDictionary;

    getDatapacks('release').forEach((release: DatapackVersion) => {
        if (release.canal) {
            if (!canals[release.canal]) {
                canals[release.canal] = {
                    canal: release.canal,
                    versions: []
                }
            }
            canals[release.canal].versions.push(release)
        } else {
            if (!canals['other']) {
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

export async function getContributors() {

    interface EmailAvatar {
        [index: string]: string;
    }

    const contributorsFile = 'datapacks/contributors.json'
    let contributors = {} as EmailAvatar
    try {
        let contributorsRaw = fs.readFileSync(path.resolve(contributorsFile), { encoding: 'utf8' })
        contributors = JSON.parse(contributorsRaw)
    } catch (e) {
        try {
            let avatars = {} as EmailAvatar
            let emails: string[] | undefined = process.env.CONTRIBUTORS?.split(';')
            if (emails) {
                for (const email of emails) {
                    await axios.get(`https://gitlab.com/api/v4/avatar?email=${email}&size=64`)
                        .then(response => {
                            avatars[email] = response.data.avatar_url;
                        })
                }
                fs.writeFileSync(path.resolve(contributorsFile), JSON.stringify(avatars));
                contributors = avatars;
            }

        } catch (error) {
            contributors = {}
        }
    }
    return contributors
}

export async function getGlib() {

    return { devs: getDevs(), releases: getReleases(), contributors: await getContributors() }
}