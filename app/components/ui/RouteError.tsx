import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import styles from "./RouteError.module.css";

type ErrorContent = {
  status: number;
  title: string;
  description: string;
};

function getErrorContent(error: unknown): ErrorContent {
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401:
        return {
          status: 401,
          title: "Потрібна авторизація",
          description: "Увійдіть у систему, щоб продовжити роботу.",
        };
      case 403:
        return {
          status: 403,
          title: "Недостатньо прав",
          description: "У вас немає доступу до цієї сторінки або дії.",
        };
      case 404:
        return {
          status: 404,
          title: "Сторінку не знайдено",
          description: "Схоже, запитувана сторінка не існує або була видалена.",
        };
      case 409:
        return {
          status: 409,
          title: "Не вдалося виконати дію",
          description: "Дані змінилися або перебувають у некоректному стані. Оновіть сторінку та спробуйте ще раз.",
        };
      case 422:
        return {
          status: 422,
          title: "Не вдалося обробити дані",
          description: "Перевірте введені дані та спробуйте ще раз.",
        };
      case 500:
        return {
          status: 500,
          title: "Внутрішня помилка сервера",
          description: "Сталася неочікувана помилка. Спробуйте оновити сторінку трохи пізніше.",
        };
      default:
        return {
          status: error.status,
          title: "Не вдалося завантажити сторінку",
          description: "Під час обробки запиту сталася помилка. Спробуйте ще раз.",
        };
    }
  }

  return {
    status: 500,
    title: "Внутрішня помилка сервера",
    description: "Сталася неочікувана помилка. Спробуйте оновити сторінку трохи пізніше.",
  };
}

export default function RouteError() {
  const content = getErrorContent(useRouteError());

  return (
    <div className={styles.container}>
      <p className={styles.status}>{content.status}</p>
      <h1 className={styles.title}>{content.title}</h1>
      <p className={styles.description}>{content.description}</p>
    </div>
  );
}
