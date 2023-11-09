export function calculateCombinedAestheticScore(
	ratingScore: number,
	artifactScore: number
): number {
	// Baselines for the scores
	const ratingBaseline = 0.2;
	const artifactBaseline = 0.1;

	// Normalizing the scores
	const normalizedRatingScore = Math.max(ratingScore - ratingBaseline, 0);
	const normalizedArtifactScore = Math.max(artifactScore - artifactBaseline, 0);

	// Apply a smooth and increasing exponential penalty to high artifact scores
	const exponent = -1.5 * normalizedArtifactScore - 2 * Math.max(artifactScore - 0.7, 0) ** 2;

	// Calculate the combined score with exponential decay
	let combinedScore = normalizedRatingScore * Math.exp(exponent);

	// Rescale the combined score to the 0-1 range
	const maxPossibleScore = (1 - ratingBaseline) * Math.exp(-1.5 * 0); // Max score when artifactScore is at baseline
	combinedScore = combinedScore / maxPossibleScore;

	// Ensure the score does not exceed 1
	return Math.min(combinedScore, 1);
}
