"use client";

import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

type PhoneInputWithCountryProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function PhoneInputWithCountry({
  value,
  onChange,
  className = "",
}: PhoneInputWithCountryProps) {
  return (
    <div className={`PhoneInputWrapper ${className}`}>
      <PhoneInput
        international
        defaultCountry="GB"
        flags={flags}
        value={value || undefined}
        onChange={(v) => onChange(v || "")}
      />
      <style>{`
        .PhoneInputWrapper .PhoneInput {
          display: flex;
          align-items: center;
          gap: 0;
          height: 44px;
          border: 1px solid #d9d9d9;
          transition: border-color 0.2s;
        }
        .PhoneInputWrapper .PhoneInput:focus-within {
          border-color: #000;
        }
        .PhoneInputWrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 8px;
          height: 100%;
          border-right: 1px solid #d9d9d9;
          cursor: pointer;
        }
        .PhoneInputWrapper .PhoneInputCountryIcon {
          width: 20px;
          height: 14px;
          display: flex;
          align-items: center;
        }
        .PhoneInputWrapper .PhoneInputCountryIconImg {
          width: 20px;
          height: 14px;
          object-fit: cover;
        }
        .PhoneInputWrapper .PhoneInputCountrySelectArrow {
          width: 8px;
          height: 8px;
          border: solid #6a6a6a;
          border-width: 0 1.5px 1.5px 0;
          transform: rotate(45deg);
          margin-bottom: 4px;
          opacity: 0.6;
        }
        .PhoneInputWrapper .PhoneInputInput {
          flex: 1;
          height: 100%;
          border: none;
          outline: none;
          padding: 0 12px;
          font-size: 14px;
          color: #1f1f1f;
          background: transparent;
          min-width: 0;
        }
        .PhoneInputWrapper .PhoneInputInput::placeholder {
          color: #999;
        }
      `}</style>
    </div>
  );
}
