import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import api from "../api/AxiosConfig";

const authorizer = (channel: any, options: any) => {
  return {
    authorize: (socketId: string, callback: Function) => {
      const authUrl = `${api.defaults.baseURL || ""}/broadcasting/auth`;
      console.log(
        `[Pusher Authorizer] Attempting to authorize channel: ${channel.name} with socket ${socketId} at ${authUrl}`
      );

      api
        .post("/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then((response) => {
          console.log(
            "[Pusher Authorizer] Authorization successful",
            response.data
          );
          callback(false, response.data);
        })
        .catch((error) => {
          console.error("[Pusher Authorizer] Authorization failed:", error);
          callback(true, error);
        });
    },
  };
};

const pusherClient = new Pusher(process.env.EXPO_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER!,
  forceTLS: true,
  authorizer: authorizer,
});

pusherClient.connection.bind("connected", () => {
  console.log("Pusher connected successfully");
});

pusherClient.connection.bind("connecting", () => {
  console.log("Pusher connecting...");
});

pusherClient.connection.bind("disconnected", () => {
  console.log("Pusher disconnected");
});

pusherClient.connection.bind("error", (err: any) => {
  console.error("Pusher connection error:", err);
});

const echo = new Echo({
  broadcaster: "pusher",
  client: pusherClient,
  authorizer: authorizer,
});

export default echo;
