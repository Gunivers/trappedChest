"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { easyState, inspectorInputData } from "../lib/types";

export default function Inspector({ input: [data, setData]}: { input: easyState<inspectorInputData>}) {


    

    return (
        <div className="p-1 w-full h-full">
            <form className="flex flex-col w-full h-full">
                <label htmlFor="id">minecraft id</label>
                <input type="text" id="id" name="id" value={data.id} required onChange={e => setData((d) => ({ ...d, id: e.target.value}))} className="rounded border-blue-300 p-0.5 border-2 focus:ring-blue-400 focus:border-blue-400 focus:ring focus:outline-none focus:invalid:border-pink-500 focus:invalid:ring-pink-500 invalid:border-pink-500 invalid:text-pink-600" />
                
                <label htmlFor="count">count</label>
                <input type="number" id="count" name="count" value={data.count} min={1} max={64} step={1} required onChange={e => setData(d => ({ ...d, count: Number(e.target.value)}))} className="rounded border-blue-300 p-0.5 border-2 focus:ring-blue-400 focus:border-blue-400 focus:ring focus:outline-none focus:invalid:border-pink-500 focus:invalid:ring-pink-500 invalid:border-pink-500 invalid:text-pink-600" />
                
                <label htmlFor="nbt">nbt</label>
                <input type="text" id="nbt" name="nbt" value={data.nbt} placeholder={'{}'} pattern="\{.*\}" required onChange={e => setData(d => ({ ...d, nbt: e.target.value}))} className="rounded border-blue-300 p-0.5 border-2 focus:ring-blue-400 focus:border-blue-400 focus:ring focus:outline-none focus:invalid:border-pink-500 focus:invalid:ring-pink-500 invalid:border-pink-500 invalid:text-pink-600" />
            </form>
        </div>
    )
}