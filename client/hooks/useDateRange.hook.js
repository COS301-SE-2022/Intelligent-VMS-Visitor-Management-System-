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

const useDateRange = (start, range) => {
    const [startDate, setStartDate] = useState(new Date(start));
    const [endDate, setEndDate] = useState(new Date(start));
    const [dateMap, setDateMap] = useState(new Map());

    useEffect(() => {
        if(endDate instanceof Date) {
            endDate.setFullYear(startDate.getFullYear());
            endDate.setMonth(startDate.getMonth());
            endDate.setDate(startDate.getDate() + range);
            console.log(startDate, endDate);
            dateMap.clear();
            for(let i = 0; i < range; i++) {
                const dateKey = new Date(startDate);
                dateKey.setDate(startDate.getDate() + i);
                dateMap.set(getFormattedDateString(dateKey), 0);
            }
        }
    }, [endDate, startDate, range, dateMap, start]);

    return [getFormattedDateString(startDate), getFormattedDateString(endDate), dateMap, setDateMap, setStartDate];
};

export default useDateRange;
