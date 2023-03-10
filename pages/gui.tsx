import { Autocomplete, Box, Button, Menu, MenuItem, Card, CardActions, CardContent, Container, Grid, IconButton, Link, Pagination, Paper, Stack, Typography, TextField, CircularProgress, InputLabel, OutlinedInput, InputAdornment, FormControl, Input, createFilterOptions, FormHelperText, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { NextPage, GetStaticProps } from 'next'
import React, { useRef } from 'react'
import Layout from '../components/layout'

import Image from 'next/image'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import { usePopupState, bindTrigger, bindMenu, } from 'material-ui-popup-state/hooks'
import fileDownload from 'js-file-download';

import { itemListURL } from '../lib/constants'
import { filterAutoCompleteType, itemModifierType, actionType, actionObjectType, inventoryType, itemSelected } from '../lib/types';
import GuiInventory from '../components/trapped/inventory';

const filter = createFilterOptions<filterAutoCompleteType>();


const Gui: NextPage = () => {
    const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

    const [itemSelected, setItemSelected] = React.useState<itemSelected>({ gui: 'base', pos: 12 });


    const [guiData, setGuiData] = React.useState<Array<inventoryType>>([{ id: 'base', data: [], index: 0 }, { id: 'helloworld', data: [], index: 1 }]);


    const [id, setId] = React.useState<string>('');
    const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value)
    };

    const [destinationId, setDestinationId] = React.useState<filterAutoCompleteType | null>({ id: 'enderchest' });

    const changeNamespaceRef = useRef();
    const [namespaceId, setNamespaceId] = React.useState<string>('gui');
    const handleChangeNamespace = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNamespaceId(event.target.value)
    };

    const textCountRef = useRef();
    const [count, setCount] = React.useState<number>(1);
    const handleChangeCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCount(Number(event.target.value));
    };

    const [goToPage, setGoToPage] = React.useState<number>(0);
    const handleChangeGoToPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGoToPage(Number(event.target.value));
    };

    const [functionAction, setFunctionAction] = React.useState<string>('');
    const handleChangeFunctionAction = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFunctionAction(event.target.value);
    };

    const [itemModifiers, setItemModifiers] = React.useState<Array<itemModifierType>>([]);

    const handleAddModifier = () => {
        setItemModifiers([...itemModifiers, { id: 'namespace:modifier_id', condition: 'if score player score matches 1' }])
    }

    const [action, setAction] = React.useState<actionType>('nothing');
    const handleChangeAction = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAction(event.target.value as actionType);
    };

    const handleItemUpdate = () => {
        const newGUI: inventoryType[] = Object.assign([], guiData);
        const guiIndex = newGUI.findIndex(d => d.id == itemSelected.gui);
        //@ts-ignore
        const newCount = Number(textCountRef?.current?.value || '1') || 1;
        setCount(newCount);
        const newAction: actionObjectType = { type: action }
        if (action == 'page') newAction.page = goToPage;
        if (action == 'function') newAction.function = functionAction;
        newGUI[guiIndex].data[itemSelected.pos] = { count: newCount, id: id, action: newAction, modifiers: itemModifiers };

        setGuiData(newGUI);
    };

    const handleItemSelection = (id: itemSelected) => {
        setItemSelected(id);

        const guiIndex = guiData.findIndex(d => d.id == id.gui);
        const item = guiData[guiIndex].data[id.pos];

        setId(item?.id);
        setCount(item?.count || 1);
        setAction(item?.action.type || 'nothing');
        setItemModifiers(item?.modifiers || []);
        if (item?.action.type == 'page') setGoToPage(item?.action.page);
        if (item?.action.type == 'function') setFunctionAction(item?.action.function);
    }


    function getNewIdName(i?: number): string {
        if (!i) return getNewIdName(1);
        if (guiData.find(d => d.id == `new${i}`)) return getNewIdName(i + 1);
        return `new${i}`;
    }



    async function generate() {

        //@ts-ignore
        let namespaceIdNew = changeNamespaceRef?.current?.value || ''
        if (namespaceIdNew == '') namespaceIdNew = 'trappedchest';

        //console.log(process.env.NEXT_PUBLIC_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/trappedchest`, {
            method: "POST",
            body: JSON.stringify({ data: guiData, namespace: namespaceIdNew, version: '1.19.4' })
        })
        const data = await res.arrayBuffer()
        fileDownload(data, namespaceIdNew + '.zip');
    }

    return (
        <>
            <Layout getHeightViewport={setHeightViewport}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack spacing={2} sx={{ p: 5 }}>
                            {guiData.map((data, index) =>
                                <GuiInventory gui={data} key={data.id} index={index}
                                    menuItems={[ ['Export', () => {}], ['Add after', () => {setGuiData(g => [...g, { data: [], id: getNewIdName(), index: guiData.length }])}], ['Delete', () => {setGuiData(guiData.filter(g => g.id !== data.id))}, { color: 'red' }] ]}
                                    onEdit={(newId) => {
                                        const newGUI: inventoryType[] = Object.assign([], guiData);
                                        const guiIndex = newGUI.findIndex(d => d.id == data.id);
                                        newGUI[guiIndex].id = newId;
                                        setGuiData(newGUI);
                                    }}
                                    isEditError={(newId) => !!guiData.find(g => g.id == newId && g.id !== data.id)}
                                    onClick={(id) => handleItemSelection({ gui: data.id, pos: id })}
                                    selected={itemSelected.gui == data.id ? itemSelected.pos : false}
                                />
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ position: 'sticky', top: 50, height: 'full' }}>
                            <Box sx={{ p: 5, }}>
                                <MenuItemOption />
                            </Box>
                            <Box sx={{ p: 5, pt: 0 }}>
                                <GenerateMenuOption />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Layout>
        </>
    )

    function MenuItemOption(props: any) {
        const [open, setOpen] = React.useState(false);
        const [options, setOptions] = React.useState<readonly string[]>([]);
        const loading = open && options.length === 0;

        React.useEffect(() => {
            let active = true;

            if (!loading) {
                return undefined;
            }

            (async () => {
                fetch(itemListURL)
                    .then(res => res.text())
                    .then((data) => {
                        if (active) {
                            //console.log(data)
                            setOptions(data.split('\n').map(s => s.slice(10)))
                        }
                    })
            })();

            return () => {
                //active = false;
            };
        }, [loading]);

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Typography variant='h3'>Item</Typography>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 }, }}>
                        {/* <TextField id="standard-basic" label="Id" variant="standard" onChange={handleChangeId} defaultValue={guiData[0].data[itemSelected.pos] ? guiData[0].data[itemSelected.pos].id : ''} /> */}
                        <Autocomplete
                            value={id}
                            onChange={(event: any, newValue: string | null) => {
                                if (newValue) setId(newValue);
                            }}
                            id="controllable-states-demo"
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            options={options}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Id"
                                    variant="standard"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <TextField variant="standard" id="outlined-number" label="Count"
                            inputRef={textCountRef}
                            defaultValue={count}
                            sx={{ mr: 1 }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        />

                        <TextField
                            variant="standard"
                            id="outlined-select-currency"
                            select
                            label="Action"
                            defaultValue={'nothing'}
                            value={action}
                            onChange={handleChangeAction}
                        >
                            <MenuItem key={'nothing'} value={'nothing'}>
                                nothing
                            </MenuItem>
                            <MenuItem key={'page'} value={'page'}>
                                got to page
                            </MenuItem>
                            <MenuItem key={'function'} value={'function'}>
                                execute function
                            </MenuItem>
                        </TextField>
                        {action == 'page' && <TextField variant="standard" id="outlined-number" label="Page Id" type="number" onChange={handleChangeGoToPage} value={goToPage} sx={{ mr: 1 }} />}
                        {action == 'function' && <TextField variant="standard" id="outlined-number" label="Function id" onChange={handleChangeFunctionAction} value={functionAction} sx={{ mr: 1 }} />}

                    </Box>

                    <Divider sx={{ p: 1 }} variant="middle"><Typography variant={'body2'}>item modifiers</Typography></Divider>

                    <Box sx={{ m: 1, mb: 0 }}>
                        {itemModifiers.map((modifier, index) =>
                            (<ItemModifier modifier={modifier} index={index} key={index} />)
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <IconButton aria-label="add condition" size="small" onClick={handleAddModifier}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button sx={{ mx: 'auto' }} variant="outlined" color="secondary" onClick={handleItemUpdate}>Update</Button>
                </CardActions>
            </Card>
        )
    }

    function ItemModifier({ modifier, index }: { modifier: itemModifierType, index: number }) {

        const [open, setOpen] = React.useState(false);

        const [idModifier, setIdModifier] = React.useState<string>(modifier.id);
        const [condition, setCondition] = React.useState<string>(modifier.condition);

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const handleChangeIdModifier = (event: React.ChangeEvent<HTMLInputElement>) => {
            setIdModifier(event.target.value)
        };
        const handleChangeCondition = (event: React.ChangeEvent<HTMLInputElement>) => {
            setCondition(event.target.value)
        };

        const handleEdit = () => {
            const newItemModifiers = itemModifiers;
            newItemModifiers[index].id = idModifier;
            newItemModifiers[index].condition = condition;
            setItemModifiers(newItemModifiers);

            setOpen(false);
        };

        const handleDelete = () => {

            const newItemModifiers = itemModifiers;
            newItemModifiers.splice(index, 1);

            setItemModifiers(Object.assign([], newItemModifiers));

            setOpen(false);
        };

        return (
            <>
                <Paper elevation={1} sx={{ display: 'flex', px: 1, my: 1 }} key={index}>
                    <Typography>{modifier.id}</Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton aria-label="edit condition" size="small" onClick={handleClickOpen}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Paper>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit item modifier</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The item modifier will be executed at this item if the condition pass
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="id"
                            label="item modifier id"
                            variant="standard"
                            defaultValue={modifier.id}
                            fullWidth
                            onChange={handleChangeIdModifier}
                        />
                        <TextField
                            margin="dense"
                            id="condition"
                            label="execute condition"
                            helperText="leave blank for always"
                            variant="standard"
                            defaultValue={modifier.condition}
                            fullWidth
                            onChange={handleChangeCondition}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDelete} color="error">Delete</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleEdit} variant="outlined" color="success">Edit</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    function GenerateMenuOption() {

        const [options, setOptions] = React.useState<filterAutoCompleteType[]>([
            { id: 'enderchest' }, { id: 'chest' }, { id: 'trappedchest' }
        ]);

        const addToOptions = (id: string) => {
            const newOpts = options;
            newOpts.push({ id: id })
            setOptions(() => newOpts);
            //console.log(options);
        }

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Typography variant='h3'>DataPack</Typography>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 }, }}>

                        <TextField variant="standard" id="outlined-text" label="Namespace" type="text" inputRef={changeNamespaceRef} defaultValue={namespaceId} />

                        <Box />
                        <Autocomplete
                            value={destinationId}

                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    addToOptions(newValue)
                                    setDestinationId({ id: newValue });
                                } else if (newValue && newValue.inputValue) {
                                    setDestinationId({ id: newValue.inputValue });
                                    addToOptions(newValue.inputValue)
                                } else {
                                    setDestinationId(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        id: `Add "${params.inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            id="free-solo-dialog-demo"
                            options={options}
                            getOptionLabel={(option) => {
                                // e.g value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return option.id;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            renderOption={(props, option) => <li {...props}>{option.id}</li>}
                            sx={{ width: 300 }}
                            freeSolo
                            renderInput={(params) => <TextField {...params} variant="standard" label="Gui type" />}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box sx={{ mx: 'auto' }}>
                        <Button variant="text" size="small" color="primary" onClick={() => { }}>Export</Button>
                        <Button sx={{ mx: 2 }} variant="contained" color="primary" onClick={() => { generate() }} >Generate</Button>
                        <Button variant="text" size="small" color="secondary" onClick={() => { }}>Import</Button>
                    </Box>
                </CardActions>
            </Card>
        )
    }
}

export default Gui
