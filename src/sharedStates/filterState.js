import { atom } from 'recoil';

export const filterStateRecoil = atom({
    key: "filterState",
    default: {
        isFilterModalOpen: false,
        isFiltered: false,
        date: new Date(),
        filter: ""
    }
})