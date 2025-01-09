import clsx from "clsx";

export const getColorSelectorForRadio = (
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined
) => {
  return clsx(
    "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
    "max-w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
    color === "primary" &&
      "data-[selected=true]:border-primary data-[selected=true]:bg-primary-100",
    color === "secondary" &&
      "data-[selected=true]:border-secondary data-[selected=true]:bg-secondary-100",
    color === "success" &&
      "data-[selected=true]:border-success data-[selected=true]:bg-success-100",
    color === "warning" &&
      "data-[selected=true]:border-warning data-[selected=true]:bg-warning-100",
    color === "danger" &&
      "data-[selected=true]:border-danger data-[selected=true]:bg-danger-100",
    (!color || color === "default") &&
      "data-[selected=true]:border-default data-[selected=true]:bg-default-100"
  );
};

export const getColorSelectorForCheckbox = (
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined
) => {
  return clsx(
    "w-full max-w-full bg-content1",
    "hover:bg-content2 items-center justify-start",
    "cursor-pointer rounded-lg gap-2 p-4 my-5 mb-4 border-2 border-transparent",
    color === "primary" &&
      "data-[selected=true]:border-primary data-[selected=true]:bg-primary-100",
    color === "secondary" &&
      "data-[selected=true]:border-secondary data-[selected=true]:bg-secondary-100",
    color === "success" &&
      "data-[selected=true]:border-success data-[selected=true]:bg-success-100",
    color === "warning" &&
      "data-[selected=true]:border-warning data-[selected=true]:bg-warning-100",
    color === "danger" &&
      "data-[selected=true]:border-danger data-[selected=true]:bg-danger-100",
    (!color || color === "default") &&
      "data-[selected=true]:border-default data-[selected=true]:bg-default-100"
  );
};
