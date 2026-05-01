package com.sih.backend.util;

/**
 * Utility class for generating custom Problem IDs in format: NV01, NV02, NV03...
 * NV = "Nayi Vichar" (New Idea in Hindi)
 */
public class ProblemIdGenerator {
    private static final String PREFIX = "NV";
    private static final int PAD_WIDTH = 2;

    /**
     * Generate a new problem ID based on sequence number
     * @param sequenceNumber The sequence number (1, 2, 3...)
     * @return Problem ID like "NV01", "NV02", "NV99", "NV100"
     */
    public static String generateProblemId(int sequenceNumber) {
        if (sequenceNumber <= 0) {
            throw new IllegalArgumentException("Sequence number must be positive");
        }
        return PREFIX + String.format("%0" + PAD_WIDTH + "d", sequenceNumber);
    }

    /**
     * Parse a problem ID to extract the sequence number
     * @param problemId The problem ID like "NV01"
     * @return The sequence number (1 for "NV01", etc.)
     */
    public static int parseSequenceFromId(String problemId) {
        if (problemId == null || !problemId.startsWith(PREFIX)) {
            throw new IllegalArgumentException("Invalid problem ID format: " + problemId);
        }
        try {
            return Integer.parseInt(problemId.substring(PREFIX.length()));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid problem ID format: " + problemId, e);
        }
    }
}
