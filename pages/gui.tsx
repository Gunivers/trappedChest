import { Autocomplete, Box, Button, Menu, MenuItem, Card, CardActions, CardContent, Container, Grid, IconButton, Link, Pagination, Paper, Stack, Typography, TextField, CircularProgress, InputLabel, OutlinedInput, InputAdornment, FormControl, Input } from '@mui/material';
import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import Layout from '../components/layout'
import Carousel from 'react-material-ui-carousel'

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';

import { usePopupState, bindTrigger, bindMenu, } from 'material-ui-popup-state/hooks'

type actionType = 'nothing' | 'function' | 'page';

const itemListURL = "https://raw.githubusercontent.com/PixiGeko/Minecraft-generated-data/master/1.19/releases/1.19.2/data/registries/item.txt";

interface itemType {
    id: string,
    count: number,
    action: {
        type: actionType,
        [k: string]: any,
    }
}

interface itemSelected { gui: string, pos: number };

interface inventoryType {
    id: string,
    data: Array<itemType>
}


const Gui: NextPage<{ items: Array<string> }> = ({ items: itemsList }) => {
    const [heightViewport, setHeightViewport] = React.useState<Number | null>(null);

    const [itemSelected, setItemSelected] = React.useState<itemSelected>({ gui: 'base', pos: 12 });


    const [guiData, setGuiData] = React.useState<Array<inventoryType>>([{ id: 'base', data: [] }, { id: 'helloworld', data: [] }, { id: 'helloworld', data: [] }, { id: 'helloworld', data: [] }, { id: 'helloworld', data: [] }]);


    const [id, setId] = React.useState<string>('');
    const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value)
    };

    const [count, setCount] = React.useState<number>(1);
    const handleChangeCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCount(Number(event.target.value));
    };

    const [action, setAction] = React.useState<actionType>('nothing');
    const handleChangeAction = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAction(event.target.value as actionType);
    };

    const handleItemUpdate = () => {
        const newGUI: inventoryType[] = Object.assign([], guiData);
        const guiIndex = newGUI.findIndex(d => d.id == itemSelected.gui);
        newGUI[guiIndex].data[itemSelected.pos] = { count: count, id: id, action: { type: action } };
        setGuiData(newGUI);
    };

    const handleItemSelection = (id: itemSelected) => {
        setItemSelected(id);

        const guiIndex = guiData.findIndex(d => d.id == id.gui);
        const item = guiData[guiIndex].data[id.pos];

        setId(item?.id);
        setCount(item?.count);
        setAction(item?.action.type);
    }

    return (
        <>
            <Layout getHeightViewport={setHeightViewport}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack spacing={2} sx={{ p: 5 }}>
                            {guiData.map((data) => <GuiInventory gui={data} key={data.id} />)}

                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ p: 5 }}>
                            <MenuItemOption />
                        </Box>
                    </Grid>
                </Grid>
            </Layout>
        </>
    )

    function GuiInventory({ gui }: { gui: inventoryType }) {
        const popupState = usePopupState({ variant: 'popover', popupId: 'optionInventoryMenu' })

        const [isEditing, setEditing] = React.useState<boolean>(false);
        const [idGui, setIdGui] = React.useState<string>(gui.id);

        const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setIdGui(event.target.value)
        };

        const handleSetEditChange = () => {
            setEditing(false);
            const newGUI: inventoryType[] = Object.assign([], guiData);
            const guiIndex = newGUI.findIndex(d => d.id == itemSelected.gui);
            newGUI[guiIndex].id = idGui;
            setGuiData(newGUI);
        }

        return (
            <Card variant="outlined" sx={{ width: 'min-content' }} key={gui.id}>
                <CardContent>
                    <Stack spacing={1}>
                        {new Array(3).fill(0).map((_, i) =>
                            <Stack spacing={1} direction="row" key={gui.id + ' ' + (i * 10)}>
                                {new Array(9).fill(0).map((_, j) =>
                                    <Box onClick={() => { handleItemSelection({ gui: gui.id, pos: i * 10 + j }) }} key={gui.id + ' ' + (i * 10 + j)} sx={{
                                        width: 50, height: 50, border: `1px solid ${(itemSelected.gui == gui.id && itemSelected.pos == (i * 10 + j)) ? 'green' : 'white'}`, backgroundColor: `${(itemSelected.gui == gui.id && itemSelected.pos == (i * 10 + j)) ? 'green' : ''}`, opacity: [0.9, 0.8, 0.7], '&:hover': {
                                            backgroundColor: `${(itemSelected.gui == gui.id && itemSelected.pos == (i * 10 + j)) ? 'green' : 'primary.contrastText'}`,
                                        },
                                        // outline: `1px solid ${(gui.data[i * 10 + j] && gui.data[i * 10 + j].action.type == 'page') ? 'red' : 'invisible'}`
                                    }}>
                                        {gui.data[i * 10 + j] &&
                                            <Box sx={{ position: 'relative' }}>
                                                <Typography sx={{ position: 'absolute', bottom: 0, right: 0 }}>{gui.data[i * 10 + j].count}</Typography>
                                                <img src={`https://minecraftitemids.com/item/64/${gui.data[i * 10 + j].id}.png`}></img>
                                            </Box>
                                        }
                                    </Box>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
                <CardActions>
                    <Box sx={{ flexGrow: 1 }} />
                    {isEditing ?
                        <FormControl variant="standard">
                            <InputLabel htmlFor="editGuiId">Name</InputLabel>
                            <Input
                                id="editGuiId"
                                type={'text'}
                                value={idGui}
                                onChange={handleEditChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleSetEditChange}
                                            edge="end"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        :
                        <Typography> {gui.id} </Typography>
                    }
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton aria-label="more" {...bindTrigger(popupState)}>
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={() => { popupState.close(); setEditing(true)}}>Rename</MenuItem>
                        <MenuItem onClick={popupState.close}>Export</MenuItem>
                        <MenuItem onClick={popupState.close}>Add after</MenuItem>
                        <MenuItem onClick={popupState.close} sx={{ color: 'red' }}>Delete</MenuItem>
                    </Menu>
                </CardActions>
            </Card>

        )
    }

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

                        <TextField variant="standard" id="outlined-number" label="Count" type="number" defaultValue={1} onChange={handleChangeCount} value={count} sx={{ mr: 1 }} />

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
                    </Box>
                </CardContent>
                <CardActions>
                    <Button sx={{ mx: 'auto' }} variant="outlined" color="secondary" onClick={handleItemUpdate}>Update</Button>
                </CardActions>
            </Card>
        )
    }
}


export default Gui
