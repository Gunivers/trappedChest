"use client"

import Image from "next/image";
import { easyHandler, easyState, inventoryData } from "../../lib/types";


export default function Inventory({ input: data, selected: [selected, setSelected]  }: { input: inventoryData, selected: easyHandler<number> }) {

    //const inv:0[][] = new Array(9).fill(new Array(3).fill(0));

    const inv = [...data, ...new Array(27 - data.length)].map(d => d ? d : { id: 'minecraft:air', count: 0, nbt: '{}' })
    //console.log(inv);

    return (
        <div className="bg-gray-200 rounded grid grid-cols-9 gap-1 p-5 w-fit border border-black">
            {inv.map((d, i) =>
                <button key={i} className={`h-14 w-14 bg-gray-400 border border-black shadow-inner hover:bg-gray-500 focus:bg-gray-600 ${selected == i ? 'bg-gray-600' :''}`} onClick={e => {setSelected(i)}}>
                    {d.id != 'minecraft:air' && <Image width={1} height={1} src={`/images/items/${d.id.replace(':', '__')}.png`} alt='image' sizes="3.5rem" style={{imageRendering: 'crisp-edges', width: '3.5rem', height: '3.5rem'}}/>}
                </button>
            )}
        </div>
    )
}