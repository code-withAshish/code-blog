import { API_URL } from "./useRequest";

export async function fetchGraphqlQuery(
  query: string,
  variables?: Record<string, string>
) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const JsonRes = await response.json();

  return JsonRes.data;
}
