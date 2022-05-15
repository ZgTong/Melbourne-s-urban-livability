import React, {memo, useEffect, useRef, useState, Children, cloneElement, isValidElement} from 'react';

const Marker = ({content, position, map}) => {
    const [marker, setMarker] = useState()
    const options = {content, position }
    useEffect(() => {
        if (!marker) {
            setMarker(new window.google.maps.Marker());
        }
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker])

    useEffect(() => {
        if (marker) {
            marker.setOptions({
                content,
                position,
                map,
            });
        }
    }, [marker, options]);
    return null
};

export default memo(Marker);