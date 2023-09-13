import { Dispatch, SetStateAction } from "react";

type InputType = {
  title: string;
  placeholder: string;
  onClick?: () => {};
  disabled: boolean;
  amount: number | undefined;
  setAmount: Dispatch<SetStateAction<number | undefined>>;
};

export const Input = ({
  title,
  placeholder,
  disabled,
  amount,
  setAmount,
}: InputType) => {
  return (
    <div className="flex gap-10">
      <button
        className="bg-blue-300 px-4 w-28 text-white font-medium disabled:opacity-25 text-lg py-2 rounded-md"
        disabled={disabled}
      >
        {title}
      </button>
      <div className="border flex border-gray-400 rounded-md px-2">
        <input
          value={amount}
          onChange={() => setAmount}
          type="text"
          className="outline-0"
          placeholder={placeholder}
        />
        <select className="border-l-2 px-2 outline-0">
          <option value="">Matic</option>
          <option value="">Dusdc</option>
        </select>
      </div>
    </div>
  );
};
