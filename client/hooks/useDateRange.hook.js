import { useState, useEffect } from "react";

    const getFormattedDateString = (date) => {
        if(date instanceof Date) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return [
                date.getFullYear(),
                (month > 9 ? "" : "0") + month,
                (day > 9 ? "" : "0") + day,
            ].join("-");
        }
    };

const useDateRange = (range) => {

    const [startDate, setStartDate] = useState(new Date(Date.now()));
    const [endDate, setEndDate] = useState(new Date(Date.now()));
    const [dateMap, setDateMap] = useState(new Map());

    useEffect(() => {
        if(endDate instanceof Date) {
            endDate.setDate(endDate.getDate() + range);
            for(let i = 0; i < range; i++) {
                const dateKey = new Date(Date.now());
                dateKey.setDate(startDate.getDate() + i);
                dateMap.set(getFormattedDateString(dateKey), 0);
            }
        }
        
    }, [endDate, startDate, range, dateMap]);

    return [getFormattedDateString(startDate), getFormattedDateString(endDate), dateMap, setDateMap];
};

export default useDateRange;
