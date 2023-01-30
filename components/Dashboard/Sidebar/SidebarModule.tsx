import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationsClass } from "../../../utils/classes/NotificationsClass";

export const GuildSidebarModule = (props: {
  name: string;
  icon: JSX.Element;
  route: string;
  disabled?: string;
}) => {
  const { name, icon, route, disabled } = props;
  const pathname = usePathname();
  return (
    <Link href={route}>
      <div
        className={`flex flex-row gap-4 ${
          route.toLowerCase() === pathname?.toLowerCase()
            ? `text-indigo-400 hover:text-indigo-200`
            : `hover:text-indigo-300 text-gray-100`
        } cursor-pointer transition-colors duration-200`}
        onClick={(e) => {
          if (disabled) {
            e.stopPropagation();
            e.preventDefault()
            NotificationsClass.getInstance().addNotif({
              title: "Error",
              message: disabled,
              type: "error",
              duration: 5000,
            });
          }
        }}
      >
        <div className={``}>{icon}</div>
        <div className={``}>{name}</div>
      </div>
    </Link>
  );
};
