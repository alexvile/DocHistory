import { Button } from "@ariakit/react";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import AKComboBox from "~/components/ui/AKCombobox";
import { Icon } from "~/components/ui/Icon";
import TextField from "~/components/ui/TextField";
import * as Ariakit from "@ariakit/react";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
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
      UI Kit
      <div className="flex gap-8">
        <button className="button button--primary">Primary</button>
        <button className="button button--secondary">Secondary</button>
        <button className="button button--icon">
          <Icon name="close" />
        </button>
        <button type="submit" name="intent" value="reject" className="button button--primary button--critical">
          Primary Critical
        </button>
      </div>
      <div className="flex gap-8 mt-8">
        <button disabled className="button button--primary">Primary</button>
        <button disabled className="button button--secondary">Secondary</button>
        <button disabled className="button button--icon">
          <Icon name="close" />
        </button>
        <button disabled type="submit" name="intent" value="reject" className="button button--primary button--critical">
          Primary Critical
        </button>
      </div>
      <div className="mt-8">
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
      Table Link Text
      <Outlet />
    </>
  );
}
