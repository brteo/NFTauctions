/* eslint-disable no-param-reassign */
import axios from 'axios';
import { Modal } from 'antd';
import i18n from './i18n';

const Api = axios.create({
	baseURL: process.env.REACT_APP_ENDPOINT
});
Api.defaults.withCredentials = true;
export default Api;

const errorComposer = error => () => {
	if (error.response) {
		// our custom error
		Modal.error({
			title: i18n.t('common.error') + ' [' + error.response.data.error + ']',
			content: i18n.t('core:errors.' + error.response.data.error)
		});
	} else {
		Modal.error({
			title: i18n.t('common.error'),
			content: error.toString()
		});
	}
};

Api.interceptors.response.use(
	response => response,
	error => {
		error.globalHandler = errorComposer(error);
		return Promise.reject(error);
	}
);
