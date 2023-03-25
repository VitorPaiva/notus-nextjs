import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import StepWizard from "react-step-wizard";
import moment from "moment";
import 'animate.css'
// layout for page

import Auth from "layouts/Auth.js";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticPaths = async () => {

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"]))
    },
  };
}

export default function OrgPage() {
  const router = useRouter()
  const { slug } = router.query
  
  const { t } = useTranslation();

  const [organization, setOrganization] = useState()
  const [location, setLocation] = useState()
  const [service, setService] = useState()
  const [employee, setEmployee] = useState()
  const [schedule, setSchedule] = useState()
  const [timesList, setTimesList] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3000/companies/${slug}`)
        .then(res => res.json())
        .then(json => setOrganization(() => {
          if (json?.locations.length === 1) setLocation(json.locations[0])
          
          return json
        }))
  }, [])

  useEffect(() => {
    const times = schedule?.times
    const lowest_duration_service = location?.services.reduce((a,b) => a.duration > b.duration ? b : a)
    const list = []
    if (times) {
      const work = times.find(({is_break}) => !is_break)
      const break_hours = times.find(({is_break}) => is_break)
      const hours = {
        work: {
          start: moment(`${schedule.date} ${work.start}`),
          end: moment(`${schedule.date} ${work.end}`),
        },
        break: {
          start: moment(`${schedule.date} ${break_hours.start}`),
          end: moment(`${schedule.date} ${break_hours.end}`),
        }
      }
      while(hours.work.start.clone().add(service.duration, 'minutes').isSameOrBefore(hours.work.end)) {
        const appointment = employee.appointments.find(({date}) => moment(date).isSame(hours.work.start))

        /**
         *  This code removes every hour that if making an appointment would overlap and existing appointment
         *  Example: 
         *    Revervation of 30 minutes has been made for 11:00
         *    Lowest service duration is 30 minutes but selected service duration is 60 minutes
         *    10:30 time should be removed, since it would overlap an existing appointment
         */
        if(appointment) {
          const duration = location.services.find(service => service.id == appointment.service_id).duration
          const times = list.filter((time) => 
            time.clone().add(service.duration, 'minutes').isSame(moment(appointment.date).add(duration, 'minutes'))
          )
          
          for(let i = list.length - 1; i >= 0; i--){
            if(times.indexOf(list[i]) >= 0) list.splice(i, 1)
          }
        }

        //  Add time if no appointment for that time has been made and if a appointment would be made it would 
        //  finish at the end of the shift and wouldn't overlap with a break
        if((!appointment) && 
           (hours.work.start.clone().add(service.duration, 'minutes').isSameOrBefore(hours.break.start) || hours.work.start.isSameOrAfter(hours.break.end)))
          list.push(hours.work.start.clone())
        
        hours.work.start.add(lowest_duration_service.duration, 'minutes')
      }
      setTimesList(list)
    }

    if(!schedule) {
      setTimesList([])
    }
  }, [schedule])

  let animations = {
    enterRight: 'animate__animated animate__fadeIn delay-300ms',
    enterLeft : 'animate__animated animate__fadeIn delay-300ms',
    exitRight : 'animate__animated animate__fadeOut duration-300ms',
    exitLeft  : 'animate__animated animate__fadeOut duration-300ms'
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4 overflow-hidden">
            <div className="relative flex flex-col justify-center min-w-0 break-words w-full min-h-[250px] mb-6 shadow-lg rounded-lg bg-slate-200 border-0 p-10">
              <div className="text-center">
                <StepWizard transitions={animations}>
                  <Location data={organization} set={setLocation} />
                  <Service data={location} set={setService} />
                </StepWizard>
                {/*
                  schedule ? <>
                  <button
                      onClick={() => setSchedule(undefined)}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      {t('Back')}
                    </button>
                  {timesList.map((time, index) => 
                    <button
                      key={`time_${index}`}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                    >
                      {time.format('HH:mm')}
                    </button>
                  )}
                  </>
                  :employee ? <>
                  <button
                      onClick={() => setEmployee(undefined)}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      {t('Back')}
                    </button>
                  {employee.schedules.map((schedule, index) => 
                    <button
                      key={`schedule_${index}`}
                      onClick={() => setSchedule(schedule)}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                    >
                      {schedule.date}
                    </button>
                  )}
                  </>
                  : service ? 
                  <>
                  <button
                      onClick={() => setService(undefined)}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      {t('Back')}
                    </button>
                  {service.employees.map(employee => 
                    <button
                      key={`employee_${employee.id}`}
                      onClick={() => setEmployee(employee)}
                      className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                    >
                      {employee.name}
                    </button>
                  )}
                  </> : location ?  
                    location.services.map(service => 
                      <button
                        key={`service_${service.id}`}
                        onClick={() => setService(service)}
                        className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        {service.name}
                      </button>
                    ) : organization?.locations.map(location => 
                      <button
                        key={`location_${location.id}`}
                        onClick={() => setLocation(location)}
                        className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        {location.name}
                      </button>
                  )
                    */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Location = props => {
  const set = (data) => {
    props.set(data)
    props.nextStep()
  }

  return (
    <>
      { 
        props.data?.locations.map(location => 
          <button
            key={`location_${location.id}`}
            onClick={() => set(location)}
            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
            type="button"
          >
            {location.name}
          </button>
        )
      }
    </>
  )
}

const Service = props => {
  const set = (data) => {
    props.set(data)
    props.previousStep()
  }

  return (
    <>
      {
        props.data?.services.map(service => 
          <button
            key={`service_${service.id}`}
            onClick={() => set(service)}
            className="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
            type="button"
          >
            {service.name}
          </button>
        )
      }
    </>
  )
}

OrgPage.layout = Auth;
