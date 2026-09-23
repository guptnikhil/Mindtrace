import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, CheckCircle2, ShieldCheck, ArrowLeft, MessageCircle } from 'lucide-react';
import type { Counsellor, AvailabilitySlot, Appointment, Student } from '../../types/wellbeing';
import { CounsellingService } from '../../services/api';

interface CounsellorConnectPageProps {
  student: Student | null;
  onNavigateDashboard: () => void;
  onAppointmentBooked?: () => void;
}

export const CounsellorConnectPage: React.FC<CounsellorConnectPageProps> = ({
  student,
  onNavigateDashboard,
  onAppointmentBooked,
}) => {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Appointment | null>(null);

  const [loadingCounsellors, setLoadingCounsellors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCounsellors = async () => {
    setLoadingCounsellors(true);
    setError(null);
    try {
      const list = await CounsellingService.listCounsellors();
      setCounsellors(list);
    } catch (err) {
      console.warn('Backend API offline or unconfigured, using seed counsellors list:', err);
      setCounsellors([
        {
          id: 'counsellor_mehta',
          name: 'Dr. Mehta',
          role: 'College Counsellor & Wellbeing Lead',
          active: true,
          phone_number: '+919919963335'
        },
        {
          id: 'counsellor_sharma',
          name: 'Dr. Sharma',
          role: 'Senior Student Counsellor',
          active: true,
          phone_number: '+919919963335'
        }
      ]);
    } finally {
      setLoadingCounsellors(false);
    }
  };

  useEffect(() => {
    loadCounsellors();
  }, []);

  const handleSelectCounsellor = async (counsellor: Counsellor) => {
    setSelectedCounsellor(counsellor);
    setSelectedSlot(null);
    setConsentChecked(false);
    setLoadingSlots(true);
    setError(null);
    try {
      const slots = await CounsellingService.getAvailability(counsellor.id);
      setAvailableSlots(slots);
    } catch (err) {
      console.warn('Backend API offline or unconfigured, rendering seed availability slots:', err);
      const todayStr = new Date().toISOString().split('T')[0];
      setAvailableSlots([
        { id: 's1', counsellor_id: counsellor.id, date: todayStr, start_time: '10:00 AM', end_time: '10:45 AM', is_available: true },
        { id: 's2', counsellor_id: counsellor.id, date: todayStr, start_time: '02:00 PM', end_time: '02:45 PM', is_available: true },
        { id: 's3', counsellor_id: counsellor.id, date: todayStr, start_time: '04:00 PM', end_time: '04:45 PM', is_available: true }
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!student || !selectedCounsellor || !selectedSlot || !consentChecked) return;

    setBookingLoading(true);
    setError(null);
    try {
      const appointment = await CounsellingService.bookAppointment(
        student.id,
        selectedCounsellor.id,
        selectedSlot.id,
        15
      );
      setBookingConfirmed(appointment);
      if (onAppointmentBooked) onAppointmentBooked();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to confirm appointment booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateDashboard}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {bookingConfirmed ? (
        /* Confirmation Screen */
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Session Requested
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Your appointment has been booked successfully.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Counsellor</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {bookingConfirmed.counsellor_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(bookingConfirmed.scheduled_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Time</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(bookingConfirmed.scheduled_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Duration</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {bookingConfirmed.duration_minutes} minutes
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {bookingConfirmed.whatsapp_url && (
              <a
                href={bookingConfirmed.whatsapp_url.replace('919876543210', '919919963335').replace('919876543211', '919919963335')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Continue on WhatsApp
              </a>
            )}

            <button
              onClick={onNavigateDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
            >
              View Appointment
            </button>
          </div>
        </div>
      ) : (
        /* Main Counsellor Booking Flow */
        <div className="space-y-6">
          {/* Banner */}
          <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 dark:border-emerald-800/40">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Want to talk to someone?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Connect with a college counsellor at a time that works for you. You decide what to share, and your private MindTrace behavioural data will never be sent automatically.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Counsellor Selection Grid */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select a College Counsellor
            </h2>

            {loadingCounsellors ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading available counsellors...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {counsellors.map(counsellor => {
                  const isSelected = selectedCounsellor?.id === counsellor.id;
                  return (
                    <div
                      key={counsellor.id}
                      className={`p-5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            {counsellor.name}
                          </div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {counsellor.role}
                          </div>
                        </div>
                        <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300">
                          <Clock className="w-3.5 h-3.5" />
                          Available today (15 min sessions)
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelectCounsellor(counsellor)}
                        className={`w-full mt-4 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isSelected ? 'Counsellor Selected' : 'View Available Times'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Slot Selection */}
          {selectedCounsellor && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Available Slots for {selectedCounsellor.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a 15-minute slot that suits your schedule.
                  </p>
                </div>
              </div>

              {loadingSlots ? (
                <div className="py-6 text-center text-xs text-slate-500">Generating available slots...</div>
              ) : availableSlots.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No slots currently available for this counsellor.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isAvailable = slot.is_available;

                    return (
                      <button
                        key={slot.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                          !isAvailable
                            ? 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div>{slot.start_time}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          {isAvailable ? 'Available' : 'Booked'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Privacy Consent & Confirm */}
              {selectedSlot && (
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        Privacy Notice:
                      </span>{' '}
                      You're choosing to contact a college counsellor. Your private MindTrace behavioural information will not be automatically shared as part of this appointment request.
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <span>I want to request a counselling session.</span>
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleBookAppointment}
                      disabled={!consentChecked || bookingLoading}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                    >
                      {bookingLoading ? 'Booking...' : 'Confirm & Book Session'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
