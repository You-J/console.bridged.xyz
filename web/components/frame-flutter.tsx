import { NumberSize, Resizable } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import React from "react"

const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';

interface State {
    viewportWidth: number
    viewportHeight: number
}

interface Props { js: string }

export default class FrameFlutter extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            viewportHeight: 812,
            viewportWidth: 375
        }
    }

    componentDidMount() {
        // console.log('props', this.props)
        // let iframe = document.getElementById('frame') as HTMLIFrameElement
        // if (isIFrame(iframe) && iframe.contentWindow) {
        //     iframe!.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        //         console.warn(event, source, lineno, error);
        //     }
        // }
    }

    onIframeLoaded = () => {
        console.info("iframe loaded")
        let iframe = document.getElementById('frame') as HTMLIFrameElement

        iframe.contentWindow!.postMessage(
            { command: "execute", html: '<h1>loading...</h1>', css: 'h1 { text-align: center }', js: this.props.js },
            '*'
        );

        iframe.contentWindow!.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
            console.error('error from flutter js', source)
        }
    }


    onResize = (event: MouseEvent | TouchEvent, direction: Direction, elementRef: HTMLElement, delta: NumberSize) => {
        const newSize = this.resizable?.size

        // resize iframe's size as the container
        if (newSize) {
            this.setState(() => {
                return {
                    viewportHeight: newSize.height,
                    viewportWidth: newSize.width
                }
            })
        }
    }

    resizable: Resizable | null = null;

    render() {
        return (
            <Resizable
                ref={c => { this.resizable = c; }}

                defaultSize={{
                    width: 375,
                    height: 812,
                }}
                onResize={this.onResize}
                handleComponent={{
                    bottomRight: BottomRightHandle()
                }}
            >
                <iframe id="frame" width={this.state.viewportWidth} height={this.state.viewportHeight} src="/quicklook-assets/flutter/frame-flutter.html" sandbox="allow-scripts allow-same-origin" onLoad={this.onIframeLoaded}></ iframe>
            </Resizable>
        )
    }
}


const SouthEastArrow = () => (
    <svg
        width="20px"
        height="20px"
        version="1.1"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="m70.129 67.086l1.75-36.367c-0.035156-2.6523-2.9414-3.6523-4.8164-1.7773l-8.4531 8.4531-17.578-17.574c-2.3438-2.3438-5.7188-1.5625-8.0586 0.78125l-13.078 13.078c-2.3438 2.3438-2.4141 5.0117-0.074219 7.3516l17.574 17.574-8.4531 8.4531c-1.875 1.875-0.83594 4.8203 1.8164 4.8555l36.258-1.8594c1.6836 0.019531 3.1328-1.2812 3.1133-2.9688z" />
    </svg>
);


const BottomRightHandle = () => (
    <CustomHandle>
        <SouthEastArrow />
    </CustomHandle>
);

const CustomHandle = (props: any) => (
    <div
        style={{
            background: "#fff",
            borderRadius: "2px",
            border: "1px solid #ddd",
            height: "100%",
            width: "100%",
            padding: 0
        }}
        className={"SomeCustomHandle"}
        {...props}
    />
);