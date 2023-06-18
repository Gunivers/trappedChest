"use client"

import { Dispatch, SetStateAction } from "react";
import { gridNode, grid } from "../../lib/types";
import Resizable from "./resizable";
import { MovableTabs } from "./tabs";

export default function Editor({ nodes, setNodes}: {nodes: gridNode, setNodes: Dispatch<SetStateAction<gridNode>>}) {


  const handleDrop = (dest: Array<number>, source: Array<number>) => {
    const newNodes = Object.assign({}, nodes) as gridNode;

    //console.log(`From ${source} to ${dest}`)

    let getObject: any = newNodes;
    for (let i = 0; i < source.length - 1; i++) {
      getObject = getObject.content[source[i]];
    }

    const sourceObject = { ...getObject.content[source[source.length - 1]] }
    getObject.content.splice(source[source.length - 1], 1)
    console.log(getObject)

    getObject = nodes;
    for (let i = 0; i < dest.length - 1; i++) {
      getObject = getObject.content[dest[i]];
    }
    getObject.content.splice(dest[dest.length - 1], 0, sourceObject)

    setNodes(newNodes);
  }


  return (
    <main className="h-screen w-screen">

      <NodeGen nodes={nodes} depth={[]} handleDrop={handleDrop}/>

    </main>
  )
}

function NodeGen({ nodes, depth, handleDrop }: { nodes: grid, depth: Array<number>, handleDrop: (id: number[], item: number[]) => void}) {

  if (nodes.type == "panel") {

    return (
      <>
        <MovableTabs names={nodes.content.map(t => t.name)}
          onDrop={handleDrop}
          id={depth}
          key={depthToId(depth) * 10}
        >
          {nodes.content.map((t, i) => <div className="contents" key={i}>{t.content}</div>)}
        </MovableTabs>

      </>)

  } else if (nodes.type == "node") {
    //nodes = nodes as gridNode;
    return (
      <Resizable axis={nodes.axis} defaultSizes={nodes.content.map(n => n.size)}>
        {nodes.content.map((n, index) =>
            <NodeGen nodes={n} depth={[...depth, index]} key={depthToId([...depth, index])} handleDrop={handleDrop}/>
        )}
      </Resizable>
    )
  }

  return (<>Error</>)
}

const depthToId = (depth: Array<number>) => {
  return Number(depth.join(''));
}
