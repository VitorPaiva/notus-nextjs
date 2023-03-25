import React, { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Default from "layouts/Default.js";
import moment from "moment";
import "styles/calendar.module.css"
import CheckBox from "components/CheckBox/CheckBox";

const TuiCalendar = dynamic(() => import('components/Calendar/Calendar'), {
  ssr: false
})

const Calendar = React.forwardRef((props, ref) => <TuiCalendar {...props} forwardRef={ref}/>)

export default function Schedule() {
  const calendarRef = useRef(null);
  const getCalInstance = useCallback(() => calendarRef.current?.getInstance?.(), []);
  
  const calendars = [
    {
      id: "1",
      name: "Vitor",
      color: "#ffffff",
      backgroundColor: "#9e5fff",
      dragBackgroundColor: "#9e5fff",
      borderColor: "#9e5fff"
    },
    {
      id: "2",
      name: "Hugo",
      color: "#ffffff",
      backgroundColor: "#00a9ff",
      dragBackgroundColor: "#00a9ff",
      borderColor: "#00a9ff"
    },
    {
      id: "VG92y6NZkMgDR7Gbspl9eCZdAo63",
      name: "Test",
      color: "#ffffff",
      backgroundColor: "#ffa9ff",
      dragBackgroundColor: "#ffa9ff",
      borderColor: "#ffa9ff"
    }
  ];

  const [events, setEvents] = useState([])
  const [hours, setHours] = useState()
  const [alternativeView, setAlternativeView] = useState('day')
  
  const onBeforeCreateEvent = (e) => {
    getCalInstance().createEvents([e])
  }

  const onBeforeUpdateEvent = ({event, changes}) => {
    console.log(changes)
    getCalInstance().updateEvent(event.id, event.calendarId, changes)
  }

  const onBeforeDeleteEvent = (e) => {
    getCalInstance().deleteEvent(e.id, e.calendarId)
  }

  useEffect(() => {
    fetch('http://localhost:3000/employees/VG92y6NZkMgDR7Gbspl9eCZdAo63')
      .then(response => response.json())
      .then(async employee => {
          setHours(employee.schedules.reduce((prev, schedule) => {
              const values = schedule.times.reduce((prev, time) => {
                const start = parseInt(time.start.split(':')[0])
                const end = parseInt(time.end.split(':')[0])
                prev.start = prev.start < start ? prev.start : start
                prev.end = prev.end > end ? prev.end : end
                return prev
              }, {start: 25, end: 0})
              prev.start = prev.start < values.start ? prev.start : values.start
              prev.end = prev.end > values.end ? prev.end : values.end
              return prev
            }, {start: 25, end: 0}))
          employee.locations = await Promise.all(employee.appointments
            .reduce((a,b) => a.includes(b.location_id) ? a : [...a,b.location_id], [])
            .map(async (id) => (await (await fetch(`http://localhost:3000/locations/${id}`)).json())))
          return employee
        })
      .then(employee => setEvents(() => {
        return employee.appointments.map((appointment) => {
          const location = employee.locations.find(location => location.id == appointment.location_id)
          const service = location.services.find(service => service.id == appointment.service_id)
          return {
            id: appointment.id,
            calendarId: 'VG92y6NZkMgDR7Gbspl9eCZdAo63',
            title: `${service.name}:${appointment.name}`,
            location: location.name,
            category: 'time',
            start: appointment.date,
            end: moment(appointment.date).add(service.duration, 'minutes')
          }
        })
      }))
  }, [])

  const changeRenderText = () => {
    const calendar = getCalInstance()
    const view = calendar.getViewName()
    if(view === 'week') 
      setRenderRange(moment(calendar.getDateRangeStart().toDate()).format('DD-MM-YYYY'))
  }

  return (
    <>
    asd
      {
        /* 
        <div className="bg-slate-100 border-r border-slate-700 pt-12 px-4">
          {
            calendars.map((calendar, index) => 
              <CheckBox className="mt-1" value={true} color={calendar.backgroundColor} onClick={(state) => getCalInstance().setCalendarVisibility(calendar.id, state)}>
                <div className="text-sm">{calendar.name}</div>
              </CheckBox>
            )
          }
        </div>
        */
      }
      <div className="flex justify-center h-[calc(100vh-200px)] overflow-hidden border-slate-700 border-b">
        <div className="w-full">
          <div className="flex bg-slate-100 border-b border-slate-700 justify-between">
            <div className="ml-4">
              <button className="text-sm font-semibold border-slate-700 border-2 p-2 px-3 rounded-md my-4 mx-1 text-slate-700 transition-all hover:bg-slate-700 hover:text-white" onClick={() => {
                getCalInstance().changeView(alternativeView)
                setAlternativeView(alternativeView === 'day' ? 'week' : 'day')
              }}>{alternativeView.toUpperCase()}</button>
            </div>
            <div className="font-semibold">
              <button className="text-sm border-slate-700 border-2 p-2 px-3 rounded-l-md my-4 text-slate-700 transition-all hover:bg-slate-700 hover:text-white" onClick={() => {
                getCalInstance().prev()
              }}><i className="fas fa-chevron-left"></i></button>
              <button className="uppercase text-sm border-slate-700 border-y-2 p-2 px-3 my-4 text-slate-700 transition-all hover:bg-slate-700 hover:text-white" onClick={() => {
                getCalInstance().today()
              }}>Today</button>
              <button className="text-sm border-slate-700 border-2 p-2 px-3 rounded-r-md my-4 text-slate-700 transition-all hover:bg-slate-700 hover:text-white" onClick={() => {
                getCalInstance().next()
              }}><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="mr-4">
              <button className="text-sm border-slate-700 border-2 p-2 px-3 rounded-full my-4 mx-1 text-slate-700 transition-all opacity-0 cursor-default">{alternativeView.toUpperCase()}</button>
            </div>
          </div>
          <div className="border-slate-700 border-l border-r h-full">
            <Calendar 
              ref={calendarRef}
              height={'100%'}
              view="week"
              week={{
                taskView: false,
                eventView: ['time'],
                hourStart: hours?.start-1,
                hourEnd: hours?.end+1
              }}
              events={events.sort((a, b) => a.calendarId > b.calendarId ? 1 : -1)}
              gridSelection={true}
              useFormPopup={true}
              useDetailPopup={true}
              calendars={calendars}
              usageStatistics={false}
              onBeforeDeleteEvent={onBeforeDeleteEvent}
              onBeforeUpdateEvent={onBeforeUpdateEvent}
              onBeforeCreateEvent={onBeforeCreateEvent}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Schedule.layout = Default;
