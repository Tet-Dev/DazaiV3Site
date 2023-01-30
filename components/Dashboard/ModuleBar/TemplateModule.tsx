export const TemplateModule = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { children, className } = props;
  return (
    <div
      className={`${className} col-span-1 h-48 border-gray-100/10 bg-gray-800 p-6 rounded-3xl hover:bg-gray-750 transition-colors cursor-pointer`}
    >
      {children}
    </div>
  );
};
