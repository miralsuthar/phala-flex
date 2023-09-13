import { Dispatch, SetStateAction } from "react";

type InputType = {
  title: string;
  placeholder: string;
  onClick: () => void;
  disabled: boolean;
  amount: string;
  setAmount: (value: SetStateAction<string>) => void;
  token: string;
  setToken: (value: string) => void;
};

export const Input = ({
  title,
  placeholder,
  disabled,
  amount,
  setAmount,
  onClick,
  token,
  setToken,
}: InputType) => {
  return (
    <div className="flex gap-10">
      <button
        className="bg-blue-500 px-4 w-28 text-white font-medium disabled:opacity-25 text-lg py-2 rounded-md"
        disabled={disabled}
        onClick={onClick}
      >
        {title}
      </button>
      <div className="border flex border-gray-400 rounded-md px-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="text"
          className="outline-0"
          placeholder={placeholder}
        />
        <select
          onChange={(e) => setToken(e.target.value)}
          value={token}
          defaultValue="matic"
          className="border-l-2 px-2 outline-0"
        >
          <option value="matic">Matic</option>
          <option value="dusd">Dusdc</option>
        </select>
      </div>
    </div>
  );
};
