export const formRegex = {
  text: /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F\s\\.]+$/,
  textarea: /^.*$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  number: /^[\d]*$/,
  tel: /^[0-9]{10}$/,
  url: /^(https):\/\/[^ "]+$/,
};

export const fieldLength = {
  text: {
    min: 3,
    max: 100,
  },
  textarea: {
    min: 10,
    max: 255,
  },
  password: {
    min: 8,
    max: 100,
  },
  tel: {
    min: 10,
    max: 10,
  },
};
