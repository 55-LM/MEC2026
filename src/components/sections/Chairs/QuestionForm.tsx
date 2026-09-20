import { useState, type FormEvent } from 'react';
import {
  isValidEmail,
  submitQuestionForm,
} from '../../../services/formSubmission';
import { Button } from '../../ui/Button';
import './Chairs.css';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initial: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function QuestionForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error' | 'unavailable'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = 'Name is required.';
    if (!values.email.trim()) next.email = 'Email is required.';
    else if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!values.subject.trim()) next.subject = 'Subject is required.';
    if (!values.message.trim()) next.message = 'Please enter your question.';
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    setStatusMessage('');

    const result = await submitQuestionForm({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    });

    if (result.ok) {
      setStatus('success');
      setStatusMessage('Your question was sent. Thank you!');
      setValues(initial);
      return;
    }

    if (result.unavailable) {
      setStatus('unavailable');
      setStatusMessage(result.error);
      return;
    }

    setStatus('error');
    setStatusMessage(result.error);
  };

  return (
    <form className="question-form" onSubmit={onSubmit} noValidate>
      <div className="question-form__field">
        <label htmlFor="q-name">Name</label>
        <input
          id="q-name"
          name="name"
          autoComplete="name"
          value={values.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'q-name-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
        {errors.name ? (
          <p id="q-name-error" className="question-form__error" role="alert">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="question-form__field">
        <label htmlFor="q-email">Email</label>
        <input
          id="q-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'q-email-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        {errors.email ? (
          <p id="q-email-error" className="question-form__error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="question-form__field">
        <label htmlFor="q-subject">Subject</label>
        <input
          id="q-subject"
          name="subject"
          value={values.subject}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'q-subject-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
        />
        {errors.subject ? (
          <p id="q-subject-error" className="question-form__error" role="alert">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className="question-form__field">
        <label htmlFor="q-message">Question or Message</label>
        <textarea
          id="q-message"
          name="message"
          rows={5}
          value={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'q-message-error' : undefined}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        />
        {errors.message ? (
          <p id="q-message-error" className="question-form__error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Submit'}
      </Button>

      {statusMessage ? (
        <p
          className={`question-form__status question-form__status--${status}`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
