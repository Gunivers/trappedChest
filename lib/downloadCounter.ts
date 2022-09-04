import { readFile, writeFileSync } from 'fs'


export async function getDownloadNumber():Promise<number> {
    return new Promise(resolve => {
        const file = readFile('./.save', 'utf8', ((err, data) => {
            if (!err) {
                resolve(parseInt(data))
            } else {
                writeFile(1)
                resolve(1)
            }
        }))
    })
    //console.log(file)
}

export async function addDownloadNumber() {
    writeFile(await getDownloadNumber() + 1)
}

function writeFile(int: number) {
    writeFileSync('./.save', int.toString())
}