import { Box, Button, Checkbox, FormControlLabel, FormGroup, Link, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState, useEffect } from "react";
export default function Datapack({ data }){
    let [selectedVersion, setSelectedVersion] = React.useState(null);
    const lastCanal = data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]];
    const LastRelease = lastCanal.versions[lastCanal.versions -1]
    // setSelectedVersion(data.releases[Object.keys(data.releases)[Object.keys(data.releases).length - 1]].versions.pop())
    // console.log(selectedVersion.canal)

    interface IDictionary {
        [index: string]: boolean;
    }

    let [activeModules, setActiveModules] = useState({});
    let [urlDatapack, setUrlDatapack] = useState('');


    const handleListItemClick = (event, version) => {
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

    const handleModuleChange = (event, module, activeModules) => {
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
            <Box sx={{display: 'flex'}}>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {Object.keys(data.releases).map( canalId => (
                    <Canal canal={data.releases[canalId]} key={canalId} selectedVersion={selectedVersion} handleListItemClick={handleListItemClick}/>
                ))}
                <List component="nav" key="dev">
                    <h2>Dev</h2>
                    {data.devs.map( (version) => (
                        <ListItemButton
                        key={version.canal}
                        selected={selectedVersion === version}
                        onClick={(event) => handleListItemClick(event, version, activeModules)}
                        >
                        <ListItemText primary={version.canal} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

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
            </Box>
        </>
    )
}

export function Canal({ canal, selectedVersion, handleListItemClick }){
    return (
        <List component="nav" key={canal.canal}>
            <h2>{canal.canal}</h2>
            {canal.versions.map( (version) => (
                <Version version={version} key={version.version} selectedVersion={selectedVersion} handleListItemClick={handleListItemClick}/>
            ))}
        </List>
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