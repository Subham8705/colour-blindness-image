# Color Blindness Simulator

A polished, accessible tool that lets users upload images or use their webcam to preview how colors appear to people with different types of color vision deficiencies.

## Features

- **Image Input**: Drag-and-drop or file picker for uploading images
- **Webcam Support**: Real-time simulation using your device's camera
- **Multiple Simulation Modes**:
  - **Deuteranopia** (green-blindness) - ~6% of males
  - **Protanopia** (red-blindness) - ~1% of males  
  - **Tritanopia** (blue-blindness) - rare
  - **Achromatopsia** (complete color blindness) - rare
- **Intensity Control**: Adjustable slider (0-100%) to blend between original and simulated views
- **Interactive Comparison**: Draggable slider to compare original vs. simulated side-by-side
- **Download**: Export simulated images at full resolution as PNG
- **Accessible**: Full keyboard navigation, ARIA labels, and screen reader support

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
3. **Select Simulation Mode**: Choose from Deuteranopia, Protanopia, Tritanopia, or Achromatopsia
4. **Adjust Intensity**: Use the slider to control the simulation strength (0% = original, 100% = full simulation)
5. **Compare**: Drag the comparison slider to see original vs. simulated views
6. **Download**: Click "Download PNG" to save the simulated image at full resolution

## Technical Implementation

### Color Transform Matrices

The simulator uses scientifically-based color transformation matrices derived from:

- Brettel, H., Viénot, F., & Mollon, J. D. (1997). "Computerized simulation of color appearance for dichromats"
- Machado, G. M., Oliveira, M. M., & Fernandes, L. A. (2009). "A physiologically-based model for simulation of color vision deficiency"

### Performance Optimizations

- **Typed Arrays**: Uses `Uint8ClampedArray` for fast pixel manipulation
- **Debounced Updates**: Intensity slider changes are debounced to prevent excessive re-renders
- **Throttled Webcam**: Video frames processed at ~15 FPS to balance quality and performance
- **Aspect Ratio Preservation**: Large images are downscaled for preview while maintaining full resolution for downloads

## Accessibility Notes

This tool was built with accessibility as a core principle:

- **Keyboard Navigation**: All controls are fully keyboard accessible
- **ARIA Labels**: Comprehensive ARIA attributes for screen readers
- **Skip Links**: Skip-to-content link for keyboard users
- **Focus Management**: Clear focus indicators throughout
- **Color Independence**: UI doesn't rely solely on color to convey information

### Design Recommendations

When designing for colorblind users:

1. Never use color alone to convey information
2. Add text labels, patterns, or icons alongside colors
3. Ensure sufficient contrast ratios (WCAG 2.1 Level AA minimum)
4. Test with actual colorblind users when possible
5. Consider using colorblind-safe palettes for data visualizations

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Canvas API** - Pixel manipulation for simulations

