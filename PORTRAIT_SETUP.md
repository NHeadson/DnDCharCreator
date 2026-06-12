# Portrait Images Setup

To add character portraits to the application, place image files in the following directory structure:

```text
public/assets/portraits/
├── dragonborn/
│   ├── female/
│   │   ├── 1.jpg
│   │   └── 2.jpg (optional)
│   └── male/
│       ├── 1.jpg
│       └── 2.jpg (optional)
├── dwarf/
│   ├── hill/
│   │   ├── female/
│   │   │   ├── 1.jpg
│   │   │   └── 2.jpg (optional)
│   │   └── male/
│   │       ├── 1.jpg
│   │       └── 2.jpg (optional)
│   └── mountain/
│       ├── female/
│       │   ├── 1.jpg
│       │   └── 2.jpg (optional)
│       └── male/
│           ├── 1.jpg
│           └── 2.jpg (optional)
├── elf/
│   ├── dark/
│   ├── high/
│   └── wood/
│       └── [female/male]/1.jpg, 2.jpg
├── gnome/
│   ├── forest/
│   └── rock/
│       └── [female/male]/1.jpg, 2.jpg
├── halfling/
│   ├── lightfoot/
│   └── stout/
│       └── [female/male]/1.jpg, 2.jpg
├── half-elf/
├── half-orc/
├── human/
└── tiefling/
    └── [female/male]/1.jpg, 2.jpg
```

## Important Notes

- **Races with subspecies**: dwarf (hill/mountain), elf (dark/high/wood), gnome (forest/rock), halfling (lightfoot/stout)
- **Races without subspecies**: dragonborn, half-elf, half-orc, human, tiefling
- **File naming**: Always use `1.jpg` and optionally `2.jpg` for each gender directory
- **Subspecies inclusion**: All subspecies portraits are shown together for each race

- **Format**: JPG or PNG
- **Size**: Square aspect ratio recommended (256x256px or larger)
- **Naming**: Numbered sequentially starting from 1.jpg, 2.jpg, etc.
- **Quality**: High resolution for best display

## How it Works

- The PortraitSelector component automatically detects and displays all images in the appropriate race/gender folders
- Missing images show a placeholder icon
- Images are displayed in a grid layout for easy selection
- Users can click on any portrait to select it for their character

## Adding New Images

1. Create the appropriate folder structure if it doesn't exist
2. Add your portrait images as numbered JPG files
3. Restart the development server if needed
4. The new portraits will automatically appear in the character creator
