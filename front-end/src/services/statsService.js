import { apiService } from "./api"

export const statsService = {
  async getDashboardStats() {
    return apiService.get("/stats/dashboard")
  },

  async getReportsData() {
    return apiService.get("/stats/reports")
  },
}
