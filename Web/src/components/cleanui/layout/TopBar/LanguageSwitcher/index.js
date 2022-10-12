import React, { useCallback, useEffect, useState } from 'react'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { useDispatch } from 'react-redux'
import { Actions as ApiCallActions } from "redux/apiCall/reducers";
import general from 'utils/general'
import store from 'store'
import CustomFlag from "components/high-level/customFlag";
import { useHistory } from 'react-router-dom'

const LanguageSwitcher = ({ }) => {
  const dispatch = useDispatch();
  const [languageData, setLanguageData] = useState([]);
  const [userLanguageId, setUserLanguageId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    dispatch(ApiCallActions.List({
      controller: "language",
      action: "dropdown",
      showAlertOnError: true,
      data: { pageSize: 20 },
      onSuccess: ({ data }) => {
        setLanguageData(data);
        let userLanguageId = global.userInfo?.languageId;
        if (!userLanguageId)
          userLanguageId = store.get("userLanguageId");
        if (!userLanguageId) {
          userLanguageId = data.find((item) => window.navigator.language.includes(item.data.shortName.toLowerCase())).id;
        }
        if (!userLanguageId) {
          userLanguageId = 1;
        }
        setUserLanguageId(userLanguageId);
      },
      onError: () => {

      }
    }))
  }, []);

  const changeLanguage = useCallback((e) => {
    store.set("userLanguageId", e.key);
    const shortName = e.item.props.shortName;

    if (global.userInfo) {
      dispatch(ApiCallActions.NativePost({
        controller: "user",
        action: "changeLanguage/" + e.key,
        showAlertOnError: true,
        onSuccess: ({ data }) => {
          window.location.reload();
        },
        onError: () => { }
      }));
    } else {
      history.push("/auth/login/" + shortName);
      window.location.reload();
    }
  }, [languageData]);


  const menu = (
    <>
      {languageData?.length > 0 &&
        <Menu onClick={changeLanguage}>
          {languageData.filter((item) => item.id != userLanguageId).map((language) => {
            return (
              <Menu.Item key={language.id} value={language.name} shortName={language?.shortName.toLowerCase()}>
                <CustomFlag flagName={language.shortName} />
                <span className="text-uppercase">{language.name}</span>
              </Menu.Item>
            )
          })}
        </Menu>
      }
    </>
  )

  return (
    <>
      {languageData && languageData.length > 1 &&
        <Dropdown overlay={menu} placement="bottomRight">
          <div className={styles.dropdown}>
            <CustomFlag flagName={languageData.find(f => f.id == userLanguageId)?.shortName} />
            <span className="text-uppercase">{languageData.find(f => f.id == userLanguageId)?.name}</span>
          </div>
        </Dropdown>
      }
    </>
  )
}

export default LanguageSwitcher;
