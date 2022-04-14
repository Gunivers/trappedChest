import { faDiscord, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";
import { useRef } from "react";
import Link from 'next/link'
import useTranslation from "next-translate/useTranslation";
import useResizeObserver from "@react-hook/resize-observer";


export default function Layout({ children, bg, getHeightViewport }: any) {

    const { t, lang } = useTranslation('common')

    const NavBar = useRef<HTMLDivElement>(null);
    useResizeObserver(NavBar, (entry) => getHeightViewport(`(100vh - ${entry.contentRect.height}px)`));

    return (
        <>
            <Head>
                <title>{t('site.name')}</title>
            </Head>
            <AppBar position="fixed" id="NavBar" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} ref={NavBar}>
                <Toolbar>
                    <Typography variant="h4" noWrap sx={{ flexGrow: 1 }}>
                        {t('site.name')}
                    </Typography>
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