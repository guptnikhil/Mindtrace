import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MessageCircle, RefreshCw, XCircle, Bell, AlertTriangle } from 'lucide-react';
import type { Appointment, AvailabilitySlot } from '../../types/wellbeing';
import { CounsellingService } from '../../services/api';

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdate?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onUpdate }) => {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showReschedule) {
      loadSlots();
    }
  }, [showReschedule]);

  const loadSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const slots = await CounsellingService.getAvailability(appointment.counsellor_id);
      setAvailableSlots(slots.filter(s => s.is_available));
    } catch (err) {
      setError('Failed to load available slots for rescheduling.');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlotId) return;
    setLoading(true);
    setError(null);
    try {
      await CounsellingService.rescheduleAppointment(appointment.id, selectedSlotId);
      setShowReschedule(false);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to reschedule appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      await CounsellingService.cancelAppointment(appointment.id);
      setShowCancelModal(false);
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(appointment.scheduled_at).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(appointment.scheduled_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isCancelled = appointment.status === 'cancelled';

  return (
    <div className={`p-5 rounded-xl border transition-all ${
      isCancelled 
        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75' 
        : 'bg-white dark:bg-slate-800/80 border-emerald-100 dark:border-emerald-900/30 shadow-sm hover:shadow-md'
    }`}>
      {/* Reminder State Banner (Simulated 30-min reminder for scheduled sessions) */}
      {!isCancelled && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium">
          <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <span className="font-semibold">Upcoming Session:</span> Your counselling session with {appointment.counsellor_name} starts soon (30 min reminder simulation).
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              {appointment.counsellor_name}
            </span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              isCancelled 
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' 
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            }`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{appointment.counsellor_role}</p>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{formattedTime} ({appointment.duration_minutes} min)</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      {!isCancelled && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {appointment.meeting_link && (
              <a
                href={appointment.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
              >
                <Video className="w-4 h-4" />
                Join Session
              </a>
            )}

            {appointment.whatsapp_url && (
              <a
                href={appointment.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Continue on WhatsApp
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReschedule(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reschedule Session
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select a new time slot with {appointment.counsellor_name}. Your previous slot will be released.
            </p>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading availability...</div>
            ) : availableSlots.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                No alternative available slots at this time.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-6 pr-1">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      selectedSlotId === slot.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>{slot.start_time}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{slot.date}</div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReschedule(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Keep Current Time
              </button>
              <button
                onClick={handleReschedule}
                disabled={!selectedSlotId || loading}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cancel Appointment?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to cancel this counselling session?
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition-colors"
              >
                Cancel Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
