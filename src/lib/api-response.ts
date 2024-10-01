interface ApiResponse<T = null> {
  status: boolean;
  message: string;
  data?: T;
}

export function createApiResponse<T = null>(
  status: boolean,
  message: string,
  data?: T,
): ApiResponse<T> {
  return {
    status,
    message,
    ...(data !== undefined && { data }), // Tambahkan 'data' hanya jika ada
  };
}
