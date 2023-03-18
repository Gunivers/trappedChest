"use client"
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { JsxElement } from "typescript";

export default function Tabs({ children, names, display, setDisplay, Tab }: React.PropsWithChildren<{ names: Array<string>, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>>, Tab?: ({ name, id, display, setDisplay }: { name: string, id: number, display?: number, setDisplay?: React.Dispatch<React.SetStateAction<number>> }) => JSX.Element }>) {

    const childrenArray = React.Children.toArray(children);

    if (!display || !setDisplay) [display, setDisplay] = useState<number>(0);

    return (
        <div className="h-full w-full bg-slate-500 overscroll-contain p-2 overflow-auto rounded">
            <div className="text-xl border-b border-slate-600 flex gap-2 overflow-auto items-center snap-x">
                {names.map((n, i) =>
                    <>
                        {Tab ?
                            <Tab id={i} name={n} display={display} setDisplay={setDisplay} />
                            :
                            <p key={i} className={`${i == display ? 'bg-slate-700 p-1 rounded-t' : 'hover:bg-slate-600 hover:p-1 hover:rounded-t'} snap-center`} onClick={() => setDisplay && setDisplay(i)}>{n}</p>
                        }
                    </>
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
            drop: (item) => { onDropCorner && onDropCorner(item as Array<number>, [...id], 'right'); console.log(item)},
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
        <div className="h-full w-full bg-slate-500 p-2 rounded relative">
            <div className="text-xl border-b border-slate-600 flex items-center snap-x">
                {names.map((n, i) =>
                    <>
                        <TabDropZone id={[...id, i]} onDrop={onDrop} />
                        <TabTitlePanel n={n} id={[...id, i]} display={display} setDisplay={setDisplay} />
                    </>
                )}
                <TabDropZone id={[...id, names.length + 1]} onDrop={onDrop} />
            </div>
            <div ref={dropTopRight} className={`absolute top-0 right-0 w-1/4 h-1/4 ${isOverTopRight && onDropCorner ? `bg-black` : ``}`} />
            <div className="">
                {childrenArray[display]}
            </div>
            <div ref={dropBottomLeft} className={`absolute bottom-0 left-0 w-1/4 h-1/4 ${isOverBottomLeft && onDropCorner ? `bg-black` : ``}`} />
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
            <p key={depthToId(id) + 'tab'} ref={drag} className={`${id[id.length - 1] == display ? 'bg-slate-700 p-1 rounded-t' : 'hover:bg-slate-600 hover:py-1 hover:rounded-t'} snap-center`} onClick={() => setDisplay && setDisplay(id[id.length - 1])}>{n}</p>
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
        <div key={depthToId(id) + 'drop'} ref={drop} className={`w-1 h-8 pr-1 ${isOver ? 'bg-black' : (false ? 'bg-blue-500' : '')}`} />
    )
}

const depthToId = (depth: Array<number>) => {
    return Number(depth.join(''));
}