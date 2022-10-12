import Axios from "axios"
import i18next from "i18next";

const LoadLanguage = async ({ language, onSuccess, reTryOnFail = false }) => {
    Axios.get(language?.data?.translateSourceUrl, {
        headers: {
            "pragma": "no-cache",
            "cache-control": "no-cache"
        },
    }).then(async (result) => {
        i18next.init({
            lng: "en",
            debug: false,
            resources: result?.data,
            keySeparator: true
        });
        global.languageId = language?.value;
        onSuccess && onSuccess();
    }).catch((err) => {
        // alert("err!" + err.message)
        if (reTryOnFail)
            setTimeout(() => {
                LoadLanguage({ language, onSuccess, reTryOnFail });
            }, 2000);
    });

}

export default { LoadLanguage }