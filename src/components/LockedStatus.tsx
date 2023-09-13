import { cn } from "@/utils/helpers";

export const LockedStatus = ({
  isAccountLocked,
  onClick,
}: {
  isAccountLocked: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex justify-center w-max mx-auto mb-10 items-center px-10 py-2 gap-3 rounded-full",
        isAccountLocked
          ? "bg-red-100 cursor-pointer"
          : "bg-green-100 cursor-none"
      )}
    >
      <div
        className={cn(
          "w-3 h-3 rounded-full animate-pulse",
          isAccountLocked ? "bg-red-400" : "bg-green-400"
        )}
      ></div>
      <span>{isAccountLocked ? "Locked" : "Unlocked"}</span>
    </div>
  );
};
