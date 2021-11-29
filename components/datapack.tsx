// import { Download } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Switch, Typography } from "@mui/material";
import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import useTranslation from 'next-translate/useTranslation'

interface IDictionary {
    [index: string]: boolean;
}

interface DatapackVersion{
    canal? :string|null,
    version? :string|null,
    type?: 'dev'|'release'|null,
    commit?: string,
    modules?: string[]|null
}

interface ListModules {
    [index: string]: any;
}

export default function Datapack({ data }: any){

    const { t, lang } = useTranslation('common')

    // let selectedVersion: DatapackVersion|null
    // let setSelectedVersion: React.Dispatch<React.SetStateAction<DatapackVersion>>|React.Dispatch<React.SetStateAction<null>>
    // console.log(data)
    // const lastCanal = data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]];
    // const LastRelease: DatapackVersion = lastCanal.versions[lastCanal.versions.lenght -1]
    // console.log(lastCanal.versions.lenght)

    let [selectedVersion, setSelectedVersion] = React.useState<DatapackVersion|null>(null);
    // setSelectedVersion(data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]].versions.pop())
    // console.log(selectedVersion.canal)

    let activeModules: IDictionary
    let setActiveModules: React.Dispatch<React.SetStateAction<IDictionary>>

    [activeModules, setActiveModules] = useState({});
    let [urlDatapack, setUrlDatapack] = useState('');
    let [devVersion, setDevVersion] = useState(false);

    const handleDevClick = (event: MouseEvent<HTMLButtonElement>) => {
        setDevVersion(!(devVersion));
    }

    const handleListItemClick = (event: MouseEvent<HTMLDivElement>, version: DatapackVersion) => {
        // console.log('handleListItemClick')
        let updatedModules: IDictionary = {}
        version.modules?.map( module => {
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

    const handleModuleChange = (module: string, activeModules: IDictionary) => {
        // console.log('handleModuleChange')
        // let modules = activeModules
        let updatedModules: IDictionary = {}

        updatedModules[module] = !(activeModules[module]);

        setActiveModules({
            ...activeModules,
            ...updatedModules
        })
    }

    const handleModuleAllChange = () => {
        if(selectedVersion){
            let updatedModules: IDictionary = {}

            if ( !(selectedVersion.modules?.every( (module) => activeModules[module] == true)) ) {
                selectedVersion.modules?.map( module => {
                    updatedModules[module] = true;
                })
            }
            else{
                selectedVersion.modules?.map( module => {
                    updatedModules[module] = false;
                })
            }
            setActiveModules({
                ...activeModules,
                ...updatedModules
            })
        }
        
    }

    useEffect(() => {

        if (selectedVersion){
            let modules = [] as unknown as ListModules;
            Object.keys(activeModules).map( module => {
                if (activeModules[module] && selectedVersion?.modules?.includes(module)){
                    modules.push(module)
                }
            })
            setUrlDatapack(`api/datapacks/${selectedVersion.canal}/${selectedVersion.version}/${selectedVersion.commit}/${modules.join('|')}`)
        }
        
    }, [selectedVersion, activeModules])

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
                        { t('datapack.name') }
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                        { t('datapack.description') }
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 2}}>
                            <Link href="https://gunivers.net/gunivers-lib/">
                                <Button variant="contained">{ t('datapack.buttons.project') }</Button>
                            </Link>
                            <Link href="https://glib-core.readthedocs.io/en/latest/index.html">
                                <Button variant="contained">{ t('datapack.buttons.documentation') }</Button>
                            </Link>
                            <Link href="https://gitlab.com/Altearn/gunivers/minecraft/datapack/Glibs/glib-core">
                                <Button variant="outlined">{ t('datapack.buttons.git') }</Button>
                            </Link>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 5}}>
                            <Link href="https://gunivers.net/">
                                <Typography variant="body2" color="text.secondary">{ t('datapack.by-gunivers') }</Typography>
                            </Link>
                            <Link href="https://gunivers.net/mentions-legales/">
                                <Typography variant="body2" color="text.secondary">{ t('site.legal-notice') }</Typography>
                            </Link>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="h5" component="div">{ t('datapack.versions.title') }</Typography>
                            <FormControlLabel control={<Switch checked={devVersion} onClick={(event) => handleDevClick(event)} />} label="Dev" />
                        </Box>
                    </CardContent>
                    <List
                        sx={{
                            position: 'relative',
                            maxHeight: "80vh",
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
                    {devVersion &&
                        <ul>
                        <ListSubheader>Dev</ListSubheader>
                        {data.devs.map( (version: DatapackVersion) => (
                            <ListItemButton
                            key={version.canal}
                            selected={selectedVersion === version}
                            onClick={(event) => handleListItemClick(event, version)}
                            >
                            <ListItemText primary={version.canal} />
                            </ListItemButton>
                        ))}
                        </ul>
                    }
                        
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
                                <Button variant="contained">{ t('datapack.download.btn') }</Button>
                            </Link>
                        </CardContent>
                    </Card>
                    {selectedVersion.modules?.length != 0 &&
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            { t('datapack.modules.title')}
                            </Typography>
                            <FormControlLabel
                                label={ t('datapack.modules.all')}
                                control={
                                <Checkbox
                                    checked={selectedVersion.modules?.every( (module) => activeModules[module] == true)}
                                    indeterminate={ !(selectedVersion.modules?.every( (module) => activeModules[module] == true)) && !(selectedVersion.modules?.every( (module) => activeModules[module] == false)) }
                                    onChange={handleModuleAllChange}
                                />
                                }
                            />
                            <Divider />
                            <List sx={{ maxHeight: "50vh", overflowY: "auto"}}>
                            {selectedVersion.modules?.map( (module) => (
                                <div key={module}>
                                    <ListItem disablePadding >
                                        <ListItemButton onClick={(event) => handleModuleChange(module, activeModules)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                            edge="start"
                                            checked={activeModules[module]}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': module }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={module} primary={module} />
                                        </ListItemButton>
                                    </ListItem>
                                </div>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    }

                </Stack>
                </>
                    
                }
            </Grid>
        </Grid>
        
    </>
    )
}

export function Canal({ canal, selectedVersion, handleListItemClick }: any){
    return (
        <ul>
            <ListSubheader>{canal.canal}</ListSubheader>
            {canal.versions.map( (version: DatapackVersion) => (
                <Version version={version} key={version.version} selectedVersion={selectedVersion} handleListItemClick={handleListItemClick}/>
            ))}
        </ul>
    )
}

export function Version({ version, selectedVersion, handleListItemClick }: any){
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