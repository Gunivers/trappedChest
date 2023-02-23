import { faDiscord, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link'
import useResizeObserver from "@react-hook/resize-observer";

export default function Layout({ children, bg, getHeightViewport }: any) {

    const NavBar = useRef<HTMLDivElement>(null);
    useResizeObserver(NavBar, (entry) => getHeightViewport(`(100vh - ${entry.contentRect.height}px)`));
    const countUpRef = useRef(null);
    let stupidEnd = Math.floor(Math.random() * 1000)
    let [stupidCounter, setStupidCounter] = useState<number>(0);
    const [renderClientSideComponent, setRenderClientSideComponent] = useState(false);

    // useEffect(() => {
    //     setInterval(() => {
    //         if(stupidEnd > stupidCounter) setStupidCounter(stupidCounter+1);
    //         if(stupidEnd < stupidCounter) setStupidCounter(stupidCounter-1);
    //     }, 100)
    // }, [renderClientSideComponent]);

    return (
        <>
            <Head>
                <title>Trapped Chest</title>
            </Head>
            <AppBar position="fixed" id="NavBar" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} ref={NavBar}>
                <Toolbar>
                    <Typography variant="h4" noWrap sx={{ flexGrow: 1 }}>
                        Trapped Chest
                    </Typography>

                    {/* <Typography variant="h3" sx={{ mx: 'auto' }}>
                        {stupidEnd}
                    </Typography> */}
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" spacing={3}>
                        <Link href="https://discord.gg/E8qq6tN">
                            <a>
                                <FontAwesomeIcon icon={faDiscord} size="2x" />
                            </a>
                        </Link>
                        <Link href="https://twitter.com/gunivers_">
                            <a>
                                <FontAwesomeIcon icon={faTwitter} size="2x" />
                            </a>
                        </Link>
                        <Link href="https://www.youtube.com/channel/UCtQb5O95cCGp9iquLjY9O1g">
                            <a>
                                <FontAwesomeIcon icon={faYoutube} size="2x" />
                            </a>
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box sx={{ background: bg, backgroundPosition: "center", backgroundSize: "cover", minHeight: "100vh", display: "flex" }} component="main">
                <Box sx={{ backdropFilter: "blur(5px)", width: "100%" }}>
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </>
    )
}