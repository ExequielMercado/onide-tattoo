'use client';

import { useState } from 'react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxc3uBC46h-BCbC782GPeC84CPpfoP6rucCzWQkzJZgQ3NnVocjXgDOht0AluU4toyz/exec';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  style: 'Black & Grey',
  placement: '',
  size: '',
  description: '',
  preferredDates: '',
};

export default function BookingForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(form),
      });
      setStatus('sent');
      setForm(initialForm);
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
          <option>Black & Grey</option>
          <option>Realism</option>
          <option>Bio-Organic</option>
          <option>Not sure yet</option>
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
        <input name="preferredDates" placeholder="e.g. weekdays after 3pm" value={form.preferredDates} onChange={handleChange} className="w-full bg-transparent border border-white/30 px-4 py-3 focus:border-white outline-none" />
      </div>
      <button type="submit" disabled={status === 'sending'} className="w-full border border-white py-3 uppercase tracking-widest hover:bg-white hover:text-black transition disabled:opacity-50">
        {status === 'sending' ? 'Sending...' : 'Send Request'}
      </button>
      {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again or email directly.</p>}
    </form>
  );
}