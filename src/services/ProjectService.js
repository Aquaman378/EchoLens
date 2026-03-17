// src/services/ProjectService.js

// This is your mock API for now, representing your "Zeno Cloud"
export const getProjects = async () => {
  // In the future, this will be an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("Fetching projects...");
  
  return [
    {
      projectId: "1",
      projectName: "Client_Gallery_08",
      status: "DISPATCHED",
      lastUpdated: "2m ago"
    },
    {
      projectId: "2",
      projectName: "Studio_Shoot_Raw",
      status: "PROCESSING",
      lastUpdated: "15m ago"
    }
  ];
};