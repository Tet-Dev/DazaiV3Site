import Link from "next/link";
import { useRouter } from "next/router";
import { NotificationsClass } from "../../../utils/classes/NotificationsClass";

export const GuildSidebarModule = (props: {
  name: string;
  icon: JSX.Element;
  route: string;
  disabled?: string;
  onClick?: () => void;
}) => {
  const { name, icon, route, disabled, onClick } = props;
  const pathname = useRouter().pathname;
  return (
    <Link href={route}>
      <div
        className={`flex flex-row gap-4 ${
          route.toLowerCase() === pathname?.toLowerCase()
            ? `text-indigo-400 hover:text-indigo-200`
            : `hover:text-indigo-300 text-gray-100`
        } cursor-pointer transition-colors duration-200`}
        onClick={(e) => {
          if (onClick) onClick();
          if (disabled) {
            e.stopPropagation();
            e.preventDefault();
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
        <div className={`font-wsans font-medium`}>{name}</div>
      </div>
    </Link>
  );
};
