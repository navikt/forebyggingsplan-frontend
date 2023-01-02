import styles from "./QbrickVideoPlayer.module.css";
import React, { useEffect } from "react";

export const QBRICK_GOBRAIN_VIDEOPLAYER_CONFIG_PATH = `/forebyggingsplan/api/qbrick/config`;

export interface QbrickVideo {
    id: string;
    tags: string[];
    metadata: {
        title: string;
        description: string;
    };
}

export interface QbrickVideoPlayerProps {
    video: QbrickVideo;
}

export const QbrickVideoPlayer = (props: QbrickVideoPlayerProps) => {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window && window.GoBrain) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.GoBrain.widgets(props.video.id).on("play", function () {
                // eslint-disable-next-line @typescript-eslint/no-this-alias,@typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const goBrainWidget = this;
                document.addEventListener("forcePausePlayer", function () {
                    goBrainWidget.pause();
                });
                document.dispatchEvent(new CustomEvent("videoAvspilles"));
            });
        }
    }, [props.video.id]);

    const player = () => {
        return {
            __html: `<div data-gobrain-widgetId="${props.video.id}"
        data-gobrain-autoplay="false"
        data-gobrain-repeat="false" 
        data-gobrain-moduleSettings="{&quot;TopControls&quot;:{&quot;download&quot;:{&quot;enabled&quot;:false},&quot;sharing&quot;:{&quot;enabled&quot;:false}},&quot;MobileControls&quot;:{&quot;download&quot;:{&quot;enabled&quot;:false},&quot;sharing&quot;:{&quot;enabled&quot;:false}}}" 
        data-gobrain-config="${QBRICK_GOBRAIN_VIDEOPLAYER_CONFIG_PATH}"
        data-gobrain-data="https://video.qbrick.com/api/v1/public/accounts/763558/medias/${props.video.id}"></div>`,
        };
    };
    return (
        <div className={styles.videoContainer}>
            <div className={styles.video} dangerouslySetInnerHTML={player()} />
        </div>
    );
};
