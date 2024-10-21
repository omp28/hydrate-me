import { API_URL } from '@/config'
import transformData from '@/utils/filterData';

export const getTodayWaterConsumption = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/user/1/today-water-intake`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      }
    });
    if (!response.ok) {
      throw new Error('Fail to fetch daily water Consumption list');
    }
    const data = await response.json();
    return transformData(data);
  }
  catch (error) {
    console.error('Error fetching water cunsomption:', error);
    throw error;
  }
}

export const getUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/user/1`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }

    const data = await response.json();
    return data
  }
  catch (error) {
    console.error("Error fetching user data")
  }
}

export const getIsBottleOnDock = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/user/1/is-bottle-on-dock`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bottle dock status");
    }

    const data = await response.json();
    return data.is_bottle_on_dock;
  }
  catch (error) {
    console.error("Error fetching bottle dock status", error);
    return null;
  }
};

export const getCurrentBottleLevel = async () => {
  try {
    const response = await fetch(`${API_URL}/v1/user/1/current-water-level`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch current water level of bottle: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.current_water_level;

  } catch (error) {
    console.error("Error fetching current bottle level: ", error);  // Log the actual error
    return null;
  }
};
