import { categoryOptions, brandOptions } from "@/config";

function ProductFilter({ filters, setFilters, className = "" }) {
  function handleCheck(sectionId, optionId) {
    const current = filters[sectionId] || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    setFilters({ ...filters, [sectionId]: updated });
  }

  const sections = [
    { id: "category", label: "Category", options: categoryOptions },
    { id: "brand", label: "Brand", options: brandOptions },
  ];

  return (
    <div className={`h-fit space-y-6 rounded-lg border bg-white p-4 ${className}`}>
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className="mb-2 font-semibold">{section.label}</h3>
          <div className="space-y-1">
            {section.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(filters[section.id] || []).includes(opt.id)}
                  onChange={() => handleCheck(section.id, opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductFilter;
