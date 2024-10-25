// import { getUserData } from "@/api/api_v1";
// import { create } from "zustand";
// import { API_URL } from "@/config";

// type State = {
//   userName: string;
//   dailyGoal: number;
//   todayWaterIntake: number;
//   bottleWeight: number;
//   wakeupTime: string;
//   sleepTime: string;
//   sensorId: string;
// };

// type Action = {
//   updateUserInfo: () => void;
// };

// const useUserInfoStore = create<State & Action>((set) => ({
//   // Initial state
//   userName: "",
//   dailyGoal: 0,
//   todayWaterIntake: 0, // TODO:  You can manage this separately from the API if needed
//   bottleWeight: 0,
//   wakeupTime: "",
//   sleepTime: "",
//   sensorId: "",


//   updateUserInfo: async () => {
//     try {
//       const data = await getUserData();
//       set({
//         userName: data.name,
//         dailyGoal: data.daily_goal,
//         bottleWeight: data.bottle_weight,
//         wakeupTime: data.wakeup_time,
//         sleepTime: data.sleep_time,
//         sensorId: data.sensor_id,
//       });
//     } catch (error) {
//       console.error("Error updating user info:", error);
//     }

//     try {
//       const response = await fetch(`${API_URL}/v1/user/1/total-water-intake`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch todays water intake");
//       }

//       const data = await response.json()

//       set({
//         todayWaterIntake: data.total_water_intake
//       })
//     }

//     catch (error) {
//       console.error("Error while getting today's water intake");
//     }
//   },
// }));

// export default useUserInfoStore;
import { getUserData } from "@/api/api_v1";
import { create } from "zustand";
import { API_URL } from "@/config";

type State = {
  userName: string;
  dailyGoal: number;
  todayWaterIntake: number;
  bottleWeight: number;
  wakeupTime: string;
  sleepTime: string;
  sensorId: string;
  selectedDisease: string; // Add selected disease state
};

type Action = {
  updateUserInfo: () => void;
  setSelectedDisease: (disease: string) => void; // Action to set disease
};

const useUserInfoStore = create<State & Action>((set) => ({
  // Initial state
  userName: "",
  dailyGoal: 0,
  todayWaterIntake: 0, // TODO:  You can manage this separately from the API if needed
  bottleWeight: 0,
  wakeupTime: "",
  sleepTime: "",
  sensorId: "",
  selectedDisease: "none", // Default state

  updateUserInfo: async () => {
    try {
      const data = await getUserData();
      set({
        userName: data.name,
        dailyGoal: data.daily_goal,
        bottleWeight: data.bottle_weight,
        wakeupTime: data.wakeup_time,
        sleepTime: data.sleep_time,
        sensorId: data.sensor_id,
      });
    } catch (error) {
      console.error("Error updating user info:", error);
    }

    try {
      const response = await fetch(`${API_URL}/v1/user/1/total-water-intake`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch today's water intake");
      }

      const data = await response.json();

      set({
        todayWaterIntake: data.total_water_intake,
      });
    } catch (error) {
      console.error("Error while getting today's water intake");
    }
  },

  // Action to set the selected disease
  setSelectedDisease: (disease: string) => set({ selectedDisease: disease }),
}));

export default useUserInfoStore;
