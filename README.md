# Color Blindness Simulator

A polished, accessible tool that lets users upload images or use their webcam to preview how colors appear to people with different types of color vision deficiencies. It includes advanced features like Daltonization (correction) and WCAG contrast checking.

## Features

- **Image Input**: Drag-and-drop or file picker for uploading images
- **Webcam Support**: Real-time simulation using your device's camera
- **Dual Modes (New!)**:
  - **Simulate**: See how the world looks to a color-blind person.
  - **Correct (Daltonization)**: Intelligently shifts colors to make them distinguishable for color-blind users.
- **Multiple Color Vision Types**:
  - **Deuteranopia** (green-blindness) - ~6% of males
  - **Protanopia** (red-blindness) - ~1% of males  
  - **Tritanopia** (blue-blindness) - rare
  - **Achromatopsia** (complete color blindness) - rare
- **Accessible Tools (New!)**:
  - **Contrast Checker**: Pick two colors from the image to verify WCAG compliance (AA/AAA).
  - **Split-View Download**: Export images side-by-side (Original vs. Simulated) for easy comparison.
- **Interactive Comparison**: Draggable slider to compare original vs. simulated side-by-side
- **Download**: Export simulated images at full resolution as PNG

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## How to Use

1. **Upload an Image**: Drag and drop an image onto the upload area, or click to browse
2. **Or Use Webcam**: Click "Use Webcam" to enable real-time camera simulation
3. **Choose Mode**: Toggle between **Simulate** (to understand the condition) or **Correct** (to help differentiate colors).
4. **Select Type**: Choose from Deuteranopia, Protanopia, Tritanopia, or Achromatopsia
5. **Adjust Intensity**: Use the slider to control the simulation strength (0% = original, 100% = full simulation)
6. **Check Contrast**: Use the Contrast Checker tool below the image to test readability.
7. **Download**: Click "Download" to save the result. You can choose "Result Only" or "Split View".

## Technical Implementation

### Color Transform Matrices and Daltonization

The simulator uses scientifically-based color transformation matrices derived from:

- Brettel, H., Viénot, F., & Mollon, J. D. (1997). "Computerized simulation of color appearance for dichromats"
- Machado, G. M., Oliveira, M. M., & Fernandes, L. A. (2009). "A physiologically-based model for simulation of color vision deficiency"

**Daltonization Mode:**
This feature uses the LMS color space to calculate the difference (error) between the original and simulated image. It then shifts this error into a visible spectrum for the selected color blindness type, effectively increasing contrast between confusing colors.

### Performance Optimizations

- **Typed Arrays**: Uses `Uint8ClampedArray` for fast pixel manipulation
- **Debounced Updates**: Intensity slider changes are debounced to prevent excessive re-renders
- **Throttled Webcam**: Video frames processed at ~15 FPS to balance quality and performance
- **Web Workers**: Heavy computations (optional optimization) run off the main thread

## Accessibility Notes

This tool was built with accessibility as a core principle:

- **Keyboard Navigation**: All controls are fully keyboard accessible
- **ARIA Labels**: Comprehensive ARIA attributes for screen readers
- **Skip Links**: Skip-to-content link for keyboard users
- **Focus Management**: Clear focus indicators throughout

### Design Recommendations for Developers

1. Never use color alone to convey information
2. Add text labels, patterns, or icons alongside colors
3. Ensure sufficient contrast ratios (WCAG 2.1 Level AA minimum)
4. Test with actual colorblind users when possible

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Canvas API** - Pixel manipulation for simulations
