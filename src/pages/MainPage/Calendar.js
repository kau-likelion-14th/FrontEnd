import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import "../../styles/Calendar.css";

export default function CustomCalendar({initialDate=new Date(), onDateChange}) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];
        setSelectedDate(next);
        onDateChange?.(next);
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={selectedDate}
                calendarType='gregory'
                view='month'
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
            />
        </div>
    );
}