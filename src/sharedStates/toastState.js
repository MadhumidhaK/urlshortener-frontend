import { atom } from 'recoil';

export const toastStateRecoil = atom({
    key: "ToastState",
    default: {
        isOpen: false,
        toastHeader: "",
        toastBody: "",
        className: ""
    }
})