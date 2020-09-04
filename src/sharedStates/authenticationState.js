import { atom } from 'recoil';

export const authenticationStateRecoil =  atom({
    key: "isAuthencticated",
    default: {
        isAuthenticated:  window.localStorage.getItem('auth-token') ?  true : false,
        token: window.localStorage.getItem('auth-token') ?  window.localStorage.getItem('auth-token') : false
    }
});