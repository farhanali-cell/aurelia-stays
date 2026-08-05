// src/components/DateRangePicker.jsx
import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const fmtISO = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`
    : "";

export const fmtDisplay = (d) =>
  d
    ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

const DateRangePicker = ({ checkIn, checkOut, onChange, minDate }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(checkIn || new Date());
  const wrapperRef = useRef(null);

  const today = startOfDay(minDate || new Date());

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (date) => {
    if (date < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: date, checkOut: null });
      return;
    }
    if (date <= checkIn) {
      onChange({ checkIn: date, checkOut: null });
      return;
    }
    onChange({ checkIn, checkOut: date });
    setOpen(false);
  };

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());

  const goPrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const inRange = (date) =>
    checkIn && checkOut && date > checkIn && date < checkOut;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-3 text-left hover:border-gold/40 transition-colors"
      >
        <CalendarDays size={20} className="text-gold shrink-0" />
        <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 font-inter">Check In</p>
            <p className="text-sm font-inter text-neutral-800 truncate">
              {checkIn ? fmtDisplay(checkIn) : "Add date"}
            </p>
          </div>
          <span className="text-neutral-300">→</span>
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 font-inter">Check Out</p>
            <p className="text-sm font-inter text-neutral-800 truncate">
              {checkOut ? fmtDisplay(checkOut) : "Add date"}
            </p>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="absolute z-[9999] mt-2 w-[320px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gold/15 p-4 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0"
          style={{ position: "absolute" }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={goPrevMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="font-inter text-sm font-semibold text-neutral-800">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={goNextMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                className="text-center text-[11px] font-inter text-neutral-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const disabled = date < today;
              const selectedStart = isSameDay(date, checkIn);
              const selectedEnd = isSameDay(date, checkOut);
              const between = inRange(date);

              return (
                <button
                  type="button"
                  key={i}
                  disabled={disabled}
                  onClick={() => handleSelect(date)}
                  className={`h-8 w-8 text-xs font-inter rounded-lg flex items-center justify-center transition-colors
                    ${disabled ? "text-neutral-300 cursor-not-allowed" : "text-neutral-700 hover:bg-gold/10"}
                    ${selectedStart || selectedEnd ? "bg-gold text-white hover:bg-gold" : ""}
                    ${between ? "bg-gold/15" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {checkIn && checkOut && (
            <p className="text-xs font-inter text-neutral-500 mt-3 text-center">
              {nights} night{nights !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
