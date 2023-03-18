"use client"

import Image from 'next/image'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Editor from '../components/editor/editor'
import Panel from '../components/editor/panel'


interface tabInfoType {
  content: JSX.Element,
  name: string,
}

type grid = gridNode | gridPanel;

interface gridNode {
  type: 'node',
  axis: 'x' | 'y'
  content: Array<grid>
}

interface gridPanel {
  type: 'panel',
  content: Array<tabInfoType>
}

export default function Home() {

  const [nodes, setNodes] = useState<gridNode>(
    {
      type: 'node',
      axis: 'x',
      content: [
        {
          type: 'panel',
          content: [{ name: 'hello', content: <Panel add='ONE' /> }]
        },
        {
          type: 'node',
          axis: 'y',
          content: [
            {
              type: 'panel',
              content: [{ name: 'world', content: <Panel add='TWO' /> }]
            },
            {
              type: 'panel',
              content: [{ name: 'it\'s me', content: <Panel add='FREE' /> }]
            }
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