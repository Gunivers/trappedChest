import { AppBar, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { ComponentProps} from "react";

export default function Layout({ children }: any){
    return(
        <>
        <Head>
            <title>Glib Manager</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
            <Typography variant="h6" noWrap component="div">
                Glib Manager
            </Typography>
            </Toolbar>
        </AppBar>
        <main>
            <Toolbar/>
            {children}
        </main>
        </>
    )
}