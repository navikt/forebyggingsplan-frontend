import styles from "./QbrickVideoPlayer.module.css";
import React, { useEffect } from "react";

export const QBRICK_GOBRAIN_VIDEOPLAYER_CONFIG_PATH = `/forebyggingsplan/api/qbrick/config`;

declare global {
    interface Window {
        GoBrain: {
            widgets: (videoId: string) => {
                on: (action: string, callback: () => void) => void;
            };
        };
    }
}

export interface QbrickVideoPlayerProps {
    videoId: string;
}

export const QbrickVideoPlayer = (props: QbrickVideoPlayerProps) => {
    useEffect(() => {
        if (window && window.GoBrain && window.GoBrain.widgets(props.videoId)) {
            window.GoBrain.widgets(props.videoId).on("play", function () {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const goBrainWidget = this;
                document.addEventListener("forcePausePlayer", function () {
                    goBrainWidget.pause();
                });
                document.dispatchEvent(new CustomEvent("videoAvspilles"));
            });
        }
    }, [props.videoId]);

    const player = () => {
        return {
            __html: `<div data-gobrain-widgetId="${props.videoId}"
        data-gobrain-autoplay="false"
        data-gobrain-repeat="false" 
        data-gobrain-moduleSettings="{&quot;TopControls&quot;:{&quot;download&quot;:{&quot;enabled&quot;:false},&quot;sharing&quot;:{&quot;enabled&quot;:false}},&quot;MobileControls&quot;:{&quot;download&quot;:{&quot;enabled&quot;:false},&quot;sharing&quot;:{&quot;enabled&quot;:false}}}" 
        data-gobrain-config="${QBRICK_GOBRAIN_VIDEOPLAYER_CONFIG_PATH}"
        data-gobrain-data="https://video.qbrick.com/api/v1/public/accounts/763558/medias/${props.videoId}"></div>`,
        };
    };
    return (
        <div className={styles.videoContainer}>
            <div className={styles.video} dangerouslySetInnerHTML={player()} />
        </div>
    );
};
