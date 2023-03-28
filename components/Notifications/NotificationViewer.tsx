import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { Notif } from "../../utils/classes/NotificationsClass";
// const MarkdownRenderer = loadable(() => import('../MarkdownRenderer'))

export const NotificationViewer = (props: {
  notification: Notif;
  dismiss: () => void;
}) => {
  const { notification, dismiss } = props;
  const [duration, setDuration] = useState(notification.duration || 5000);
  const [isVisible, setIsVisible] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(1);
    }, 1);
    setTimeout(() => {
      setIsVisible(2);
    }, 350);
    setTimeout(() => {
      setIsVisible(0);
      setTimeout(() => {
        dismiss();
      }, 150);
    }, duration - 150);
  }, [notification]);
  const Icon = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationIcon,
    info: InformationCircleIcon,
  }[notification.type];
  const iconColor = {
    success: "green",
    error: "red",
    warning: "yellow",
    info: "blue",
  }[notification.type];

  return (
    <Transition
      show={!!isVisible}
      enter="transition ease-out transform duration-150 delay-150"
      enterFrom="opacity-0 translate-x-full"
      enterTo="opacity-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 translate-x-full"
    >
      <div
        className={`flex flex-col gap-2 w-[48ch] max-w-[80vw] rounded-xl cursor-pointer z-50 shadow-md overflow-hidden bg-gray-750 hover:brightness-110 border-gray-100/10 border text-gray-100`}
        onClick={() => {
          setIsVisible(0);
          notification.onClick && notification.onClick();
          setTimeout(() => {
            dismiss();
          }, 150);
        }}
      >
        <div
          className={`flex flex-row gap-1.5 bg-${iconColor}-500 bg-opacity-25 p-1.5 items-center px-4`}
        >
          {notification.image ? (
            <img src={notification.image} className="w-6 h-6" />
          ) : (
            <Icon
              className={`w-6 h-6 flex-shrink-0 text-${iconColor}-500 stroke-current`}
            />
          )}
          <span className={`text-md text-gray-50/50 whitespace-normal`}>
            {notification.type.charAt(0).toUpperCase()}
            {notification.type.slice(1)}
          </span>
        </div>
        <span className={`text-lg whitespace-normal px-4 pt-2 font-bold font-poppins`}>
          {notification.title}
        </span>
        <div className={`text-sm whitespace-pre-wrap px-4 pb-2 font-wsans`}>
          {/* <MarkdownRenderer> */}
          {notification.message}
          {/* </MarkdownRenderer> */}
        </div>
        <div
          style={{ transitionDuration: `${duration - 575}ms` }}
          className={`${
            isVisible === 2 ? `w-full` : `w-0`
          } h-1 bg-${iconColor}-500 transition-all ease-linear`}
        ></div>
      </div>
      {/* <div
        className={`flex flex-col inf:w-128 2xl:w-112 2xl:w-96 2xl:w-full rounded-lg overflow-hidden cursor-pointer z-50 shadow-md 2xl:p-2 2xl:px-4 dark:bg-neutral-700 dark:drop-shadow-md  bg-white`}
        onClick={() => {
          setIsVisible(false)
          notification.onClick && notification.onClick()
          setTimeout(() => {
            dismiss()
          }, 200)
        }}
      >
        <div
          className={`flex flex-row flex-grow-0 inf:p-4 2xl:p-3 2xl:p-2 md:p-2 sm:p-1 w-full items-center inf:gap-4 2xl:gap-2 wrap`}
        >
          {notification.image ? (
            <img src={notification.image} className="w-8 h-8" />
          ) : (
            <Icon className={`w-10 h-10 flex-shrink-0 text-${iconColor}-500 stroke-current`} />
          )}
          <div className={`flex flex-row basis-full flex-shrink-0`}>
            <span className={`text-lg w-full whitespace-normal 2xl:text-base`}>{notification.title}</span>
            <div className={`text-xs whitespace-pre-wrap w-max`}></div>
          </div>
        </div>
        <div className={`w-full 2xl:py-2 bg-transparent `}>
          <div className={`w-full bg-gray-200 dark:bg-neutral-800 overflow-hidden rounded-full`}>
            <div
              style={{ transitionDuration: `${duration}ms` }}
              // className={`${countdownStarted ? `w-0` : `w-full`} h-1 bg-${iconColor}-500 transition-all ease-linear`}
            ></div>
          </div>
        </div>
      </div> */}
    </Transition>
  );
};
export default NotificationViewer;
