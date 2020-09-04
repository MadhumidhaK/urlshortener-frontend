import React, { useState } from 'react';
import moment from "moment";
import {BarChart,  XAxis, YAxis, Bar,Tooltip, ResponsiveContainer } from "recharts";
import { useRecoilValue } from 'recoil';
import { chartStateRecoil } from '../../sharedStates/chartState';

const Chart = () => {
    const chartState = useRecoilValue(chartStateRecoil);
    const dateFormatter = (item) => moment(item).format("DD MMM");

    return (
        <ResponsiveContainer className="float-right" width="100%" height={250}>
        <BarChart width={100} height={250} data={chartState.data}>
            <XAxis dataKey={"date"} tickFormatter={dateFormatter} tick={{fill: "#d39e00"}} />
            <YAxis dataKey="count" tick={false} axisLine={false} />
            <Tooltip labelFormatter={dateFormatter} labelStyle={{ color: "black"}}/>
            <Bar dataKey="count" fill="#8884d8" role="button" onClick={(data, index) => {
                console.log(data);
                console.log(index)
            }} />
        </BarChart>
    </ResponsiveContainer>
    );
}
//#8884d8
export default Chart;