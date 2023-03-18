"use client"

import React from "react";
import { createRef, useEffect, useState } from "react";
//import Split from "./react-split/index.js";
import Split from "react-split";
//import ResizePanel from "react-resize-panel";
//import SplitPane, { Pane } from 'split-pane-react';
//import { JsxElement } from "typescript";

interface PanelsType { width: number | undefined, separatorXPosition: number | undefined, dragging: boolean }

export default function Resizable({ axis = 'x', children }: React.PropsWithChildren<{ axis?: 'x' | 'y' }>) {

    const childrenArray = React.Children.toArray(children);

    const [sizes, setSizes] = useState([...childrenArray.map( c => 100)]);

    const direction = axis == 'x' ? 'horizontal' : 'vertical'

    return (
        <>
            <Split
            className={`h-full w-full ${axis == 'x' ? 'flex flex-row' : ''}`}
            minSize={0}
            snapOffset={0}
            direction={axis == 'x' ? 'horizontal' : 'vertical'}
            gutter={(index, direction) => {
                const gutter = document.createElement('div')
                gutter.className = `gutter gutter-${direction} cursor-${axis == 'x' ? 'col' : 'row'}-resize`
                return gutter
            }}
        >
            {children}
        </Split>
        </>

    )
}