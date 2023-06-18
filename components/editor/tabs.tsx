"use client"
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { JsxElement } from "typescript";

export default function Tabs({ children, names, display, setDisplay, Tab }: React.PropsWithChildren<{ names: Array<string>, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>>, Tab?: ({ name, id, display, setDisplay }: { name: string, id: number, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>> }) => JSX.Element }>) {

    const childrenArray = React.Children.toArray(children);

    if (!display || !setDisplay) [display, setDisplay] = useState<number>(0);

    return (
        <div className="h-full w-full bg-blue-900 overscroll-contain p-2 overflow-auto rounded">
            <div className="text-xl border-b border-blue-500 flex gap-2 overflow-auto items-center snap-x">
                {names.map((n, i) =>
                    <div className="contents" key={i}>
                        {Tab ?
                            <Tab id={i} name={n} display={display} setDisplay={setDisplay} />
                            :
                            <p key={i} className={`${i == display ? 'bg-blue-700 p-1 rounded-t' : 'hover:bg-blue-600 hover:p-1 hover:rounded-t'} snap-center`} onClick={() => setDisplay && setDisplay(i)}>{n}</p>
                        }
                    </div>
                )}
            </div>
            {childrenArray[display]}
        </div>
    )
}

type sidesDrop = 'right' | 'bottom'

export function MovableTabs({ children, names, display, setDisplay, onDrop, onDropCorner, id }: React.PropsWithChildren<{ names: Array<string>, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>>, onDrop: (id: Array<number>, item: Array<number>) => void, onDropCorner?: (source: number[], target: number[], side: sidesDrop) => void, id: Array<number> }>) {

    const childrenArray = React.Children.toArray(children);

    if (!display || !setDisplay) [display, setDisplay] = useState<number>(0);

    useEffect(() => {
        if ((display || 0) >= childrenArray.length) {
            setDisplay && setDisplay(0);
        }
    }, [childrenArray])

    const [{ isOverTopRight }, dropTopRight] = useDrop(
        () => ({
            accept: 'tab',
            drop: (item) => { onDropCorner && onDropCorner(item as Array<number>, [...id], 'right'); console.log(item) },
            collect: monitor => ({
                isOverTopRight: !!monitor.isOver(),
            }),
        }),
        []
    )

    const [{ isOverBottomLeft }, dropBottomLeft] = useDrop(
        () => ({
            accept: 'tab',
            drop: (item) => { onDropCorner && onDropCorner(item as Array<number>, [...id], 'bottom'); },
            collect: monitor => ({
                isOverBottomLeft: !!monitor.isOver(),
            }),
        }),
        []
    )

    return (
        <div className="h-full w-full bg-blue-200 relative p-1">
            <div className="flex flex-col h-full w-full">
                <div className="text-lg border-b border-blue-600 flex items-center snap-x p-1">
                    {names.map((n, i) =>
                        <div className="contents" key={i}>
                            <TabDropZone id={[...id, i]} onDrop={onDrop} />
                            <TabTitlePanel n={n} id={[...id, i]} display={display} setDisplay={setDisplay} />
                        </div>
                    )}
                    <TabDropZone id={[...id, names.length + 1]} onDrop={onDrop} />
                </div>
                {/* <div ref={dropTopRight} className={`absolute top-0 right-0 w-1/4 h-1/4 ${isOverTopRight && onDropCorner ? `bg-black` : ``}`} /> */}
                <div className="overscroll-contain overflow-auto grow">
                    {childrenArray[display]}
                </div>
                {/* <div ref={dropBottomLeft} className={`absolute bottom-0 left-0 w-1/4 h-1/4 ${isOverBottomLeft && onDropCorner ? `bg-black` : ``}`} /> */}
            </div>
        </div>
    )
}

export function TabTitlePanel({ n, id, display, setDisplay }: { n: string, id: Array<number>, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>>, }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tab',
        item: id,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <>
            <p key={depthToId(id) + 'tab'} ref={drag} className={`${id[id.length - 1] == display ? 'bg-blue-500' : 'hover:bg-blue-400'} snap-center h-full rounded p-1`} onClick={() => setDisplay && setDisplay(id[id.length - 1])}>{n}</p>
            {/* <div key={i} ref={drop} className={`w-1 h-8 pr-1 ${isOver ? 'bg-black' : (false ? 'bg-blue-500' : '')}`} /> */}
        </>
    )
}

export function TabDropZone({ id, onDrop }: { id: Array<number>, onDrop: (id: Array<number>, item: Array<number>) => void, }) {

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'tab',
            drop: (item) => { onDrop(id, item as Array<number>) },
            collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        []
    )

    return (
        <div key={depthToId(id) + 'drop'} ref={drop} className={`w-1 h-8 pr-1 ${isOver ? 'bg-lime-500 w-2' : (false ? 'bg-blue-500' : '')}`} />
    )
}

const depthToId = (depth: Array<number>) => {
    return Number(depth.join(''));
}