import React, {memo, useEffect, useRef, useState} from 'react';
const InfoBox = (
    options // content pixelOffset position maxWidth
) => {
    const ref = useRef(null)
    const [infoWin, setInfoWin] = useState(null)
    const divStyle = {
        background: `white`,
        border: `1px solid #ccc`,
        padding: 15
    }

    useEffect(() => {
        console.log("info:", options, ref.current)
        if (ref.current && !infoWin) {
            setInfoWin(new window.google.maps.InfoWindow(options));
        }
        if (infoWin) {
            infoWin.open({
                // anchor: marker,
                map: options.map,
                shouldFocus: false,
            });
            console.log("isOpen")
        }

    }, [infoWin])
    return (
        <div ref={ref}></div>
    );
};

export default memo(InfoBox);
