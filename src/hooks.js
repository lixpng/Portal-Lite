// import { createLocalStorageStateHook } from 'use-local-storage-state';
import createPersistedState from 'use-persisted-state';
import { useState, useCallback } from 'react';
import { useAuthing } from '@authing/react-ui-components';

import { Widgets } from './data';

// 小组件
const useWidgets = () => {
  const { getWidgetSetting, updateWidgetSetting } = useWidgetSettings();
  let wgKeys = Object.entries(Widgets)
    .filter(([, val]) => val.preset == true)
    .map(([key]) => key);
  const initialKeys = getWidgetSetting({ key: 'local', name: 'widgets' }) || wgKeys;
  const [widgets, setWidgets] = useState(initialKeys);
  const updateWidgetData = (list) => {
    setWidgets(list);
    updateWidgetSetting({ name: 'widgets', data: list });
  };
  const addWidget = (app) => {
    setWidgets((prev) => {
      let newData = [...prev, app];
      updateWidgetSetting({ name: 'widgets', data: newData });
      return newData;
    });
  };
  const removeWidget = (key) => {
    setWidgets((prev) => {
      let newData = prev.filter((item) => {
        return item !== key;
      });
      updateWidgetSetting({ name: 'widgets', data: newData });
      return newData;
    });
  };

  return { widgets, addWidget, removeWidget, updateWidgetData };
};
// 小组件的本地设置
const LOCAL_WG_SETTINGS_KEY = 'WIDGET_SETTINGS_DATA';
const useLocalSettings = createPersistedState(LOCAL_WG_SETTINGS_KEY);
const defaultGetParams = { key: 'local', name: 'common' };

// const useLocalSettings = createLocalStorageStateHook(LOCAL_WG_SETTINGS_KEY, null);
const useWidgetSettings = () => {
  const [widgetSettings, setWidgetSettings] = useLocalSettings();
  const { authClient } = useAuthing({ appId: '6034a70af621af721e5320b9' });
  const updateLocalData = async (newData) => {
    // if(!newData){

    // }else{

    // 加个时间戳
    newData.timestamp = new Date().getTime();
    setWidgetSettings({ ...newData });
    // }
    // 如果已登录，同步数据到云端
    let { status } = await authClient.checkLoginStatus();
    if (status) {
      authClient.setUdv('widget_data', JSON.stringify(newData));
    }
  };
  let defaultUpdateParams = { name: 'common', key: 'local', data: null };
  const updateWidgetSetting = (params = defaultUpdateParams) => {
    const { key, name, data } = Object.assign({}, defaultUpdateParams, params);
    console.log({ key, name, data });
    let tmp = widgetSettings || {};
    if (tmp[name]) {
      tmp[name] = { ...tmp[name], ...{ [key]: data } };
    } else {
      tmp[name] = { [key]: data };
    }

    updateLocalData(tmp);
  };
  const getWidgetSetting = useCallback(
    (params = defaultGetParams) => {
      const { key, name } = Object.assign({}, defaultGetParams, params);
      if (!widgetSettings) return null;
      // console.log({ widgetSettings });
      let obj = widgetSettings[name];
      if (obj) {
        return obj[key] ? obj[key] : null;
      }
      return null;
    },
    [widgetSettings]
  );
  const clearWidgetSettings = () => {
    // console.log({ widgetSettings });
    updateLocalData(null);
  };
  const importWidgetSettings = (content) => {
    // console.log({ widgetSettings });
    updateLocalData(JSON.parse(content));
  };

  return {
    widgetSettings,
    getWidgetSetting,
    updateWidgetSetting,
    importWidgetSettings,
    clearWidgetSettings
  };
};
export { useWidgets, useWidgetSettings };
