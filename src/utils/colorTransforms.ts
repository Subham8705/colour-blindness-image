/**
 * Color Blindness Simulation Matrices
 * 
 * Based on research by:
 * - Brettel, H., Viénot, F., & Mollon, J. D. (1997). Computerized simulation of color appearance for dichromats.
 * - Machado, G. M., Oliveira, M. M., & Fernandes, L. A. (2009). A physiologically-based model for simulation of color vision deficiency.
 * 
 * These matrices transform RGB values to simulate how colors appear to people with different types of color blindness.
 */

export type SimulationType = 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia' | 'normal';

// RGB transformation matrices for color blindness simulation
// Each matrix is a 3x3 transformation applied to [R, G, B] vectors

export const SIMULATION_MATRICES: Record<SimulationType, number[][]> = {
  // Normal vision (identity matrix)
  normal: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  
  // Deuteranopia (green-blind) - most common form
  // Affects ~6% of males, ~0.4% of females
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  
  // Protanopia (red-blind)
  // Affects ~1% of males
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  
  // Tritanopia (blue-blind) - rare
  // Affects ~0.003% of the population
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  
  // Achromatopsia (complete color blindness)
  // Converts to grayscale using luminance weights
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export const SIMULATION_INFO: Record<SimulationType, { name: string; description: string; prevalence: string; tips: string[] }> = {
  normal: {
    name: 'Normal Vision',
    description: 'Standard color perception with all three types of cone cells functioning normally.',
    prevalence: 'Most of the population',
    tips: [],
  },
  deuteranopia: {
    name: 'Deuteranopia',
    description: 'Green-blindness caused by the absence of green cone cells. Greens appear brownish, and reds appear more yellowish.',
    prevalence: '~6% of males, ~0.4% of females',
    tips: [
      'Avoid using red and green as the only differentiators',
      'Use patterns or textures in addition to color',
      'Add text labels to colored elements',
    ],
  },
  protanopia: {
    name: 'Protanopia',
    description: 'Red-blindness caused by the absence of red cone cells. Reds appear darker and more greenish.',
    prevalence: '~1% of males',
    tips: [
      'Avoid red as a warning color without additional cues',
      'Use high contrast combinations',
      'Consider using blue instead of red for emphasis',
    ],
  },
  tritanopia: {
    name: 'Tritanopia',
    description: 'Blue-blindness caused by the absence of blue cone cells. Blues appear greenish, and yellows appear pinkish.',
    prevalence: '~0.003% of the population',
    tips: [
      'Avoid blue/yellow color combinations alone',
      'Use orange and purple as alternatives',
      'Ensure sufficient luminance contrast',
    ],
  },
  achromatopsia: {
    name: 'Achromatopsia',
    description: 'Complete color blindness where only shades of gray are perceived. Often accompanied by light sensitivity.',
    prevalence: '~0.003% of the population',
    tips: [
      'Rely on contrast, not color, for important information',
      'Use patterns, shapes, and icons',
      'Ensure all information is conveyed through non-color means',
    ],
  },
};

/**
 * Apply color blindness simulation to ImageData
 * 
 * @param imageData - The source ImageData to transform
 * @param simulationType - The type of color blindness to simulate
 * @param intensity - The intensity of the simulation (0-100)
 * @returns New ImageData with the simulation applied
 */
export function applySimulation(
  imageData: ImageData,
  simulationType: SimulationType,
  intensity: number
): ImageData {
  const matrix = SIMULATION_MATRICES[simulationType];
  const factor = intensity / 100;
  
  // Create a new Uint8ClampedArray for the result
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  
  // Process pixels in batches for better performance
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Apply matrix transformation
    const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
    const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
    const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
    
    // Interpolate between original and transformed based on intensity
    result[i] = Math.round(r + (newR - r) * factor);
    result[i + 1] = Math.round(g + (newG - g) * factor);
    result[i + 2] = Math.round(b + (newB - b) * factor);
    result[i + 3] = a; // Preserve alpha
  }
  
  return new ImageData(result, imageData.width, imageData.height);
}

/**
 * Calculate the maximum dimensions while preserving aspect ratio
 */
export function calculatePreviewDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number; scale: number } {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = originalWidth;
  let height = originalHeight;
  
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  const scale = width / originalWidth;
  
  return { width: Math.round(width), height: Math.round(height), scale };
}
