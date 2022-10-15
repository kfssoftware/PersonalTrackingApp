import store from "store";
import nProgress from "nprogress";
import { useEffect } from "react";
import general from "utils/general";
import { useDispatch } from "react-redux";
import { Actions as AuthActions } from "redux/auth/reducers"
import { Actions as ApiCallActions } from "redux/apiCall/reducers"
import { Actions as RootActions } from "redux/root/reducers"
import Axios from "axios";
import i18next from "i18next";
import { SortAscendingOutlined } from "@ant-design/icons";

const loadUserInfo = ({ dispatch, onSuccess }) => {
    const token = store.get("token") || "";
    if (!general.isNullOrEmpty(token)) { //user not logged in
        dispatch(AuthActions.setAuthState({ // set token
            token: token,
            isUserAuthorized: true
        }));
        global.token = token;
        var countError = 0;
        dispatch(ApiCallActions.NativeGet({
            controller: "auth",
            action: "userinfo",
            showAlertOnError: true,
            onSuccess: ({ data }) => {
                if (data == null) {
                    localStorage.clear();
                }
                dispatch(AuthActions.setAuthState({ // update user info
                    userInfo: data
                }));
                global.userInfo = data;
                global.token = token;
                global.roles = [];
                store.set("userLanguageId", data.languageId);
                onSuccess();
            },
            onError: () => {
                const languageId = store.get("userLanguageId");
                store.remove("token");
                localStorage.clear();
                store.set("userLanguageId", languageId);
                general.notificationSuccess("general.logout_success");
                dispatch(AuthActions.setAuthState({
                    isUserAuthorized: false,
                    token: "",
                }));
                // window.location.reload();
            }
        }))
    } else {
        onSuccess();
    }
}

const LoadApp = ({ }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        loadUserInfo({
            dispatch,
            onSuccess: () => {
                dispatch(RootActions.setRootState({
                    appIsLoading: false,
                    i18nextLoading: false,
                }));
            }
        });
    }, []);
    return null;
}

export default LoadApp;