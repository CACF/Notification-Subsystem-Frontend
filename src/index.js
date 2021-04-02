import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import settings from './settings.json'
import { KC_URL } from './utilities/constants';
// Containers
import Full from './containers/Full/Full'
import "bootstrap/dist/css/bootstrap.css"

// Styles
// import 'simplebar/dist/simplebar.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Main styles for this application
import './scss/style.scss'
// Temp fix for reactstrap
import './scss/core/_dropdown-menu-right.scss'
import { getUserGroups, isPage401 } from "./utilities/helpers";
import Keycloak from 'keycloak-js';
import decode from 'jwt-decode'
import Base64 from 'base-64';
import Page401 from "./views/Errors/Page401";

const { clientId, realm } = settings.keycloak;

let kc = Keycloak({
	url: KC_URL,
	realm: realm,
	clientId: clientId
});

/**
 * Code below adds Keycloak functionality and redirect loggedin user to either Application or 401 Authorized Page.
 * It uses keycloak.json configuration file downloaded from Keycloak.
 */
	kc.init({ onLoad: 'login-required','checkLoginIframe' : false}).then(authenticated => {
		if (authenticated) {
			localStorage.setItem('token', kc.token);
			let tokenDetails = decode(kc.token)
			let groups = getUserGroups(tokenDetails);
			var pageStatus = isPage401(groups);
			if (pageStatus) { // is Page401 then show page401
				kc.loadUserInfo().then(function (userInfo) {
					ReactDOM.render((
						<I18nextProvider i18n={i18n}>
							<HashRouter>
								<Switch>
									<Route path="/" render={(props) => <Page401 kc={kc} userDetails={userInfo} {...props} />} />
								</Switch>
							</HashRouter>
						</I18nextProvider>
					), document.getElementById('root'));
				});
			} else { // User has permission and therefore, allowed to access it.
				kc.loadUserInfo().then(function (userInfo) {
					localStorage.setItem('userInfo', Base64.encode(JSON.stringify(userInfo)))
					ReactDOM.render((
						<I18nextProvider i18n={i18n}>
							<HashRouter>
								<Switch>
								<Route path="/" render={(props) => <Full kc={kc} i18n={i18n} userDetails={userInfo} resources={tokenDetails} {...props} />} />
								</Switch>
							</HashRouter>
						</I18nextProvider>
					), document.getElementById('root'));
				});
			}
		} else {
			kc.login();
		}
	}).catch(function () {
		alert('Keycloak configuration issue, please refer to Keycloak Documentation');
	});

