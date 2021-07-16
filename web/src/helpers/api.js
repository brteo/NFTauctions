/* eslint-disable no-param-reassign */
import axios from 'axios';
import { Modal } from 'antd';
import i18n from './i18n';

export const connect = axios.create({
	baseURL: process.env.REACT_APP_ENDPOINT
});
connect.defaults.withCredentials = true;

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

connect.interceptors.response.use(
	response => response,
	error => {
		error.globalHandler = errorComposer(error);
		return Promise.reject(error);
	}
);

export const checkApi = () => connect.get('/');

export const login = (email, password) => connect.post(`/auth/login`, { email, password });

export const register = (email, password) => connect.post('/auth/register', { email, password });

export const checkEmail = email => connect.get(`/auth/email/${email}`);

export const authCheck = () => connect.get(`/auth/check`);

export const refreshToken = () => connect.get('/auth/rt');

export const logout = () => connect.get('/auth/logout');

export const listAuctions = () => connect.get('/auctions');
