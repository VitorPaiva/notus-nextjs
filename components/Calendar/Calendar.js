import React from 'react';

import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import Calendar from '@toast-ui/react-calendar';


export default (props) => <Calendar {...props} ref={props.forwardRef}/>