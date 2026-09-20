import type { FormSubmissionResult, QuestionFormPayload } from '../types';

/**
 * Submit the Chairs question form.
 *
 * Configure by setting VITE_FORMSPREE_ENDPOINT in a `.env` file
 * (see `.env.example`). Example: https://formspree.io/f/xxxxxxxx
 *
 * Does NOT simulate success when unconfigured.
 */
export async function submitQuestionForm(
  payload: QuestionFormPayload,
): Promise<FormSubmissionResult> {
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();

  if (!endpoint) {
    return {
      ok: false,
      unavailable: true,
      error:
        'Form submission is not configured yet. Set VITE_FORMSPREE_ENDPOINT in your .env file.',
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: 'Unable to send your message right now. Please try again later.',
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Network error while sending your message. Please try again.',
    };
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
