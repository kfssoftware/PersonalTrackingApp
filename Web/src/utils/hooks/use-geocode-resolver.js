import i18next from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Actions as ApiCallActions } from "redux/apiCall/reducers";

const useGeoCodeResolver = () => {
    const dispatch = useDispatch();
    const [address, setAddress] = useState();
    const _resolve = useCallback((lat, lng) => {
        const promise = new Promise((resolve, reject) => {
            dispatch(ApiCallActions.NativePost({
                controller: 'map',
                action: 'reverseGeoCodeResolver',
                data: {
                    key: process.env.ADDRESS_RESOLVE_KEY,
                    lat: lat,
                    lng: lng,
                },
                showAlertOnError: true,
                onSuccess: ({ data }) => {
                    resolve(data)
                },
                onError: ({ errorMessage }) => reject(errorMessage)
            }))
        })
        return promise;
    }, []);
    return _resolve;
}


export default useGeoCodeResolver;