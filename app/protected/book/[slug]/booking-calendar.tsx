"use client";

import { useMemo, useState } from "react";
import { fromZonedTime } from "date-fns-tz";

type Booking = {
  starts_at: string;
  ends_at: string;
};

type Props = {
  roomName: string;
  existingBookings: Booking[];
  hoursRemaining: number;
  createBooking: (formData: FormData) => Promise<any>;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookingCalendar({
  roomName,
  existingBookings,
  hoursRemaining,
  createBooking,
}: Props) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<1 | 2>(1);

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const mondayOffset = (firstDay.getDay() + 6) % 7;

    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < mondayOffset; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return calendarDays;
  }, [currentMonth]);

  function isPastDay(date: Date) {
    const check = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return check < todayStart;
  }

  function moreThan30DaysAhead(date: Date) {
    const limit = new Date();

    limit.setHours(23, 59, 59, 999);
    limit.setDate(limit.getDate() + 30);

    return date > limit;
  }

  function isTimeUnavailable(time: string) {
    if (!selectedDate) return true;

    const start = fromZonedTime(
  `${selectedDate}T${time}:00`,
  "Europe/London"
);

    const end = new Date(
      start.getTime() + duration * 60 * 60 * 1000
    );

    if (start.getTime() <= Date.now()) {
      return true;
    }

    return existingBookings.some((booking) => {
      const existingStart = new Date(booking.starts_at);
      const existingEnd = new Date(booking.ends_at);

      return start < existingEnd && end > existingStart;
    });
  }

  const monthTitle = currentMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
        "en-GB",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
        }
      )
    : "Choose a date";

  return (
    <div className="mt-12">

      {/* BOOKING GRID */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

        {/* CALENDAR */}
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

          <div className="flex items-center justify-between">

            <button
              type="button"
              onClick={() => {
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                );
                setSelectedDate(null);
                setSelectedTime(null);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-[#d6a85f]"
              aria-label="Previous month"
            >
              ←
            </button>

            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                Calendar
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {monthTitle}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                );
                setSelectedDate(null);
                setSelectedTime(null);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-[#d6a85f]"
              aria-label="Next month"
            >
              →
            </button>

          </div>


          {/* DAYS OF WEEK */}
          <div className="mt-10 grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-wider text-white/25">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>


          {/* CALENDAR DAYS */}
          <div className="mt-4 grid grid-cols-7 gap-2">

            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="aspect-square"
                  />
                );
              }

              const key = formatDateKey(date);

              const disabled =
                isPastDay(date) || moreThan30DaysAhead(date);

              const selected = selectedDate === key;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSelectedDate(key);
                    setSelectedTime(null);
                  }}
                  className={[
                    "aspect-square rounded-2xl border text-sm font-medium transition duration-200",
                    selected
                      ? "border-[#d6a85f] bg-[#d6a85f] text-black shadow-[0_0_0_1px_rgba(214,168,95,0.2)]"
                      : "border-white/10 bg-black/30 text-white/75",
                    disabled
                      ? "cursor-not-allowed opacity-15"
                      : "hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-white",
                  ].join(" ")}
                >
                  {date.getDate()}
                </button>
              );
            })}

          </div>


          {/* CALENDAR FOOTER */}
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">

            <span className="h-2.5 w-2.5 rounded-full bg-[#d6a85f]" />

            <p className="text-xs text-white/35">
              Select a date within the next 30 days.
            </p>

          </div>

        </section>


        {/* BOOKING OPTIONS */}
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">

          {/* SELECTED DATE */}
          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
              Selected date
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {selectedDateLabel}
            </h2>

          </div>


          {/* AVAILABLE TIMES */}
          <div className="mt-10">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Availability
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Available times
                </h3>
              </div>

              {selectedDate && (
                <span className="text-xs text-[#d6a85f]/70">
                  Choose one
                </span>
              )}

            </div>


            <div className="mt-5 grid grid-cols-2 gap-3">

              {times.map((time) => {
                const unavailable = isTimeUnavailable(time);
                const selected = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setSelectedTime(time)}
                    className={[
                      "rounded-2xl border px-4 py-3.5 text-sm font-medium transition duration-200",
                      selected
                        ? "border-[#d6a85f] bg-[#d6a85f] text-black"
                        : "border-white/10 bg-black/30 text-white/70",
                      unavailable
                        ? "cursor-not-allowed opacity-15"
                        : "hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-white",
                    ].join(" ")}
                  >
                    {time}
                  </button>
                );
              })}

            </div>

          </div>


          {/* SESSION LENGTH */}
          <div className="mt-9 border-t border-white/10 pt-8">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Session
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Session length
                </h3>
              </div>

              <span className="text-xs text-white/30">
                {hoursRemaining} hr
                {hoursRemaining !== 1 ? "s" : ""} remaining
              </span>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setDuration(1);
                  setSelectedTime(null);
                }}
                className={[
                  "rounded-2xl border px-4 py-4 text-sm font-semibold transition",
                  duration === 1
                    ? "border-[#d6a85f] bg-[#d6a85f] text-black"
                    : "border-white/10 bg-black/30 text-white/70 hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-white",
                ].join(" ")}
              >
                <span className="block text-base">
                  1 hour
                </span>

                <span
                  className={[
                    "mt-1 block text-xs",
                    duration === 1
                      ? "text-black/60"
                      : "text-white/30",
                  ].join(" ")}
                >
                  Standard session
                </span>
              </button>


              <button
                type="button"
                disabled={hoursRemaining < 2}
                onClick={() => {
                  setDuration(2);
                  setSelectedTime(null);
                }}
                className={[
                  "rounded-2xl border px-4 py-4 text-sm font-semibold transition",
                  duration === 2
                    ? "border-[#d6a85f] bg-[#d6a85f] text-black"
                    : "border-white/10 bg-black/30 text-white/70 hover:border-[#d6a85f]/50 hover:bg-[#d6a85f]/10 hover:text-white",
                  hoursRemaining < 2
                    ? "cursor-not-allowed opacity-20"
                    : "",
                ].join(" ")}
              >
                <span className="block text-base">
                  2 hours
                </span>

                <span
                  className={[
                    "mt-1 block text-xs",
                    duration === 2
                      ? "text-black/60"
                      : "text-white/30",
                  ].join(" ")}
                >
                  Extended session
                </span>
              </button>

            </div>

          </div>


          {/* CONFIRMATION */}
          <form action={createBooking} className="mt-9">

            <input
              type="hidden"
              name="date"
              value={selectedDate ?? ""}
            />

            <input
              type="hidden"
              name="time"
              value={selectedTime ?? ""}
            />

            <input
              type="hidden"
              name="duration"
              value={duration}
            />


            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="group flex w-full items-center justify-between rounded-full bg-[#d6a85f] px-6 py-4 font-semibold text-black transition hover:bg-[#e0b873] disabled:cursor-not-allowed disabled:opacity-20"
            >
              <span>
                Confirm booking
              </span>

              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>

          </form>


          <p className="mt-4 text-center text-xs leading-5 text-white/30">
            Your booking will use {duration} membership hour
            {duration !== 1 ? "s" : ""}.
          </p>

        </section>

      </div>


      {/* BOOKING SUMMARY */}
      <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-5 md:px-8">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
              Booking summary
            </p>

            <p className="mt-2 text-sm text-white/50">
              {selectedDate && selectedTime
                ? `${selectedDateLabel} at ${selectedTime}`
                : "Choose a date and time to continue"}
            </p>

          </div>


          <div className="flex items-center gap-3">

            <span className="h-2.5 w-2.5 rounded-full bg-[#d6a85f]" />

            <span className="text-sm text-white/40">
              {duration} hour
              {duration !== 1 ? "s" : ""} session
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}