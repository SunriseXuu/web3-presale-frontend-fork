import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      toastOptions={{
        style: {
          maxWidth: "75%",
          backgroundColor: "#a259ff",
          color: "white",
          fontSize: "14px",
          padding: "6px 12px",
          overflow: "hidden",
        },
      }}
      position="bottom-right"
      containerStyle={{ bottom: 85, right: 10 }}
    />
  );
}
