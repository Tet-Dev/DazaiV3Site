import { ComponentProps, Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export type SelectMenuItem = {
  id: string;
  name: string;
  image?: string | ((props: ComponentProps<any>) => JSX.Element | null);
};

export type SelectMenuProps = {
  selectItems: SelectMenuItem[];
  selectedItemId?: string;
  onSelect?: (id: SelectMenuItem) => void;
  label?: string;
  listClasses?: string;
  optionClasses?: string;
  overrideClasses?: string;
  labelClasses?: string;
  className?: string;
  disabled?: boolean;
};
export const SelectMenu = (props: SelectMenuProps) => {
  const [selected, setSelected] = useState(
    props.selectItems.find((x) => x.id === props.selectedItemId) || null
  );

  useEffect(() => {
    setSelected(
      props.selectItems.find((x) => x.id === props.selectedItemId) || selected
    );
  }, [props.selectedItemId, props.selectItems]);
  const updateSelected = (item: SelectMenuItem) => {
    setSelected(item);
    if (props.onSelect) {
      props.onSelect(item);
    }
  };
  if (!props.selectItems || !props.selectItems.length) {
    return null;
  }

  return (
    <Listbox
      value={selected}
      onChange={updateSelected}
      disabled={props.disabled}
    >
      {({ open }) => (
        <>
          <Listbox.Label
            className={`block text-sm font-wsans text-gray-300 ${
              !props.label && "hidden"
            } w-full ${props.labelClasses}`}
          >
            {props.label}
          </Listbox.Label>
          <div className={`relative ${props.className}`}>
            <Listbox.Button
              className={`${props.overrideClasses} relative w-full ${
                props.disabled && "opacity-25 transition-all"
              } bg-gray-850 border border-gray-700 rounded-xl shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none sm:text-sm focus:border-indigo-500 `}
            >
              <span className="flex items-center">
                {typeof selected?.image === "string" ? (
                  <img
                    src={selected?.image}
                    alt=""
                    className="flex-shrink-0 object-cover w-6 h-6 rounded-lg"
                  />
                ) : (
                  (() => {
                    const Component = selected?.image!;
                    return (
                      (Component && (
                        <Component className="flex-shrink-0 w-6 h-6 rounded-full" />
                      )) ||
                      null
                    );
                  })()
                )}
                <span className="block ml-3 truncate text-gray-300">
                  {selected?.name}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
                <ChevronUpDownIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition duration-200"
              enterFrom="transform opacity-0 scale-0"
              enterTo="transform opacity-100 scale-100"
              leave="transition duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-0"

              // leave="transition-all duration-200"
              // leaveFrom="translate-y-0 opacity-100"
              // leaveTo="-translate-y-2/4 opacity-0"
              // enter="transition-all duration-200"
              // enterFrom="transform -translate-y-3/4 opacity-0"
              // enterTo="transform translate-y-0 opacity-100"
            >
              <Listbox.Options
                className={`absolute z-10 mt-1 w-full ${
                  props.disabled && "opacity-25"
                } ${
                  props.optionClasses
                } bg-gray-850 shadow-lg max-h-56 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm rounded-lg`}
              >
                {props?.selectItems &&
                  props?.selectItems?.map((option) => (
                    <Listbox.Option
                      key={option.id}
                      className={({ active }) =>
                        classNames(
                          active
                            ? `text-white bg-indigo-500`
                            : "text-gray-200",
                          "cursor-default select-none relative py-2 pl-3 pr-9 transition-all text-sm"
                        )
                      }
                      value={option}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {typeof option.image === "string" ? (
                              <img
                                src={option.image}
                                alt=""
                                className="flex-shrink-0 object-cover w-6 h-6 rounded-lg"
                              />
                            ) : (
                              (() => {
                                const Component = option.image!;
                                return (
                                  (Component && (
                                    <Component className="flex-shrink-0 w-6 h-6 rounded-full" />
                                  )) ||
                                  null
                                );
                              })()
                            )}
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {option.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : `text-indigo-500`,
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
export default SelectMenu;
