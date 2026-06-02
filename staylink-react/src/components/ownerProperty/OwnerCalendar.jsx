import React from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import interactionPlugin from "@fullcalendar/interaction";

const OwnerCalendar = ({
  calendarData,
  onSingleDateSelect,
  onRangeSelect,
  onBlockedDateClick,
}) => {

  // =========================
  // LOADING
  // =========================

  if (!calendarData) {
    console.log(calendarData);

    return (

      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-2xl">

        <div className="text-center">

          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>

          <p className="mt-3 text-gray-500 font-medium">
            Loading calendar...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // SAFE DATA
  // =========================

  const bookings =
    calendarData?.bookings || [];

  const blockedDates =
    calendarData?.blocked_dates || [];

  // =========================
  // BOOKINGS
  // =========================

 const bookingEvents =
  bookings.map((b) => ({

    id: `booking-${b.id}`,

    title: `🏠 ${b.traveler_name}`,

    start: b.check_in,

    end: b.check_out,

    color: "#ef4444",

    editable: false,

    display: "block",

    extendedProps: {

      isBooking: true,

      traveler: b.traveler_name,

      status: b.status,
    }
  }));

  // =========================
  // SORT BLOCKED DATES
  // =========================

  const sortedBlockedDates =
    [...blockedDates].sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );

  // =========================
  // GROUP CONTINUOUS DATES
  // =========================

  const groupedBlockedEvents = [];

  let currentGroup = null;

  sortedBlockedDates.forEach(
    (block, index) => {

      if (!currentGroup) {

        currentGroup = {

          ids: [block.id],

          start: block.date,

          end: block.date,

          note:
            block.note || "",

          block_type:
            block.block_type,
        };

      } else {

        const prevDate =
          new Date(
            currentGroup.end
          );

        prevDate.setDate(
          prevDate.getDate() + 1
        );

        const currentDate =
          new Date(block.date);

        const isContinuous =
          prevDate.toDateString() ===
          currentDate.toDateString();

        const sameType =
          currentGroup.block_type ===
          block.block_type;

        const sameNote =
          currentGroup.note ===
          (block.note || "");

        if (
          isContinuous &&
          sameType &&
          sameNote
        ) {

          currentGroup.ids.push(
            block.id
          );

          currentGroup.end =
            block.date;

        } else {

          groupedBlockedEvents.push(
            currentGroup
          );

          currentGroup = {

            ids: [block.id],

            start: block.date,

            end: block.date,

            note:
              block.note || "",

            block_type:
              block.block_type,
          };
        }
      }

      if (
        index ===
        sortedBlockedDates.length - 1
      ) {

        groupedBlockedEvents.push(
          currentGroup
        );
      }
    }
  );

  // =========================
  // FINAL BLOCK EVENTS
  // =========================

  const blockedEvents =
    groupedBlockedEvents.map(
      (block, index) => {

        const endDate =
          new Date(block.end);

        // FullCalendar exclusive end
        endDate.setDate(
          endDate.getDate() + 1
        );

        return {

          id: `blocked-${index}`,

          title:
            block.block_type ===
            "maintenance"
              ? "🔧 Maintenance"
              : "🚫 Blocked",

          start: block.start,

          end:
            endDate
              .toISOString()
              .split("T")[0],

          color: "#9ca3af",

          allDay: true,

          editable: false,

          display: "block",

          className:
            "blocked-event",

          extendedProps: {

            ids: block.ids,

            note: block.note,

            block_type:
              block.block_type,

            isBlocked: true,
          },
        };
      }
    );

  // =========================
  // ALL EVENTS
  // =========================

  const allEvents = [
    ...bookingEvents,
    ...blockedEvents,
  ];

  return (

    <div className="owner-calendar-wrapper">

      <style>{`

        .owner-calendar-wrapper .fc {
          --fc-border-color: #e5e7eb;
          --fc-button-bg-color: #f3f4f6;
          --fc-button-border-color: #d1d5db;
          --fc-button-hover-bg-color: #e5e7eb;
          --fc-button-active-bg-color: #3b82f6;
          --fc-button-text-color: #374151;
          --fc-today-bg-color: #eff6ff;
          --fc-highlight-color: rgba(59, 130, 246, 0.1);
        }

        .owner-calendar-wrapper .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .owner-calendar-wrapper .fc .fc-button-primary {
          background-color: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
          font-weight: 500;
          text-transform: capitalize;
          transition: all 0.2s;
        }

        .owner-calendar-wrapper .fc .fc-button-primary:hover {
          background-color: #e5e7eb;
          border-color: #9ca3af;
        }

        .owner-calendar-wrapper .fc .fc-button-primary.fc-button-active {
          background-color: #3b82f6 !important;
          border-color: #2563eb !important;
          color: white !important;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-day.fc-day-today {
          background-color: #eff6ff;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-day-number {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          color: #2563eb;
          font-weight: 700;
        }

        .owner-calendar-wrapper .booking-event {
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 6px;
          border-left: 3px solid #dc2626;
        }

        .owner-calendar-wrapper .blocked-event {
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 2px 6px;
          border-left: 3px solid #6b7280;
          opacity: 0.9;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-day-frame {
          cursor: pointer;
          transition: background-color 0.15s;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-day-frame:hover {
          background-color: #f9fafb;
        }

        .owner-calendar-wrapper .fc .fc-highlight {
          background-color: rgba(59, 130, 246, 0.08);
          border-radius: 8px;
        }

        .owner-calendar-wrapper .fc .fc-daygrid-event {
          margin: 2px 4px;
          border-radius: 6px;
        }

      `}</style>

      <div className="bg-white rounded-2xl shadow-lg p-6">

        <FullCalendar

          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}

          initialView="dayGridMonth"

          selectable={true}

          selectMirror={true}

          editable={false}

          displayEventTime={false}

          unselectAuto={true}

          selectOverlap={false}

          eventDisplay="block"

          height="auto"

          headerToolbar={{
            left:
              "prev,next today",

            center: "title",

            right:
              "dayGridMonth",
          }}

          buttonText={{
            today: "Today",
            month: "Month",
          }}

          events={allEvents}

          // =========================
          // SINGLE CLICK
          // =========================

          dateClick={(info) => {

            // prevent click on event
            if (
              info.jsEvent.target.closest(
                ".fc-event"
              )
            ) {
              return;
            }

            onSingleDateSelect(info);
          }}

          // =========================
          // RANGE SELECT
          // =========================

          select={(info) => {

            const selectedStart =
              new Date(
                info.startStr
              );

            const selectedEnd =
              new Date(
                info.endStr
              );

            // CHECK BLOCK OVERLAP

            const blockedSelection =
              blockedEvents.filter(
                (event) => {

                  const eventStart =
                    new Date(
                      event.start
                    );

                  const eventEnd =
                    new Date(
                      event.end
                    );

                  return (
                    eventStart <
                      selectedEnd &&
                    eventEnd >
                      selectedStart
                  );
                }
              );

            // OPEN EDIT MODAL
            // IF BLOCK EXISTS

            if (
              blockedSelection.length >
              0
            ) {

              const allIds =
                blockedSelection.flatMap(
                  (event) =>
                    event
                      .extendedProps
                      .ids
                );

              const firstEvent =
                blockedSelection[0];

              const endDateObj =
                new Date(
                  firstEvent.end
                );

              endDateObj.setDate(
                endDateObj.getDate() -
                  1
              );

              const fixedEnd =
                endDateObj
                  .toISOString()
                  .split("T")[0];

              onBlockedDateClick({

                ids: allIds,

                start:
                  firstEvent.start,

                end: fixedEnd,

                note:
                  firstEvent
                    .extendedProps
                    .note,

                block_type:
                  firstEvent
                    .extendedProps
                    .block_type,
              });

              info.view.calendar.unselect();

              return;
            }

            onRangeSelect(info);
          }}

          // =========================
          // EVENT CLICK
          // =========================

          eventClick={(
            clickInfo
          ) => {

            const event =
              clickInfo.event;

            if (
              event.extendedProps
                .isBlocked
            ) {

              const endDateObj =
                new Date(
                  event.endStr
                );

              endDateObj.setDate(
                endDateObj.getDate() -
                  1
              );

              const fixedEnd =
                endDateObj
                  .toISOString()
                  .split("T")[0];

              onBlockedDateClick({

                ids:
                  event
                    .extendedProps
                    .ids,

                start:
                  event.startStr,

                end: fixedEnd,

                note:
                  event
                    .extendedProps
                    .note,

                block_type:
                  event
                    .extendedProps
                    .block_type,
              });
            }
          }}

        />

      </div>

    </div>
  );
};

export default OwnerCalendar;