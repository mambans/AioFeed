import { useState } from "react";

export default initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    manualSet: {
      onClick: event => {
        setValue(event.target.textContent.trim());
      },
    },
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value.trim());
      },
    },
  };
};
