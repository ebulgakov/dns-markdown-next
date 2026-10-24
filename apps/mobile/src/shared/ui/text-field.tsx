import * as React from "react";
import { Platform, TextInput, type TextInputProps, View } from "react-native";

import { cn } from "@/lib/cn";

import { Text } from "./text";

type TextFieldProps = TextInputProps & {
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  errorMessage?: string;
  materialVariant?: "outlined" | "filled";
  materialRingColor?: string;
  materialHideActionIcons?: boolean;
};

const TextField = React.forwardRef<TextInput, TextFieldProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      leftView,
      rightView,
      errorMessage,
      materialVariant = "outlined",
      materialRingColor: _materialRingColor,
      materialHideActionIcons: _materialHideActionIcons,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasError = Platform.OS === "android" && !!errorMessage;

    return (
      <View className={cn("gap-1.5", containerClassName)}>
        {label ? (
          <Text variant="subhead" color="secondary" className={labelClassName}>
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            "flex-row items-center gap-2 rounded-lg border px-3",
            materialVariant === "filled" ? "bg-muted/40" : "bg-background",
            hasError ? "border-destructive" : isFocused ? "border-primary" : "border-input"
          )}
        >
          {leftView}
          <TextInput
            ref={ref}
            className={cn(
              "native:h-11 flex-1 py-2.5 text-[17px] leading-6 text-foreground",
              className
            )}
            accessibilityHint={Platform.OS === "ios" ? errorMessage : props.accessibilityHint}
            onFocus={event => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={event => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            {...props}
          />
          {rightView}
        </View>
        {hasError ? (
          <Text variant="footnote" className="text-destructive">
            {errorMessage}
          </Text>
        ) : null}
      </View>
    );
  }
);
TextField.displayName = "TextField";

export { TextField };
export type { TextFieldProps };
