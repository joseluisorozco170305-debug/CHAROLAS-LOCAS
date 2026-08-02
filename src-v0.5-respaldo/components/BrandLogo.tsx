import logo from "../assets/logo-charolas-locas.png";

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Logo CHAROLAS LOCAS"
        className={`${compact ? "h-12 w-12" : "h-16 w-16"} rounded-2xl object-cover shadow-md`}
      />
      <div>
        <p className="font-black leading-none text-pink-600">CHAROLAS</p>
        <p className="font-black leading-none text-orange-500">LOCAS</p>
      </div>
    </div>
  );
}
