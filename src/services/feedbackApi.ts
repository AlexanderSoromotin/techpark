// Модуль отправки обратной связи на внешний API

const API_URL =
  import.meta.env.VITE_FEEDBACK_API_URL ||
  'https://feedback.datary-dev.ru/api/v1/submit';

const API_TOKEN = import.meta.env.VITE_FEEDBACK_API_TOKEN || '';

export interface FeedbackPayload {
  name: string;
  contact: string;
  message: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const body = {
    token: API_TOKEN,
    data: [
      { name: 'ФИО', key: 'name', value: payload.name },
      { name: 'Контакт', key: 'contact', value: payload.contact },
      { name: 'Сообщение', key: 'message', value: payload.message },
    ],
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    // Пытаемся распарсить сообщение об ошибке от сервера
    let serverMessage = '';
    try {
      const json = await response.json();
      serverMessage = json.message || json.error || json.detail || '';
    } catch {
      // Ответ не является JSON — игнорируем
    }
    throw new Error(
      serverMessage || 'Не удалось отправить сообщение. Попробуйте позже.'
    );
  }
}

