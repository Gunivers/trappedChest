import { NextApiRequest, NextApiResponse } from 'next';
let AdmZip = require("adm-zip");

const itemListURL = "https://raw.githubusercontent.com/PixiGeko/Minecraft-generated-data/master/1.19/releases/1.19.2/data/registries/item.txt";

const licence = ""

type actionType = 'nothing' | 'function' | 'page';

interface itemType {
    id: string,
    count: number,
    action: {
        type: actionType,
        [k: string]: any,
    }
}

interface itemSelected { gui: string, pos: number };

export interface inventoryDataType {
    data: Array<inventoryType>;
    namespace: string;
    version: string;
}

export interface inventoryType {
    id: string,
    data: Array<itemType>,
    index: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") return res.status(405).json({ error: 'please use POST with body' })

    const data = JSON.parse(req.body) as inventoryDataType;

    let zip = new AdmZip();

    zip.addFile('pack.mcmeta', JSON.stringify({ pack: { pack_format: 10, description: "Generated by Trapped Chest from Gunivers !" } }))

    zip.addFile('data/minecraft/tags/functions/load.json', JSON.stringify({ values: [`${data.namespace}:load`] }))
    zip.addFile('data/minecraft/tags/functions/tick.json', JSON.stringify({ values: [`${data.namespace}:index`] }))

    let itemList = (await (await fetch(itemListURL)).text()).split('\n');

    zip.addFile(`data/${data.namespace}/tags/items/all.json`, JSON.stringify({ values: itemList }))
    zip.addFile(`data/${data.namespace}/functions/load.mcfunction`, `${licence}scoreboard objectives add ${data.namespace}.page dummy\nscoreboard objectives add ${data.namespace}.change dummy\nscoreboard objectives add ${data.namespace}.item dummy\nscoreboard objectives add ${data.namespace}.item2 dummy`)
    zip.addFile(`data/${data.namespace}/functions/test.mcfunction`, `${licence}execute store result score @s ${data.namespace}.item if data entity @s EnderItems[{}]\nexecute store result score @s ${data.namespace}.item2 if data entity @s EnderItems[{tag:{${data.namespace}:1}}]\nexecute unless score @s ${data.namespace}.item = @s ${data.namespace}.item2 run function ${data.namespace}:pages/clear`)

    zip.addFile(`data/${data.namespace}/functions/index.mcfunction`, `${licence}execute as @a run function ${data.namespace}:test\n${data.data.map((k, v) => `execute as @a[scores={${data.namespace}.page=${v}}] run function ${data.namespace}:pages/${v}/index`).join('\n')}\nclear @a #${data.namespace}:all{${data.namespace}:1}\nkill @e[nbt={Item:{tag:{${data.namespace}:1}}}]`)

    zip.addFile(`data/${data.namespace}/functions/pages/blank.mcfunction`, new Array(27).fill('').map((k, v) => `item replace entity @s enderchest.${v} with air`).join('\n'))
    zip.addFile(`data/${data.namespace}/functions/pages/clear.mcfunction`, new Array(27).fill('').map((k, v) => `item replace entity @s[nbt=!{EnderItems:[{tag:{${data.namespace}:1}, Slot:${v}b}]}] enderchest.${v} with air`).join('\n'))

    for (let i = 0; i < data.data.length; i++) {
        const inventory = data.data[i];
        if (inventory) {
            zip.addFile(`data/${data.namespace}/functions/pages/${i}/index.mcfunction`, inventory.data.map((k, v) => k ? `execute as @s[nbt=!{EnderItems:[{tag:{${data.namespace}.action:${v}}}]}, scores={${data.namespace}.change=0}] run function ${data.namespace}:pages/${i}/actions/${v}` : '').join('\n') + `\nexecute as @s[scores={${data.namespace}.page=${i}}] run function ${data.namespace}:pages/${i}/set`);
            zip.addFile(`data/${data.namespace}/functions/pages/${i}/set.mcfunction`, inventory.data.map((k, v) => k ? `item replace entity @s enderchest.${v} with ${k.id}{${data.namespace}:1, ${data.namespace}.action:${v}} ${k.count}`  : '').join('\n') + `\nscoreboard players set @s ${data.namespace}.change 0`);
            console.log(inventory);
            for (let j = 0; j < inventory.data.length; j++) {
                const item = inventory.data[j];
                
                if (item && item.action.type == 'page') {
                    zip.addFile(`data/${data.namespace}/functions/pages/${i}/actions/${j}.mcfunction`, `${licence}scoreboard players set @s ${data.namespace}.page ${item.action.page || 0}\nscoreboard players set @s ${data.namespace}.change 1\nfunction ${data.namespace}:pages/blank`)
                }

            }
        }
    }


    res.setHeader('Content-Type', 'application/zip')
    res.setHeader("Content-Disposition", "attachment; filename=" + 'trappedchest.zip')
    res.send(zip.toBuffer())
};