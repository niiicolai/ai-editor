import { JSX, useEffect, useState } from "react";

export default function DropdownComponent({
  slot,
  buttonText,
  className,
  id,
}: {
  slot: JSX.Element;
  buttonText: string;
  className: string;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOutside = (e:any) => {
    if (e?.target?.id == `drop-down-${id}`) return
    if (e?.target?.id == `drop-down-button-${id}`) return
    if (e?.target?.id == `drop-down-slot-${id}`) return
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div id={`drop-down-${id}`} className="relative">
      <button className="button-main" id={`drop-down-button-${id}`} onClick={() => setIsOpen(!isOpen)}>
        {buttonText}
      </button>
      {isOpen && (
        <div id={`drop-down-slot-${id}`} className={`fixed main-bgg text-sm main-color text-white shadow-md rounded-md border border-color z-150 ${className}`}>
          {slot}
        </div>
      )}
    </div>
  );
}
