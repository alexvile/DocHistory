import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import AKComboBox from "~/components/ui/AKCombobox";
import { Icon } from "~/components/ui/Icon";
import TextField from "~/components/ui/TextField";
import Table from "~/components/ui/Table";
import * as Ariakit from "@ariakit/react";

export const loader: LoaderFunction = async () => {
  return null;
};

export default function UIKit() {
  const comboboxOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `value-${i + 1}`,
    label: `Label ${i + 1}`,
  }));
  const [searchValue, setSearchValue] = useState("");
  const dialog = Ariakit.useDialogStore();

  return (
    <>
      <h1>UI Kit</h1>
      <h2>Брендові кольори</h2>
      <div className="uikit-palette">
        <div className="uikit-swatch bg-brand text-on-brand"><strong>Акцент</strong><span>#dd2a1b</span><code>--color-accent</code></div>
        <div className="uikit-swatch bg-page"><strong>Фон сторінки</strong><span>#f5f5f5</span><code>--color-background</code></div>
        <div className="uikit-swatch bg-muted"><strong>Сірий фон</strong><span>#dedede</span><code>--color-background-muted</code></div>
        <div className="uikit-swatch bg-ink text-on-brand"><strong>Текст</strong><span>#212529</span><code>--color-text</code></div>
        <div className="uikit-swatch bg-surface"><strong>Біла поверхня</strong><span>#fff</span><code>--color-surface</code></div>
      </div>
      <h2>Кнопки</h2>
      <div className="flex gap-8">
        <button className="button button--primary">Primary</button>
        <button className="button button--primary button--brand">Brand</button>
        <button className="button button--secondary">Secondary</button>
        <button className="button button--icon">
          <Icon name="close" />
        </button>
        <button type="submit" name="intent" value="reject" className="button button--primary button--critical">
          Primary Critical
        </button>
      </div>
      <div className="flex gap-8 mt-8 items-center">
        <button disabled className="button button--primary">
          Primary
        </button>
        <button disabled className="button button--secondary">
          Secondary
        </button>
        <button disabled className="button button--icon">
          <Icon name="close" />
        </button>
        <button disabled type="submit" name="intent" value="reject" className="button button--primary button--critical">
          Primary Critical
        </button>
      </div>
      <div className="flex gap-8 mt-8 items-center">
        <button disabled className="button button--primary is-loading">
          Primary
        </button>
        <button disabled className="button button--secondary is-loading">
          Secondary
        </button>
        <button disabled className="button button--icon is-loading">
          <Icon name="close" />
        </button>
        <button disabled type="submit" name="intent" value="reject" className="button button--primary button--critical is-loading">
          Primary Critical
        </button>
      </div>
      <div className="flex gap-8 mt-8 items-center">
        <Link to={"#"} className="link" aria-label="Додати продукт">
          Link
        </Link>
        {/* <Link to={"#"} className="link-unstyled button button--primary is-loading" aria-label="Додати продукт">
          Link-button
        </Link> */}
      </div>
      <h2>Великі кнопки — button-big</h2>
      <div className="flex gap-8 items-center">
        <button type="button" className="button button--primary button-big">Увійти</button>
        <button type="button" className="button button--primary button--brand button-big">Брендова кнопка</button>
        <button type="button" className="button button--secondary button-big">Скасувати</button>
        <button type="button" className="button button--primary button-big" disabled>Недоступно</button>
        <button type="button" className="button button--primary button-big is-loading" disabled aria-label="Завантаження">Завантаження</button>
      </div>
      <h2>Поля</h2>
      <div className="mt-8">
        <TextField label="Велике поле — input-big" name="largeEmail" type="email" placeholder="name@company.com" size="big" />
        <div className="mt-8">
          <TextField label="Велике поле пароля" name="largePassword" type="password" size="big" />
        </div>
        <select className="p-select">
          <option value="option1">Option1</option>
          <option value="option2">Option2</option>
          <option value="option3">Option3</option>
          <option value="option4">Option4</option>
          <option value="option5">Option5</option>
        </select>
        <div className="mt-8">
          <TextField label="Назва" name="title" placeholder="КС-Г(В)-010 СН" minLength={4} isRequired />
        </div>
        <div className="mt-8">
          <AKComboBox
            options={comboboxOptions}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onSelect={() => {}}
            onClear={() => {}}
            placeholder="Оберіть продукт"
            label="Оберіть продукт"
            ariaLabel="Оберіть продукт"
            noResultsText="Продуктів не знайдено"
          />
        </div>
      </div>
      {/* modal */}
      <div className="mt-8">
        <Ariakit.Button onClick={dialog.show} className="button button--primary">
          Show modal
        </Ariakit.Button>
        <Ariakit.Dialog store={dialog} backdrop={<div className="backdrop" />} className="dialog">
          <Ariakit.DialogHeading className="heading">Success</Ariakit.DialogHeading>
          <p className="description">Your payment has been successfully processed. We have emailed your receipt.</p>
          <div>
            <Ariakit.DialogDismiss className="button">OK</Ariakit.DialogDismiss>
          </div>
        </Ariakit.Dialog>
      </div>
      <h2>Тексти</h2>
      <p className="text-sm">text-sm · 12 px — допоміжний текст і примітки</p>
      <p className="text-md">text-md · 14 px — текст інтерфейсу</p>
      <p className="text-lg">text-lg · 16 px — основний текст</p>
      <p className="text-xl">text-xl · 20 px — підзаголовок</p>
      <p className="text-2xl">text-2xl · 26 px — великий заголовок</p>
      <p className="text-md bold">Жирний текст — bold</p>
      <p className="text-md text-brand">Акцентний текст — text-brand</p>

      <h2>Таблиця</h2>
      <Table headings={["№", "Матеріал", "Од.", "Норма", "Позначення"]}>
        <Table.Row>
          <Table.Cell>1</Table.Cell><Table.Cell>Сталь листова</Table.Cell><Table.Cell>кг</Table.Cell><Table.Cell>12,5</Table.Cell><Table.Cell>Без змін</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>2</Table.Cell><Table.Cell>Фарба</Table.Cell><Table.Cell>л</Table.Cell><Table.Cell className="norm-diff--changed">0,8</Table.Cell><Table.Cell>Змінене значення</Table.Cell>
        </Table.Row>
        <Table.Row className="norm-diff--added">
          <Table.Cell>3</Table.Cell><Table.Cell>Ґрунтовка</Table.Cell><Table.Cell>л</Table.Cell><Table.Cell>0,3</Table.Cell><Table.Cell>Додано</Table.Cell>
        </Table.Row>
        <Table.Row className="norm-diff--removed line-through opacity-70">
          <Table.Cell>4</Table.Cell><Table.Cell>Розчинник</Table.Cell><Table.Cell>л</Table.Cell><Table.Cell>0,2</Table.Cell><Table.Cell>Видалено</Table.Cell>
        </Table.Row>
      </Table>
      <h3>Порожня таблиця</h3>
      <Table headings={["№", "Матеріал", "Норма"]}>{[]}</Table>
      <Outlet />
    </>
  );
}
