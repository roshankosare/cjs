type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
}

const Logo = ({ size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-base sm:text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <div
      className={`flex flex-row gap-x-1 font-bold ${sizeClasses[size]}`}
    >
      <p className="text-blue-600 dark:text-blue-500 font-extrabold">{`</>`}</p>
      <p className="text-foreground font-bold">Code</p>
      <p className="text-blue-600 dark:text-blue-500 font-bold">Arena</p>
    </div>
  );
};

export default Logo;

