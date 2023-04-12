"use client"

import { easyHandler, easyState, inventoryData } from "../lib/types";
import Inventory from "./trapped/inventory";

export default function InventoryDisplay({ input: data, selected: [selected, setSelected] }: { input: inventoryData, selected: easyHandler<number> }) {


    return (
        <div className="h-full w-full">
            <div className="flex justify-center items-center h-full">
                <Inventory input={data} selected={[selected, setSelected]} />
            </div>
        </div>
    )
}