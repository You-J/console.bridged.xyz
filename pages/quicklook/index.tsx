import React from "react"
import { useRouter } from 'next/router'
import FrameFlutter from "../../components/frame-flutter"

interface Query {
    frame?: string
    url?: string
    name: string
    w: number
    h: number
}

/**
 * frame or url is required
 * @param frame the frame id of selected node, which uploaded to default bridged quicklook s3 buket.
 * @param url the custom url of the compiled js file. any source is allowed.
 */
export default function Frame() {
    const router = useRouter();
    console.log(router.query)
    const q: Query = {
        frame: router.query.frame as string,
        url: router.query.url as string,
        name: router.query.name as string,
        w: Number.parseInt(router.query.w as string) ?? 375,
        h: Number.parseInt(router.query.h as string) ?? 812,
    }

    if (q.frame) {
        const jsCdn = `https://s3-us-west-1.amazonaws.com/xyz.bridged.console.quicklook/${q.frame}.dart.js`
        return <FrameFlutter js={jsCdn}></FrameFlutter>
    }
    else if (q.url) {
        return <FrameFlutter js={q.url}></FrameFlutter>
    }
    return <div>loading..</div>
}
