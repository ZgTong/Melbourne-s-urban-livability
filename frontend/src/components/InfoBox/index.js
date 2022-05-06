import React, { memo, useEffect, useRef } from 'react';
const InfoBox = (
    options
) => {
    const ref = useRef(null)
    // useEffect(() => {
    //     console.log("info:", options, ref.current)
    // }, [infoWin])
    return (
        <div ref={ref}>
            <p></p>
        </div>
    );
};

export default memo(InfoBox);
