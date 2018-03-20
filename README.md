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

You can see from the following example taken from `css-tricks.com` that the file widths for @2x and @3x have no variation and likely could benefit from another `srcset` entry (especially with an image service like cloudinary).

```
<img width="640" height="320" src="https://cdn.css-tricks.com/wp-content/uploads/2018/03/image-container-mouseover.gif" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="An animated image of a container that changes perspective when the mouse hovers over it." srcset="https://res.cloudinary.com/css-tricks/image/upload/c_scale,w_640/v1520378697/image-container-mouseover_ibtt8v.gif 640w, https://res.cloudinary.com/css-tricks/image/upload/c_scale,w_508/v1520378697/image-container-mouseover_ibtt8v.gif 508w, https://res.cloudinary.com/css-tricks/image/upload/c_scale,w_200/v1520378697/image-container-mouseover_ibtt8v.gif 200w" sizes="(min-width: 1400px) 856px,
       (min-width: 1086px) calc(100vw - 490px),
       (min-width: 626px)  calc(100vw - 335px),
                           calc(100vw - 30px)">
╔══════════╤══════════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗
║ Viewport │ Width in │ Match │ File  │ Match │ File  │ Match │ File  ║
║          │ Layout   │ to 1x │ Width │ to 2x │ Width │ to 3x │ Width ║
╟──────────┼──────────┼───────┼───────┼───────┼───────┼───────┼───────╢
║ 320px    │ 292px    │ 1.74x │ 508px │ 2.19x │ 640px │ 2.19x │ 640px ║
║ 400px    │ 372px    │ 1.37x │ 508px │ 1.72x │ 640px │ 1.72x │ 640px ║
║ 480px    │ 452px    │ 1.12x │ 508px │ 1.42x │ 640px │ 1.42x │ 640px ║
║ 560px    │ 531px    │ 1.21x │ 640px │ 1.21x │ 640px │ 1.21x │ 640px ║
║ 640px    │ 611px    │ 1.05x │ 640px │ 1.05x │ 640px │ 1.05x │ 640px ║
║ 720px    │ 690px    │ 0.93x │ 640px │ 0.93x │ 640px │ 0.93x │ 640px ║
║ 800px    │ 438px    │ 1.46x │ 640px │ 1.46x │ 640px │ 1.46x │ 640px ║
║ 880px    │ 516px    │ 1.24x │ 640px │ 1.24x │ 640px │ 1.24x │ 640px ║
║ 960px    │ 594px    │ 1.08x │ 640px │ 1.08x │ 640px │ 1.08x │ 640px ║
║ 1040px   │ 673px    │ 0.95x │ 640px │ 0.95x │ 640px │ 0.95x │ 640px ║
║ 1120px   │ 651px    │ 0.98x │ 640px │ 0.98x │ 640px │ 0.98x │ 640px ║
║ 1200px   │ 700px    │ 0.91x │ 640px │ 0.91x │ 640px │ 0.91x │ 640px ║
║ 1280px   │ 700px    │ 0.91x │ 640px │ 0.91x │ 640px │ 0.91x │ 640px ║
╚══════════╧══════════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝
```

