import { useEffect, useState } from "react";

import {
  DateRange
} from "react-date-range";

import {
  getPropertyCalendar
} from "../../services/bookingService";

import "react-date-range/dist/styles.css";

import "react-date-range/dist/theme/default.css";


const AvailabilityCalendar = ({
  propertyId
}) => {

  const [blockedDates, setBlockedDates] =
    useState([]);

  const [reservedDates, setReservedDates] =
    useState([]);

  const [holdDates, setHoldDates] =
    useState([]);

  const [selection, setSelection] =
    useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);

  // =====================================
  // LOAD CALENDAR
  // =====================================

  useEffect(() => {

    loadCalendar();

  }, [propertyId]);


  const loadCalendar = async () => {

    try {

      const data =
        await getPropertyCalendar(
          propertyId
        );

      setBlockedDates(
        data.blocked_dates || []
      );

      setReservedDates(
        data.reserved_dates || []
      );

      setHoldDates(
        data.hold_dates || []
      );

    } catch (error) {

      console.log(error);
    }
  };

  // =====================================
  // DISABLE DATES
  // =====================================

  const disabledDates = [

    ...blockedDates,

    ...reservedDates,

    ...holdDates,

  ].map(
    (date) => new Date(date)
  );

  return (

    <div>

      <DateRange

        editableDateInputs={true}

        onChange={(item) =>
          setSelection([
            item.selection,
          ])
        }

        moveRangeOnFirstSelection={false}

        ranges={selection}

        disabledDates={
          disabledDates
        }

        minDate={new Date()}
      />
    </div>
  );
};

export default AvailabilityCalendar;