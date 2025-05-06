export function validateMainFields(main__title: unknown, main__code: unknown) {
  if (typeof main__title !== 'string' || main__title.trim().length < 4) {
    throw new Error('Invalid title');
  }

  if (main__code !== undefined && typeof main__code !== 'string') {
    throw new Error('Invalid code');
  }

  return {
    title: main__title.trim(),
    code: main__code,
  };
}




// todo - redo this
// app/utils/validators.server.ts

export const validateEmail = (email: string): string | undefined => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.length || !validRegex.test(email)) {
      return "Please enter a valid email address"
    }
  }
  
  export const validatePassword = (password: string): string | undefined => {
    if (password.length < 5) {
      return "Please enter a password that is at least 5 characters long"
    }
  }
  
  export const validateName = (name: string): string | undefined => {
    if (!name.length) return `Please enter a value`
  }
  