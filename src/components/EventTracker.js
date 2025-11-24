import React, { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CustomToolbar from "./CustomToolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function toLocalInputValue(dateString) {
  const d = new Date(dateString); // your RBC event date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const Model = ({
  close,
  addEvent,
  deleteEvent,
  startDate,
  existing_event,
  openModel,
}) => {
  const [event, setEvent] = React.useState({
    title: "",
    location: "",
    start: new Date(startDate),
    end: new Date(startDate),
  });
  useEffect(() => {
    if (!existing_event) {
      setEvent({
        title: "",
        location: "",
        start: new Date(startDate),
        end: new Date(startDate),
      });
    } else {
      setEvent(existing_event);
    }
  }, [existing_event]);

  const [isEdit, setIsEdit] = React.useState(false);

  return (
    <div className="modal">
      <div className="modal-header">
        <h3>
          {existing_event
            ? isEdit
              ? "Edit Event"
              : existing_event.title
            : "Create Event"}
        </h3>
        <button onClick={close} className="btn-close">
          X
        </button>
      </div>
      {(openModel === "ADD_EVENT" || isEdit) && (
        <>
          <div className="input-container">
            <input
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              value={event.title}
              placeholder="Event Title"
            />
            <input
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              value={event.location}
              placeholder="Event Location"
            />
            <input
              type="date"
              value={toLocalInputValue(event.end)}
              onChange={(e) =>
                setEvent({ ...event, end: new Date(e.target.value) })
              }
            />
          </div>
          <div className="btn-container mm-popup__box__footer__right-space">
            <button onClick={close}>Cancel</button>
            <button
              className="btn-save mm-popup__btn"
              onClick={() => {
                addEvent(event);
                close();
              }}
            >
              Save
            </button>
          </div>
        </>
      )}

      {openModel === "EDIT_EVENT" && !isEdit && (
        <>
          <div>
            <p>Date: {new Date(event.start).toDateString()}</p>
            <p>Location: {event.location}</p>
          </div>
          <div
            className="btn-container"
            style={{ justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              className=".mm-popup__btn--info"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
            <button
              className="btn-delete mm-popup__btn--danger"
              onClick={() => deleteEvent(existing_event.id)}
            >
              delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
const EventTracker = () => {
  const [openModel, setOpenModel] = React.useState("");
  const [myEventsList, setMyEventsList] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [existing_event, setExistingEvent] = React.useState(null);

  const [option, setOption] = React.useState("all");
  const allEvents = useMemo(() => {
    if (option === "all") {
      return myEventsList;
    } else if (option === "past") {
      return myEventsList.filter((event) => new Date(event.start) < new Date());
    } else if (option === "upcoming") {
      return myEventsList.filter((event) => new Date(event.start) > new Date());
    }
  }, [option, myEventsList]);

  const closeModel = () => {
    setOpenModel("");
    setExistingEvent(null);
    setSelectedDate(null);
  };
  const addEvent = (event) => {
    if (openModel === "EDIT_EVENT") {
      setMyEventsList(myEventsList.map((e) => (e.id === event.id ? event : e)));
    } else {
      setMyEventsList([
        ...myEventsList,
        { ...event, id: myEventsList.length + 1 },
      ]);
    }

    closeModel();
    if (existing_event) {
      setExistingEvent(null);
    }
  };

  const deleteEvent = (id) => {
    setMyEventsList(myEventsList.filter((event) => event.id !== id));
    closeModel();
  };

  const CustomEvent = ({ event }) => {
    return (
      <div
        style={{
          backgroundColor:
            new Date(event.start) > new Date()
              ? "var(--green-color)"
              : "var(--pink-color)",
          padding: "3px 4px",
          borderRadius: "5px",
        }}
      >
        <strong>{event.title}</strong>
      </div>
    );
  };
  const CustomDateHeader = ({ label, date, selectedDate, openPopup }) => {
    const isSelected =
      selectedDate &&
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate();

    return (
      <div>
        <div>{label}</div>

        {isSelected && (
          <button className="btn" style={{ marginTop: 4 }} onClick={openPopup}>
            Create Event
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      {openModel && (
        <Model
          close={closeModel}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          startDate={selectedDate}
          existing_event={existing_event}
          openModel={openModel}
        />
      )}
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          toolbar: ({ label, onNavigate }) => (
            <CustomToolbar
              label={label}
              onNavigate={onNavigate}
              setOption={setOption}
            />
          ),
          event: CustomEvent,
          month: {
            dateHeader: (props) => (
              <CustomDateHeader
                {...props}
                selectedDate={selectedDate}
                openPopup={() => {
                  setExistingEvent(null);
                  setOpenModel("ADD_EVENT");
                }}
              />
            ),
          },
        }}
        onSelectEvent={(e) => {
          setExistingEvent(e);
          setOpenModel("EDIT_EVENT");
        }}
        onSelectSlot={(slotInfo) => {
          setSelectedDate(new Date(slotInfo.start));
        }}
        // Click on date header
        // onDrillDown={(date) => {
        //   setExistingEvent(null);
        //   setSelectedDate(date);
        //   setOpenModel("ADD_EVENT");
        // }}
        selectable
      />
    </div>
  );
};

export default EventTracker;
