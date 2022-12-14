import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css"; // styling for calendar
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

import Nav from './components/Nav';
import Home from './components/Home';
import Tweets from './components/Tweets';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";


const locales = {
  "en-US": require("date-fns/locale/en-US")
}
// import { fetchEvents } from "./gcal";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})


// * @reminder Remember that for Java Dates, the month is 0-indexed, so 0 is January, 1 is February, etc.
const events = [
  {
    title: "Big Meeting",
    allDay: true,
    start: new Date(2022, 7, 14),
    end: new Date(2022, 7, 14)
  },
  {
    title: "Conference",
    start: new Date(2022, 7, 16),
    end: new Date(2022, 7, 16)
  },
  {
    title: "School",
    start: new Date(2022, 7, 30),
    end: new Date(2022, 7, 30)
  }
];

function App() {

  const [newEvent, setNewEvent] = useState({title: "", start: "", end: ""});
  const [allEvents, setAllEvents] = useState(events); // default is the hardcoded events
  const [list, setList] = useState([]);

  // const calendarId = process.env.REACT_APP_CALENDAR_ID;
  // const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  // const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;

  function handleAddEvent() {
    console.log(newEvent);
    console.log(allEvents);
    setAllEvents([...allEvents, newEvent]); // @reminder spread all current events and add new event
    setNewEvent({title: "", start: "", end: ""}); // reset new event
  }

  function handlePrintEvents() {
    console.log(allEvents);
  }

  function handleFetchEvents() {
    console.log('Test');
  }


  return (
    <Router>
    <div className="App">
      
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/tweets" element={<Tweets/>} />
      </Routes>

      <h1>Isaac's Calendar</h1>

      <button style={{margin: "10px"}} onClick={handlePrintEvents}>Print Events</button>
      <button style={{margin: "10px"}} onClick={handleFetchEvents}>Fetch Events</button>

      <h2>Add New Event</h2>

      <div>
        <h1>Things to Learn</h1>
        <button
          type="button"
          onClick={() => {
            fetch("http://localhost:8000/")
            .then(response => response.json())
            .then(payload => {
              console.log(payload);
              setList(payload);
            })
          }}
          >Fetch List</button>

      <ol>
        {list.map((row, idx) => {
          return (
          <li key={idx}><a href={row.url}>{row.label}</a></li>
          )
        })}
      </ol>

      </div>
      
      <div>
        <input type="text" placeholder="Add Title" style={{width: "20%", marginRight: "10px"}}
          value = {newEvent.title}
          onChange = {(e) => setNewEvent({...newEvent, title: e.target.value})}
        />
        <DatePicker placeholderText="Start Date" 
          style={{marginRight: "10px"}}
          selected = {newEvent.start}
          onChange = {(start) => setNewEvent({...newEvent, start: start})} />
        <DatePicker placeholderText="End Date"
          selected = {newEvent.end}
          onChange = {(end) => setNewEvent({...newEvent, end: end})} />
        
        <button style={{marginTop: "10px"}} onClick={handleAddEvent}>Add Event</button>

      </div>

      <Calendar localizer={localizer} 
      events={allEvents} 
      startAccessor="start" 
      endAccessor="end" 
      style={{height: 500, margin: "50px"}}/>
    
  </div>
  </Router>
  );
}

export default App;
