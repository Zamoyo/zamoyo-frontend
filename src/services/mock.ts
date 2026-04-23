type SimulateOptions = {
  delay?: number;
  errorRate?: number;
  errorMessage?: string;
};

export async function simulateRequest<T>(
  data: T,
  options: SimulateOptions = {},
): Promise<T> {
  const {
    delay = 400,
    errorRate = 0,
    errorMessage = "Something went wrong.",
  } = options;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (errorRate > 0 && Math.random() < errorRate) {
    throw new Error(errorMessage);
  }

  return data;
}
