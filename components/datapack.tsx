// import { Download } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Checkbox, FormControlLabel, FormGroup, Grid, Link, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack, Toolbar, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
export default function Datapack({ data }){
    let [selectedVersion, setSelectedVersion] = React.useState(null);
    // const lastCanal = data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]];
    // const LastRelease = lastCanal.versions[lastCanal.versions -1]
    // setSelectedVersion(data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]].versions.pop())
    // console.log(selectedVersion.canal)

    interface IDictionary {
        [index: string]: boolean;
    }

    let [activeModules, setActiveModules] = useState({});
    let [urlDatapack, setUrlDatapack] = useState('');


    const handleListItemClick = (event, version: string) => {
        // console.log('handleListItemClick')
        let updatedModules = {}
        version.modules.map( module => {
            if(!activeModules.hasOwnProperty(module)){
                updatedModules[module] = true;
            }
        })
        setActiveModules({
            ...activeModules,
            ...updatedModules
        })
        setSelectedVersion(version);
    };

    const handleModuleChange = (event, module: string, activeModules: string) => {
        // console.log('handleModuleChange')
        // let modules = activeModules
        let updatedModules = {}
        updatedModules[module] = event.target.checked;

        setActiveModules({
            ...activeModules,
            ...updatedModules
        })
    }

    useEffect(() => {
        if (selectedVersion){
            let modules = []
            Object.keys(activeModules).map( module => {
                if (activeModules[module] && selectedVersion.modules.includes(module)){
                    modules.push(module)
                }
            })
            setUrlDatapack(`api/datapacks/${selectedVersion.canal}/${selectedVersion.version}/${modules.join('|')}`)
        }
        
    })

    return (
        <>
        <Grid container spacing={4} sx={{mt: 3, px:3}}>
        <Grid item xs={1}></Grid>
            <Grid item xs={3}>
                <Card>
                    <CardMedia
                        component="img"
                        sx={{ width: 140, m: 2 }}
                        image="/glib.png"
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        Gunivers-Libs
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        La Glib est une librairie pour vous, datapackers, ajoutant pleins d'outils et de fonctions utiles pour vos créations de contenus et de map.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                        <h1>Version</h1>
                    </CardContent>
                    <List
                        sx={{
                            position: 'relative',
                            overflow: 'auto',
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                        >
                        
                    <li>
                    {Object.keys(data.releases).map( canalId => (
                        <ul key={canalId}>
                            <Canal canal={data.releases[canalId]} selectedVersion={selectedVersion} handleListItemClick={handleListItemClick}/>
                        </ul>
                    ))}
                    
                        <ul>
                        <ListSubheader>Dev</ListSubheader>
                        {data.devs.map( (version) => (
                            <ListItemButton
                            key={version.canal}
                            selected={selectedVersion === version}
                            onClick={(event) => handleListItemClick(event, version, activeModules)}
                            >
                            <ListItemText primary={version.canal} />
                            </ListItemButton>
                        ))}
                        </ul>
                    </li>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={4}>
                {selectedVersion != null &&
                <>
                <Stack spacing={4}>
                    <Card>
                        <CardContent>
                    
                            <h1>{selectedVersion.canal} - {selectedVersion.version}</h1>
                            <Link href={urlDatapack} download>
                                {/* <Button variant="contained" startIcon={<Download />}>Télécharger le datapack</Button> */}
                                <Button variant="contained">Télécharger le datapack</Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            Modules
                            </Typography>
                            <FormGroup>
                            {selectedVersion.modules.map( (module) => (
                                    <FormControlLabel key={module} onChange={(event) => handleModuleChange(event, module, activeModules)} control={<Checkbox checked={activeModules[module]} className={'moduleBtn'}/>} label={module} />
                                ))}
                            </FormGroup>
                        </CardContent>
                    </Card>
                </Stack>
                </>
                    
                }
            </Grid>
        </Grid>
        <Box sx={{mt: 5, mx: 3}}>
            
        </Box>
        {/* <Typography component="div" variant="h2" sx={{ mt: 9 }}>Gunivers-Libs</Typography> */}
        {/* <Card sx={{ display: 'flex'}}>
            <CardMedia
                component="img"
                sx={{ width: 140, m: 2 }}
                image="/glib.png"
                alt="Live from space album cover"
            />
            <Box>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Gunivers-Libs
                </Typography>
                <Typography variant="body2" color="text.secondary" >
                    La Glib est une librairie pour vous, datapackers, ajoutant pleins d'outils et de fonctions utiles pour vos créations de contenus et de map.
                </Typography>
                </CardContent>
            </Box>
        </Card> */}
            {/* <Box sx={{display: 'flex'}}>
            {selectedVersion != null &&
                <Box>
                    <h1>{selectedVersion.canal} - {selectedVersion.version}</h1>
                    <FormGroup>
                    {selectedVersion.modules.map( (module) => (
                            <FormControlLabel key={module} onChange={(event) => handleModuleChange(event, module, activeModules)} control={<Checkbox checked={activeModules[module]} className={'moduleBtn'}/>} label={module} />
                        ))}
                    </FormGroup>
                    <Link href={urlDatapack} download>
                        <Button variant="contained">Télécharger le datapack</Button>
                    </Link>
                </Box>
            }
            </Box> */}
        </>
    )
}

export function Canal({ canal, selectedVersion, handleListItemClick }){
    return (
        <ul>
            <ListSubheader>{canal.canal}</ListSubheader>
            {canal.versions.map( (version) => (
                <Version version={version} key={version.version} selectedVersion={selectedVersion} handleListItemClick={handleListItemClick}/>
            ))}
        </ul>
    )
}

export function Version({ version, selectedVersion, handleListItemClick }){
    return(
        <>
            <ListItemButton
                key={version.version}
                selected={selectedVersion === version}
                onClick={(event) => handleListItemClick(event, version)}
                >
                <ListItemText primary={version.version} />
            </ListItemButton>
        </>
    )
}