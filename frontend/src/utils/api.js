export async function submitDebateDilemma(dilemmaData) {
  const response = await fetch("http://localhost:3000/api/debate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dilemmaData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to get debate response");
  }

  return response.json();
}
