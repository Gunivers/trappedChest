'use client'

import { createRef, ReactNode, Ref, RefObject, useEffect, useState } from "react"

interface sideType {
    node: ReactNode;
    size?: string | number;
    arbitrary?: boolean,
    ref?: RefObject<HTMLDivElement>
}

export default function ResizableGrid({ children, separation, axis = 'x' }: React.PropsWithChildren<{ separation: number, axis?: 'x' | 'y' }>) {

    const [nodes, setNodes] = useState<Array<sideType>>([]);

    useEffect(() => {

        const initialNodes = [];

        for (let i = 0; i < separation; i++) {
            // let ref = nodes[i]?.ref;;

            // if (!ref) {
            //     ref = createRef<HTMLDivElement>()
            // }

            // let width = undefined;
            // let arbitrary = nodes[i]?.arbitrary;
            // if (ref.current) {
            //     if (!arbitrary) {
            //         width = ref.current?.clientWidth;
            //         ref.current.style.width = `${width}px`;
            //         arbitrary = true;
            //     }
            // }



            //@ts-ignore
            initialNodes.push({ node: children[i] || (<></>), /*size: width, ref: ref, arbitrary: arbitrary*/ });
        }

        setNodes(initialNodes);
    }, [children, separation, nodes, setNodes])





    return (
        <div className={`flex gap-1 flex-${axis == 'x' ? 'row' : 'col'} h-full w-full`}>

            {nodes.map((side, i) => (
                    <div className={`basis-${side.arbitrary ? `[${side.size}]` : `1/${separation}`}`} key={i}>
                        {side.node}
                    </div>
            ))}

        </div>
    )
}