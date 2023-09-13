import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Loader2Icon } from "lucide-react";
export default function OtpModal({
  isOpen,
  closeModal,
  otp,
  setOtp,
  verifyOtp,
}: {
  isOpen: boolean;
  closeModal: () => void;
  otp: string;
  setOtp: (value: string) => void;
  verifyOtp: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          static={true}
          as="div"
          className="relative z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left flex flex-col justify-center items-center gap-5 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-gray-900"
                  >
                    Authenticaion
                  </Dialog.Title>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border text-xl px-2 py-1 text-black outline-0 rounded-md border-gray-400"
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsLoading(true);
                        verifyOtp();
                        setIsLoading(false);
                      }}
                    >
                      {isLoading ? (
                        <Loader2Icon className="mx-auto animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
