import type { Dispatch, SetStateAction } from "react";

export type easyState<T> = [T, Dispatch<SetStateAction<T>>]
export type easyHandler<T> = [T, (i:T) => void]

//==========================================

export type inventoryData = itemData[]

export interface itemData {
    id: string,
    count: number,
    nbt: string,
}

export interface inspectorInputData {
    id: string,
    count: number,
    nbt: string,
}




// ===============================================



export interface tabInfoType {
    content: JSX.Element,
    name: string,
}

export type grid = gridNode | gridPanel;

export interface gridNode {
    type: 'node',
    axis: 'x' | 'y'
    content: Array<grid>
    size: number
}

export interface gridPanel {
    type: 'panel',
    content: Array<tabInfoType>
    size: number
}
