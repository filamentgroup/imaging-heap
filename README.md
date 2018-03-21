# image-report

## Installation

```
Not on NPM yet!
```

## Usage

```
node src/cmd.js https://filamentgroup.com/
node src/cmd.js https://smashingmagazine.com/
node src/cmd.js https://css-tricks.com/
```

## TODO

* Add more automated tests

## Sample output

```
╔══════════╤══════════╤═══════╤════════════╤════════╤════════════╤════════╤════════════╗
║          │ Image    │ @1x   │ @1x        │ @2x    │ @2x        │ @3x    │ @3x        ║
║          │ Width in │ Image │ Percentage │ Image  │ Percentage │ Image  │ Percentage ║
║ Viewport │ Layout   │ Width │ Match      │ Width  │ Match      │ Width  │ Match      ║
╟──────────┼──────────┼───────┼────────────┼────────┼────────────┼────────┼────────────╢
║ 320px    │ 161px    │ 301px │ 187.0%     │ 301px  │ 93.5%      │ 601px  │ 125.2%     ║
║ 480px    │ 241px    │ 301px │ 124.9%     │ 601px  │ 125.2%     │ 601px  │ 83.5%      ║
║ 640px    │ 321px    │ 601px │ 187.2%     │ 601px  │ 93.6%      │ 901px  │ 93.9%      ║
║ 800px    │ 401px    │ 601px │ 149.9%     │ 901px  │ 112.6%     │ 1201px │ 100.1%     ║
║ 960px    │ 480px    │ 600px │ 125.0%     │ 900px  │ 93.8%      │ 1200px │ 83.3%      ║
║ 1120px   │ 560px    │ 600px │ 107.1%     │ 1200px │ 107.1%     │ 1200px │ 71.4%      ║
║ 1280px   │ 640px    │ 900px │ 140.6%     │ 1200px │ 93.8%      │ 1200px │ 62.5%      ║
╚══════════╧══════════╧═══════╧════════════╧════════╧════════════╧════════╧════════════╝
```

