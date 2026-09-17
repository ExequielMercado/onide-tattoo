'use client';

import { useMemo, useState } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WORKING_SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAvailableSlots(date) {
  const occupiedSlots = new Set([
    (date.getDate() + date.getMonth()) % WORKING_SLOTS.length,
    (date.getDate() * 2 + date.getDay()) % WORKING_SLOTS.length,
  ]);

  return WORKING_SLOTS.filter((_, index) => !occupiedSlots.has(index));
}

function formatDateTime(date, time) {
  const [hours, minutes] = time.split(':').map(Number);
  const appointment = new Date(date);
  appointment.setHours(hours, minutes, 0, 0);
  return appointment.toISOString();
}

function formatSelectedDate(date, time) {
  if (!date || !time) return '';

  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} - ${time}`;
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  style: 'Realism',
  coverUp: '',
  placement: '',
  size: '',
  description: '',
  preferredDates: '',
};

export default function BookingForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const today = useMemo(() => startOfDay(new Date()), []);
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    const leadingEmptyDays = firstDay.getDay();

    return [
      ...Array.from({ length: leadingEmptyDays }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1),
      ),
    ];
  }, [calendarMonth]);

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  function selectDate(date) {
    setSelectedDate(date);
    setSelectedTime('');
    setStatus('idle');
    setForm((currentForm) => ({ ...currentForm, preferredDates: '' }));
  }

  function selectTime(time) {
    setSelectedTime(time);
    setStatus('idle');
    setForm((currentForm) => ({
      ...currentForm,
      preferredDates: formatDateTime(selectedDate, time),
    }));
    setIsOpen(false);
  }

  function isSameDate(firstDate, secondDate) {
    return firstDate && secondDate && firstDate.getTime() === secondDate.getTime();
  }

  function isPastDate(date) {
    return date < today;
  }

  function isSunday(date) {
    return date.getDay() === 0;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/book-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.status === 409) {
        setStatus('conflict');
        return;
      }

      if (!response.ok) {
        throw new Error(`Booking request failed with status ${response.status}`);
      }

      setStatus('sent');
      setForm(initialForm);
      setSelectedDate(null);
      setSelectedTime('');
      setIsOpen(false);
      setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-32 text-white">
        <h2 className="text-3xl uppercase tracking-widest mb-4">Thank you!</h2>
        <p className="text-gray-400">Onide will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto py-24 px-6 text-white space-y-6">
      <h1 className="text-4xl uppercase tracking-widest text-center mb-10">
        Book a Consultation
      </h1>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Name</label>
        <input required name="name" value={form.name} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Email</label>
        <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Style</label>
        <select name="style" value={form.style} onChange={handleChange} className="w-full bg-black border border-white/30 px-4 py-3 focus:border-white outline-none">
          <option>Realism</option>
          <option>Neo-Tribal</option>
          <option>Custom project</option>
        </select>
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Cover Up</label>
        <select required name="coverUp" value={form.coverUp} onChange={handleChange} className="w-full bg-black border border-white/30 px-4 py-3 focus:border-white outline-none">
          <option value="" disabled>Select Yes/No</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Placement</label>
        <input name="placement" placeholder="e.g. forearm, back, ribs" value={form.placement} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Approx. Size</label>
        <input name="size" placeholder="e.g. palm-sized, half sleeve" value={form.size} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Describe your idea</label>
        <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-widest mb-2">Preferred Dates</label>
        <div className="relative">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={() => setIsOpen((open) => !open)}
            className={`w-full border border-white/30 bg-black px-4 py-3 text-left outline-none transition focus:border-white ${
              selectedDate && selectedTime ? 'text-white' : 'text-gray-500'
            }`}
          >
            {formatSelectedDate(selectedDate, selectedTime) || 'Select Date & Time'}
          </button>

          {isOpen && (
            <div className="absolute bottom-full left-0 z-50 mb-2 w-full border border-white/20 bg-black p-3 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={calendarMonth.getTime() <= new Date(today.getFullYear(), today.getMonth(), 1).getTime()}
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                  className="px-2 text-xl text-gray-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ‹
                </button>
                <h2 className="text-xs uppercase tracking-widest">
                  {calendarMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                  className="px-2 text-xl text-gray-400 transition hover:text-white"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-500">
                {WEEKDAYS.map((weekday) => <span key={weekday} className="py-2">{weekday}</span>)}
                {calendarDays.map((date, index) => (
                  <span key={date ? date.toISOString() : `empty-${index}`} className="aspect-square">
                    {date && (
                      <button
                        type="button"
                        disabled={isPastDate(date) || isSunday(date)}
                        onClick={() => selectDate(date)}
                        className={`h-full w-full rounded-full text-xs transition ${
                          isSameDate(date, selectedDate)
                            ? 'bg-white text-black'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        } disabled:cursor-not-allowed disabled:text-gray-700`}
                      >
                        {date.getDate()}
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">
                    Available times for {selectedDate.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {availableSlots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => selectTime(time)}
                        className={`border px-1.5 py-1 text-xs transition ${
                          selectedTime === time
                            ? 'border-white bg-white text-black'
                            : 'border-white/30 text-gray-300 hover:border-white/70 hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button type="submit" disabled={status === 'sending'} className="w-full border border-white py-3 uppercase tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50">
        {status === 'sending' ? 'Sending...' : 'Send Request'}
      </button>
      {status === 'error' && (
        <p className="text-center text-sm text-red-400">
          {selectedDate && selectedTime
            ? 'Something went wrong. Please try again or email directly.'
            : 'Please select a date and available time before sending.'}
        </p>
      )}
      {status === 'conflict' && (
        <p className="text-center text-sm text-amber-300">
          That time is already booked. Please choose another available slot.
        </p>
      )}
    </form>
  );
}