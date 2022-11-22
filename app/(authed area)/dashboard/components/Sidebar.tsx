import { useAllGuilds } from "../../../../utils/hooks/useAllGuilds";
import { DashboardCard } from "./DashboardCard";

export const Sidebar = () => {
  const guilds = useAllGuilds();
  return (
    <div className={`w-64 h-full bg-gray-800 text-white p-4 flex flex-col`}>
      {guilds?.map((guild) => (
        <DashboardCard guild={guild} />
      ))}
    </div>
  );
};
