import axios from "axios";
import general from "utils/general";
import { ApiStatusEnum } from "utils/enums";
import store from "store";

const exampleApiCall = {
    controller: "",
    action: "",
    query: {
        id: 1, val: 2
    },
    itemId: 1, // for detail, delete, put actions
    method: "", // get, post, put, delete
    data: {}, // for, post, put json body data
    token: "" // bearer token

}

const makeApiCall = async payload => {
    try {
        const sendData = general.isNullOrEmpty(payload?.data) ? {} : { ...payload.data };
        let url = `${process.env.API_URL}/${payload?.controller}`;
        if (!general.isNullOrEmpty(payload?.action))
            url += `/${payload?.action}`;
        if (!general.isNullOrEmpty(payload?.itemId))
            url += `/${payload?.itemId}`;

        if (payload?.query instanceof Object) {
            const keys = Object.keys(payload?.query);
            if (keys?.length > 0) url += "?";

            for (let i = 0; i < keys.length; ++i) {
                url += keys[i] + "=" + ((payload?.query[keys[i]] instanceof Object || payload?.query[keys[i]] instanceof Array) ? encodeURI(JSON.stringify(payload?.query[keys[i]])) : encodeURI(payload?.query[keys[i]]));
                if (i < keys.length - 1)
                    url += "&";
            }
        }
        let options = {
            url,
            headers: { "Content-Type": "application/json", "authorization": + payload.token, "securitycode": "v9AjFd.l<X)ytQyc:b-toX?Bu%E4*vEo8mqTienE0^B.|)Pq?me8~8?Xw*{Vud0[QgAvSnX9[Lsqw@f{Q,G8?}&p{%E#9]t)<K9" },
            method: payload.method,
            data: sendData,
            ...payload?.axiosOptions
        };
        const res = await axios(options);
        if (res.data?.status === ApiStatusEnum.Success) {
            return {
                success: true,
                data: res.data?.data,
                pagination: res.data?.meta ? res.data?.meta : {
                    totalCount: res.data?.total,
                    page: res.data?.page
                }
            }
        }
        if (res.data?.status === ApiStatusEnum.Error) {
            return {
                error: true,
                data: res.data?.data,
                errorMessage: res.data?.exceptionMessage,
                errorMessageTechnical: res.data?.exceptionMessageTechnical,
            }
        }
        return {
            error: true,
            data: res.data?.data,
            errorMessage: "Unknown Error",
            errorMessageTechnical: "Unknown response status. status: " + res.data?.status,
        }

    } catch (error) {

        if (error?.response?.data?.logout == true || error?.response.status == 401) {
            store.remove("token");
            window.location.reload();
        }
        if (!general.isNullOrEmpty(error?.response?.data?.status)) { // error, but not network error. Have api error
            return {
                error: true,
                data: error?.response?.data?.data,
                errorMessage: error?.response?.data?.exceptionMessage,
                errorMessageTechnical: error?.response?.data?.exceptionMessageTechnical,
            }
        }

        return {
            error: true,
            data: null,
            errorMessage: "Unknown Error",
            errorMessageTechnical: error?.message,
        };
    }
};

export default {
    makeApiCall
}