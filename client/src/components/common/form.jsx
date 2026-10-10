import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/form-elements";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText = "Submit", isBtnDisabled }) {
  function renderInputsByComponentType(control) {
    const value = formData[control.name] || "";

    switch (control.componentType) {
      case "textarea":
        return (
          <Textarea
            name={control.name}
            value={value}
            onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
          />
        );
      case "select":
        return (
          <Select
            options={control.options}
            value={value}
            onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
          />
        );
      case "multi-checkbox": {
        const selected = Array.isArray(formData[control.name]) ? formData[control.name] : [];
        return (
          <div className="flex flex-wrap gap-3">
            {control.options.map((opt) => (
              <label key={opt.id} className="flex items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.id)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, opt.id]
                      : selected.filter((s) => s !== opt.id);
                    setFormData({ ...formData, [control.name]: next });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      }
      default:
        return (
          <Input
            type={control.type || "text"}
            name={control.name}
            value={value}
            onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
          />
        );
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="space-y-4"
    >
      {formControls.map((control) => (
        <div key={control.name}>
          <Label>{control.label}</Label>
          {renderInputsByComponentType(control)}
        </div>
      ))}
      <Button type="submit" disabled={isBtnDisabled} className="w-full">
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;
