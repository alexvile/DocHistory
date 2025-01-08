export const getChanges = (a, b) => {
    const changes = {};
    for (const key in b) { // Перебираємо ключі об'єкта b
      if (a[key] !== b[key]) { // Порівнюємо значення в a і b
        changes[key] = {
          before: a[key],
          after: b[key],
        };
      }
    }
  
    if (Object.keys(changes).length === 0) {
      return null; // Якщо змін немає, повертаємо null
    } else {
      return changes; // Інакше повертаємо об'єкт змін
    }
  };