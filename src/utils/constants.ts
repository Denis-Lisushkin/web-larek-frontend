export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  errorMessages: {
    address: 'Необходимо указать адрес',
    payment: 'Необходимо указать способ оплаты',
    email: 'Необходимо указать email',
    phone: 'Необходимо указать телефон',
  },
  categories: {
    'дополнительное': 'additional',
    'софт-скил': 'soft',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'другое': 'other',
  } as Record<string, string>
};
