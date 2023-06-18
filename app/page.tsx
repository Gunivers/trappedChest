"use client"

import Image from 'next/image'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Editor from '../components/editor/editor'
import Panel from '../components/editor/panel'
import Inspector from '../components/inspector'
import InventoryDisplay from '../components/inventoryDisplay'
import { gridNode, inspectorInputData, inventoryData } from '../lib/types'


export default function Home() {

  const [inspectorData, setInspectorData] = useState<inspectorInputData>({ id: 'minecraft:stone', count: 1, nbt: '{}' });

  const [inventoryData, setInventoryData] = useState<inventoryData>([{ id: 'minecraft:stone', count: 1, nbt: '{}' }]);

  const [selected, setSelected] = useState<number>(-1);

  const handleSelected = (id: number) => {
    
    console.log(id);
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
          type: 'node',
          axis: 'x',
          size: 80,
          content: [
            {
              type: 'panel',
              size: 20,
              content: [{ name: 'world', content: <Panel add='TWO' /> }, { name: 'it\'s me', content: <Panel add='FREE' /> }]
            },
            {
              type: 'panel',
              size: 60,
              content: [{ name: 'current page', content: <InventoryDisplay input={inventoryData} selected={[selected, handleSelected]} /> }]
              // content: [{ name: 'current page', content: <div onClick={e => handleSelected(1)}>{selected}</div> }]
            },
            {
              type: 'panel',
              size: 20,
              content: [{ name: 'item', content: <Inspector input={[inspectorData, setInspectorData]} /> }]
            },
          ]
        },
        {
          type: 'node',
          axis: 'x',
          size: 20,
          content: [
            {
              type: 'panel',
              size: 20,
              content: [{ name: 'hello', content: <Panel add='ONE' /> }]
            },
            {
              type: 'panel',
              size: 80,
              content: [{ name: 'hello', content: <Panel add='ONE' /> }]
            },
          ]
        }

      ]
    }
  );

  return (
    <main className="h-screen w-screen">
      <DndProvider backend={HTML5Backend}>
        <Editor nodes={nodes} setNodes={setNodes} />
      </DndProvider>
    </main>
  )
}