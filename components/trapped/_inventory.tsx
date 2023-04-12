import { Card, CardContent, Stack, Box, Typography, CardActions, FormControl, InputLabel, Input, InputAdornment, IconButton, FormHelperText, Menu, MenuItem } from "@mui/material";
import { bindTrigger, bindMenu } from "material-ui-popup-state";
import { usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { inventoryType } from "../../lib/types";
import Image from 'next/image'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';


export default function GuiInventory({ gui, index, isEditError, onEdit, onClick, selected, menuItems }: { gui: inventoryType, index?: number, isEditError?: (s: string) => boolean, onEdit?: (s: string) => void, onClick?: (id: number) => void, selected?: number | null | undefined | false, menuItems?: Array<[string, () => void] | [string, () => void, object]> }) {
    const popupState = usePopupState({ variant: 'popover', popupId: 'optionInventoryMenu' })

    const [isEditing, setEditing] = React.useState<boolean>(false);
    const [idGui, setIdGui] = React.useState<string>(gui.id);

    const [isError, setIsError] = React.useState<boolean>(false);


    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdGui(event.target.value)
        if(isEditError) setIsError(isEditError(event.target.value));
    }

    const handleSetEditChange = () => {
        if (isError) return;
        setEditing(false);
        if(onEdit) onEdit(idGui);
    }

    return (
        <Card variant="outlined" sx={{ width: 'min-content' }} key={gui.id}>
            <CardContent>
                <Stack spacing={1}>
                    {new Array(3).fill(0).map((_, i) =>
                        <Stack spacing={1} direction="row" key={gui.id + ' ' + (i * 10)}>
                            {new Array(9).fill(0).map((_, j) =>
                                <Box onClick={() => { if(onClick) onClick(i * 9 + j); }} key={gui.id + ' ' + (i * 9 + j)} sx={{
                                    width: 50, height: 50, border: `1px solid ${(selected && selected == (i * 9 + j)) ? 'green' : 'white'}`, backgroundColor: `${(selected && selected == (i * 9 + j)) ? 'green' : ''}`, opacity: [0.9, 0.8, 0.7], '&:hover': {
                                        backgroundColor: `${(selected && selected == (i * 10 + j)) ? 'green' : 'primary.contrastText'}`,
                                    },
                                }}>
                                    {gui.data[i * 9 + j] &&
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <Image src={`/images/items/minecraft__${gui.data[i * 9 + j].id}.png`} layout='fill' alt={gui.data[i * 9 + j].id} style={{imageRendering: 'pixelated'}}/>
                                            <Typography sx={{ position: 'absolute', bottom: 0, right: 0 }}>{gui.data[i * 9 + j].count}</Typography>
                                        </Box>
                                    }
                                </Box>
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
            <CardActions>
                <Typography variant='subtitle1' >{index}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                {isEditing ?
                    <FormControl variant="standard">
                        <InputLabel htmlFor="editGuiId">Name</InputLabel>
                        <Input
                            autoFocus
                            id="editGuiId"
                            type={'text'}
                            value={idGui}
                            onChange={handleEditChange}
                            error={isError}
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
                            onKeyPress={(event) => {
                                if (event.key == 'Enter'){
                                    handleSetEditChange();    
                                }
                            }}
                        />
                        {isError &&
                            <FormHelperText id="editGuiId">
                                Please don&apos;t use a duplicate id
                            </FormHelperText>
                        }
                    </FormControl>
                    :
                    <Typography> {gui.id} </Typography>
                }
                <Box sx={{ flexGrow: 1 }} />
                <IconButton aria-label="more" {...bindTrigger(popupState)}>
                    <MoreHorizIcon />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={() => { popupState.close(); setEditing(true) }}>Rename</MenuItem>
                    {menuItems && menuItems.map((m, i) =>
                        <MenuItem onClick={() => { popupState.close(); m[1]() }} sx={m[2]} key={i} >{m[0]}</MenuItem>
                    )}
                </Menu>
            </CardActions>
        </Card>
    )
}