import { atom } from 'recoil';


export const responsiveRecoil =  atom({
    key: "responsiveRecoil",
    default: {
        isMobile: false,
        mobile: {
            isURLDetailOpen: false
        }
    }
});