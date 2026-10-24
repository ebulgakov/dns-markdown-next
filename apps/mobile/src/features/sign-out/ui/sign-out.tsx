import { useAuth } from "@clerk/expo";
import { TouchableOpacity, Text } from "react-native";

function SignOut() {
  const { signOut } = useAuth();

  return (
    <TouchableOpacity onPress={() => signOut()}>
      <Text style={{ color: "#007AFF", fontSize: 16 }}>Выход</Text>
    </TouchableOpacity>
  );
}

export { SignOut };
