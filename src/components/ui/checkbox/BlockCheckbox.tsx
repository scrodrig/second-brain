"use client";

import { getColorSelectorForCheckbox } from "@/utils";
import { Checkbox } from "@nextui-org/react";
import clsx from "clsx";

export const BlockCheckbox = (props: any) => {
  const { title, description, color } = props;
  return (
    <Checkbox
      size="lg"
      color="success"
      classNames={{
        base: getColorSelectorForCheckbox(color),
        label: "w-full",
      }}
      {...props}
    >
      <div className="w-full flex justify-between gap-2">
        <div className="flex items-center">
          <div className="flex flex-col items-start gap-1">
            {title}
            {description && (
              <span className="text-small text-foreground opacity-70">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">Icon</div>
      </div>
    </Checkbox>
  );
};
