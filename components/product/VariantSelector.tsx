'use client';

interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  available: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  options,
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const handleOptionChange = (optionName: string, value: string) => {
    // Find the variant that matches the selected options
    const newSelectedOptions = selectedVariant.selectedOptions.map((opt) =>
      opt.name === optionName ? { name: optionName, value } : opt
    );

    const matchingVariant = variants.find((variant) =>
      variant.selectedOptions.every((opt) => {
        const newOpt = newSelectedOptions.find((o) => o.name === opt.name);
        return newOpt && newOpt.value === opt.value;
      })
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  // Check if color option (for special styling)
  const isColorOption = (optionName: string) => {
    const colorLabels = ['color', 'colour', 'couleur', 'colore', 'farbe'];
    return colorLabels.includes(optionName.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const selectedValue = selectedVariant.selectedOptions.find(
          (opt) => opt.name === option.name
        )?.value || option.values[0];

        return (
          <div key={option.name}>
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider">
              {option.name}: <span className="font-normal">{selectedValue}</span>
            </label>

            {isColorOption(option.name) ? (
              // Color swatches
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value;
                  const colorClass = value.toLowerCase().replace(/\s+/g, '-');

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`group relative h-10 w-10 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      title={value}
                      aria-label={`Select ${value}`}
                    >
                      <span
                        className={`absolute inset-0.5 rounded-full`}
                        style={{
                          backgroundColor: value.toLowerCase(),
                        }}
                      />
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                        {value}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Standard option buttons
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value;
                  
                  // Check if this option is available
                  const isAvailable = variants.some((variant) =>
                    variant.selectedOptions.some(
                      (opt) => opt.name === option.name && opt.value === value
                    ) && variant.available
                  );

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      disabled={!isAvailable}
                      className={`min-w-[60px] border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : isAvailable
                          ? 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
                          : 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
