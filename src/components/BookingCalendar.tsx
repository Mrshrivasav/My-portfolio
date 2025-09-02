'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format, addDays, isToday, isBefore, startOfDay, getMonth, getYear } from 'date-fns';
import { CalendarClock, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Import CSS for react-calendar
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingCalendar = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<'month' | 'year' | 'decade'>('month');
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    topic: ''
  });

  // Generate time slots for the selected date
  useEffect(() => {
    if (date instanceof Date) {
      // Example time slots (in a real app, these would come from an API)
      const workHours = [
        '10:00am', '10:30am', '11:00am', '11:30am',
        '12:00pm', '12:30pm', '1:00pm', '1:30pm',
        '2:00pm', '2:30pm', '3:00pm', '3:30pm'
      ];
      
      // For demo purposes, make some slots unavailable randomly
      const slots = workHours.map(time => ({
        time,
        available: Math.random() > 0.3 // 70% chance of being available
      }));
      
      setTimeSlots(slots);
      setSelectedTime(null);
    }
  }, [date]);

  const handleDateChange = (value: Value) => {
    setDate(value);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would send this data to your backend
    const bookingData = {
      date: date instanceof Date ? format(date, 'yyyy-MM-dd') : '',
      time: selectedTime,
      ...bookingDetails
    };
    
    console.log('Booking data:', bookingData);
    
    // Simulate API call
    setTimeout(() => {
      setBookingStatus('success');
      setIsSubmitting(false);
      
      // Create a mailto link with booking details
      const mailtoLink = `mailto:amanshriwastava0@gmail.com?subject=${encodeURIComponent(`Meeting Request: ${bookingDetails.topic}`)}&body=${encodeURIComponent(
        `Hello,\n\nI would like to schedule a meeting with you.\n\nDetails:\nName: ${bookingDetails.name}\nEmail: ${bookingDetails.email}\nDate: ${date instanceof Date ? format(date, 'MMMM dd, yyyy') : ''}\nTime: ${selectedTime}\nTopic: ${bookingDetails.topic}\n\nThank you!`
      )}`;
      
      // Open the mailto link
      window.location.href = mailtoLink;
    }, 1500);
  };

  // Disable past dates
  const tileDisabled = ({ date, view }: { date: Date; view: 'month' | 'year' | 'decade' }) => {
    // Disable dates in the past
    if (view === 'month') {
      return isBefore(date, startOfDay(new Date())) && !isToday(date);
    }
    return false;
  };

  // Custom navigation for the calendar
  const CustomNavigation = ({ date, view, onChange }: { date: Date; view: 'month' | 'year' | 'decade'; onChange: (date: Date) => void }) => {
    const handlePrevClick = () => {
      const newDate = new Date(date);
      
      if (view === 'month') {
        newDate.setMonth(date.getMonth() - 1);
      } else if (view === 'year') {
        newDate.setFullYear(date.getFullYear() - 1);
      } else if (view === 'decade') {
        newDate.setFullYear(date.getFullYear() - 10);
      }
      
      onChange(newDate);
    };

    const handleNextClick = () => {
      const newDate = new Date(date);
      
      if (view === 'month') {
        newDate.setMonth(date.getMonth() + 1);
      } else if (view === 'year') {
        newDate.setFullYear(date.getFullYear() + 1);
      } else if (view === 'decade') {
        newDate.setFullYear(date.getFullYear() + 10);
      }
      
      onChange(newDate);
    };

    const handleViewChange = () => {
      if (view === 'month') {
        setActiveView('year');
      } else if (view === 'year') {
        setActiveView('decade');
      } else {
        setActiveView('month');
      }
    };

    const getViewTitle = () => {
      if (view === 'month') {
        return format(date, 'MMMM yyyy');
      } else if (view === 'year') {
        return format(date, 'yyyy');
      } else {
        const decade = Math.floor(date.getFullYear() / 10) * 10;
        return `${decade} - ${decade + 9}`;
      }
    };

    return (
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevClick}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <button 
          onClick={handleViewChange}
          className="px-4 py-2 font-medium hover:bg-gray-200 rounded-lg transition-colors text-gray-800"
        >
          {getViewTitle()}
        </button>
        
        <button 
          onClick={handleNextClick}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg sm:text-xl font-semibold text-white">Book a Call</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-800">Select a Date</h4>
          </div>
          <CustomNavigation 
            date={date instanceof Date ? date : new Date()} 
            view={activeView} 
            onChange={setDate} 
          />
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="w-full bg-transparent border-none custom-calendar" 
            tileDisabled={tileDisabled}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)} // Allow booking up to 30 days in advance
            view={activeView}
            onViewChange={({ view }: { view: 'month' | 'year' | 'decade' }) => setActiveView(view)}
            navigationLabel={null} // Disable default navigation label
            formatShortWeekday={(_locale: string, date: Date) => format(date, 'EEE')}
            formatMonthYear={(_locale: string, date: Date) => format(date, 'MMMM yyyy')}
            next2Label={null} // Disable double next button
            prev2Label={null} // Disable double prev button
            nextLabel={null}
            prevLabel={null}
          />
        </div>
        
        {/* Time slots */}
        <div>
          <div className="bg-white/90 p-4 rounded-xl backdrop-blur-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-800">
                {date instanceof Date 
                  ? `Available Times for ${format(date, 'MMMM dd, yyyy')}` 
                  : 'Select a date first'}
              </h4>
            </div>
            
            {date instanceof Date ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`py-2 px-3 rounded-lg text-sm transition-colors ${slot.available 
                      ? selectedTime === slot.time 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Please select a date to see available time slots.</p>
            )}
          </div>
          
          {/* Booking form */}
          {selectedTime && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 p-4 rounded-xl backdrop-blur-sm"
            >
              <h4 className="font-medium mb-4 text-gray-800">Complete Your Booking</h4>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm text-gray-800"
                    value={bookingDetails.name}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm text-gray-800"
                    value={bookingDetails.email}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-1 text-gray-700">
                    Meeting Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm text-gray-800"
                    value={bookingDetails.topic}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, topic: e.target.value })}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
                
                {bookingStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-600 text-center text-sm"
                  >
                    Booking request sent successfully! I'll confirm shortly.
                  </motion.p>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;