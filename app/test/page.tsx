"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Editor from "../../components/editor/editor";
import Inspector from "../../components/inspector";
import InventoryDisplay from '../../components/inventoryDisplay'
import { gridNode, inventoryData } from '../../lib/types'


export default function Page() {

    const [inventoryData, setInventoryData] = useState<inventoryData>([{ id: 'minecraft:stone', count: 1, nbt: '{}' }]);

    const [selected, setSelected] = useState<number>(-1);

    const handleSelected = (id: number) => {

        setSelected(i => id)


        // setInventoryData(d => d);

        console.log(selected);
        // setSelected(id);
        // console.log(selected);
    };

    const [nodes, setNodes] = useState<gridNode>(
        {
            type: 'node',
            axis: 'y',
            size: 100,
            content: [
                {
                    type: 'panel',
                    size: 100,
                    content: [{ name: 'world', content: <InventoryDisplay input={inventoryData} selected={[selected, handleSelected]} /> }]
                },
            ]
        }
    )



    return (
        <main className="h-screen w-screen">
            <DndProvider backend={HTML5Backend}>
                { selected && <Editor nodes={nodes} setNodes={setNodes} />}
            </DndProvider>
        </main>
    )
}