import { atom } from 'recoil';

const today = new Date();
const startDay = new Date();
startDay.setDate(today.getDate() - 32);
const data = [];
let d = startDay;
console.log(d)
while(d <= today){
    let date = new Date(d).toISOString();
    data.push({ 
        date: date,
        count: 0,
        urls: []
    });
    
    d.setDate(d.getDate() + 1);
}

export const chartStateRecoil = atom({
    key: "chartState",
    default: {
        isOpen: false,
        data: data
    }
})