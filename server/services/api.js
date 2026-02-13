// Reports API - ADD THIS
export const reportsAPI = {
  downloadDailyLog: (id) => {
    const token = localStorage.getItem('token');
    window.open(
      `${API_BASE_URL}/reports/daily-log/${id}?token=${token}`,
      '_blank'
    );
  },
  downloadDailyLogs: (params) => {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    window.open(
      `${API_BASE_URL}/reports/daily-logs?${queryString}&token=${token}`,
      '_blank'
    );
  },
  downloadEquipment: (params) => {
    const token = localStorage.getItem('token');
    const queryString = params ? new URLSearchParams(params).toString() : '';
    window.open(
      `${API_BASE_URL}/reports/equipment?${queryString}&token=${token}`,
      '_blank'
    );
  },
  downloadMaterials: () => {
    const token = localStorage.getItem('token');
    window.open(
      `${API_BASE_URL}/reports/materials?token=${token}`,
      '_blank'
    );
  },
};