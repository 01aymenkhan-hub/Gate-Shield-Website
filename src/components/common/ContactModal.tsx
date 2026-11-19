'use client';

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Lock,
  Building,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

/* ─── Context for Global Modal Control ─────────────────────────────────────── */

interface ContactModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export const useContactModal = () => useContext(ContactModalContext);

function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/* ─── Modal Provider & Component ───────────────────────────────────────────── */

export const ContactModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Global click interceptor for any anchor targeting #contact
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href="#contact"], [data-contact-trigger]');
      if (target) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ContactModalContext.Provider>
  );
};

/* ─── Contact Modal Dialog ─────────────────────────────────────────────────── */

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  facilityType: string;
  message: string;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  facilityType: 'Corporate Office',
  message: '',
};

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSubmittingRef = useRef(false);
  const formLoadedAtRef = useRef<number>(Date.now());
  const submissionIdRef = useRef<string>(createSubmissionId());

  const handleResetAndClose = React.useCallback(() => {
    setForm(initialFormState);
    setHoneypot('');
    setIsSuccess(false);
    setConfirmationSent(false);
    setErrors({});
    submissionIdRef.current = createSubmissionId();
    onClose();
  }, [onClose]);

  const handleRequestClose = React.useCallback(() => {
    if (isSuccess) {
      handleResetAndClose();
    } else {
      onClose();
    }
  }, [isSuccess, handleResetAndClose, onClose]);

  // Close on Escape key press, reset timing/idempotency per open, & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    formLoadedAtRef.current = Date.now();
    submissionIdRef.current = createSubmissionId();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleRequestClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleRequestClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field or form-level alert and generate a new idempotency key on edit
    submissionIdRef.current = createSubmissionId();
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        delete updated.form;
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) {
      errs.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid work email';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (form.phone.replace(/\D/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone or WhatsApp number';
    }
    if (!form.company.trim()) {
      errs.company = 'Company / Facility name is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!validate()) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setErrors((prev) => {
      if (!prev.form) return prev;
      const updated = { ...prev };
      delete updated.form;
      return updated;
    });

    const payload = {
      ...form,
      website: honeypot,
      submissionId: submissionIdRef.current,
      formLoadedAt: formLoadedAtRef.current,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            confirmationSent?: boolean;
            error?: string;
            fieldErrors?: Record<string, string>;
          }
        | null;

      if (!response.ok || !result?.ok) {
        if (result?.fieldErrors) {
          setErrors({
            ...result.fieldErrors,
            ...(result.error ? { form: result.error } : {}),
          });
        } else {
          setErrors({
            form:
              result?.error ||
              'Unable to send your request right now. Please try again or message us directly on WhatsApp.',
          });
        }
        return;
      }

      setConfirmationSent(Boolean(result.confirmationSent));
      setIsSuccess(true);
    } catch {
      setErrors({
        form: 'Network error while sending your request. Please try again or message us directly on WhatsApp.',
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-modal-backdrop" onClick={handleRequestClose} role="dialog" aria-modal="true">
      <div
        className="contact-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleRequestClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          /* ─── Success Confirmation View ─── */
          <div className="modal-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <h3 className="success-h3">Inquiry Received!</h3>

            <p className="success-desc">
              Thank you, <strong>{form.fullName}</strong>. Your request for{' '}
              <strong>{form.company}</strong> has been logged. Our workplace security consultant will contact you on{' '}
              <strong>{form.phone}</strong> shortly.
              {confirmationSent && (
                <> A confirmation email has also been sent to <strong>{form.email}</strong>.</>
              )}
            </p>

            <button
              type="button"
              className="modal-submit-btn"
              onClick={handleResetAndClose}
            >
              Done
            </button>
          </div>
        ) : (
          /* ─── Form View ─── */
          <>
            <div className="modal-header">
              <div className="modal-pill-tag">
                <span className="modal-tag-dot" />
                <span>GateShield · Direct Enterprise Contact</span>
              </div>

              <h3 className="modal-title">Get Started with Gate Shield</h3>

              <p className="modal-sub">
                Leave your details below. Our team will prepare a tailored walkthrough and custom quote for your facility.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form" noValidate>
              {/* Off-screen honeypot field to trap automated spam bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: 'fixed',
                  left: '-9999px',
                  top: '-9999px',
                  width: '1px',
                  height: '1px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
              {errors.form && (
                <div className="modal-form-alert">{errors.form}</div>
              )}

              {/* Row 1: Full Name & Company */}
              <div className="modal-form-row">
                <div className="modal-field-group">
                  <label className="modal-field-label">
                    <User size={13} />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Asad Siddiqui"
                    className={`modal-input ${errors.fullName ? 'error' : ''}`}
                  />
                  {errors.fullName && (
                    <span className="modal-field-error">{errors.fullName}</span>
                  )}
                </div>

                <div className="modal-field-group">
                  <label className="modal-field-label">
                    <Building size={13} />
                    <span>Company / Facility *</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Apex Industries"
                    className={`modal-input ${errors.company ? 'error' : ''}`}
                  />
                  {errors.company && (
                    <span className="modal-field-error">{errors.company}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Work Email & Phone / WhatsApp */}
              <div className="modal-form-row">
                <div className="modal-field-group">
                  <label className="modal-field-label">
                    <Mail size={13} />
                    <span>Work Email *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className={`modal-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && (
                    <span className="modal-field-error">{errors.email}</span>
                  )}
                </div>

                <div className="modal-field-group">
                  <label className="modal-field-label">
                    <Phone size={13} />
                    <span>Phone / WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`modal-input ${errors.phone ? 'error' : ''}`}
                  />
                  {errors.phone && (
                    <span className="modal-field-error">{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Facility Type Selection */}
              <div className="modal-field-group">
                <label className="modal-field-label">
                  <Sparkles size={13} />
                  <span>Primary Facility Type</span>
                </label>
                <select
                  name="facilityType"
                  value={form.facilityType}
                  onChange={handleChange}
                  className="modal-select"
                >
                  <option value="Corporate Office">Corporate Office / Headquarters</option>
                  <option value="Factory / Plant">Manufacturing Factory / Industrial Plant</option>
                  <option value="Warehouse / Logistics">Warehouse / Logistics Distribution Hub</option>
                  <option value="Residential Society">Residential Society / Gated Community</option>
                  <option value="Hospital / Healthcare">Hospital / Medical Center</option>
                  <option value="Educational Campus">Educational Campus / University</option>
                  <option value="Exhibition / Venue">Exhibition Hall / Event Arena</option>
                  <option value="Other">Other Workplace</option>
                </select>
              </div>

              {/* Row 4: Message / Specific Needs */}
              <div className="modal-field-group">
                <label className="modal-field-label">
                  <MessageSquare size={13} />
                  <span>Special Requirements or Questions (Optional)</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How many gates or expected visitors per day?"
                  rows={2}
                  className="modal-textarea"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="modal-submit-btn"
              >
                {isSubmitting ? (
                  <span>Sending request…</span>
                ) : (
                  <>
                    <span>Submit & Request Demo</span>
                    <Send size={15} />
                  </>
                )}
              </button>

              {/* Privacy Trust Note */}
              <div className="modal-privacy-note">
                <Lock size={12} />
                <span>Your information is strictly confidential. Zero spam policy.</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

