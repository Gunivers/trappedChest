import { readFile, writeFileSync } from 'fs'


export async function getItemsList():Promise<Array<string>> {
    console.log('2')

    return new Promise(resolve => {
        console.log('1')

        const file = readFile('./public/items.txt', 'utf8', ((err, data) => {
            if (!err) {
                console.log('returned')

                return data.split('\n').slice(1);
            } else {
                console.log('error')
            }
        }))
    })
}