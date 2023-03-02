
export interface filterAutoCompleteType {
    inputValue?: string;
    id: string;
}

export type actionType = 'nothing' | 'function' | 'page';

export interface itemType {
    id: string,
    count: number,
    action: actionObjectType,
    modifiers?: Array<itemModifierType>
}

export interface itemModifierType {
    id: string,
    condition: string,
}

export interface actionObjectType {
    type: actionType,
    [k: string]: any,
}

export interface itemSelected {
    gui: string,
    pos: number
};

export interface inventoryType {
    id: string,
    data: Array<itemType>,
    index: number
}

export interface TrappedDataType {
    data: Array<inventoryType>;
    namespace: string;
    version: string;
}