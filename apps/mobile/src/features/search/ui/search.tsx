"use client";

import { Button, TextField, Text } from "@/shared/ui";

import { useSearchStore } from "../model/search-store";
import { View } from "react-native";

function Search() {
  const onChange = useSearchStore(state => state.updateSearchTerm);
  const searchTerm = useSearchStore(state => state.searchTerm);

  return (
    <View className="flex-row">
      <TextField
        containerClassName="flex-1"
        onChangeText={onChange}
        value={searchTerm}
        placeholder="Поиск по названию..."
      />

      {searchTerm.trim().length > 0 && (
        <Button
          data-testid="clear-search-button"
          aria-label="Очистить поиск"
          onPress={() => {
            onChange("");
          }}
          variant="secondary"
          className="cursor-pointer p-2"
        >
          <Text>Clear</Text>
        </Button>
      )}
    </View>
  );
}

export { Search };
