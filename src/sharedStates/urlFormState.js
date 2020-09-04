import { atom } from 'recoil';

export const urlFormStateRecoil =  atom({
    key: "urlFormState",
    default: {
        isOpen: false,
        createURL: true,
        longUrl: "",
        shortUrl: "",
        name:"",
        alreadyExistsError: false
    }
});