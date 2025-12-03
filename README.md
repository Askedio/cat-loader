# Cat Loader

An animated SVG cat loader component built with React and Framer Motion.

## Features

- 🐱 Cute animated cat face
- 👀 Mouse-following eyes
- ✨ Multiple animation modes (lapping, eating)
- 🎨 Fully customizable animations
- 💝 Click to emit hearts
- 😎 Secret sunglasses feature (5 rapid clicks)
- 📱 Responsive design

## Development

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

The built files will be in the `dist` folder. Deploy the contents of `dist` to your GitHub Pages repository.

## GitHub Pages Deployment

1. Build the project: `npm run build`
2. Copy the contents of `dist` to your GitHub Pages repository
3. Or use GitHub Actions to automatically deploy on push

## Usage

```tsx
import { CatLoader } from "./components/CatLoader";

<CatLoader
  variant="lapping"
  size={52}
  isComplete={false}
  enableBlink={true}
  enableEyeTracking={true}
/>
```

## License

MIT

