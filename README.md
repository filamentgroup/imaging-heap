:warning: This project is archived and the repository is no longer maintained.

# imaging-heap

There’s beauty in the breakdown of bitmap image data. A command line tool to measure the efficiency of your responsive image markup across viewport sizes and device pixel ratios.

Works out-of-the-box with `img` (of course), `img[srcset]`, `img[srcset][sizes]`, `picture`, `picture [srcset]`, `picture [srcset][sizes]`. Ignores `.svg` files. No support for background images (yet?).

## Installation

```sh
npm install --global imaging-heap
```

## Usage

```sh
imagingheap https://filamentgroup.com/
```

```sh
imagingheap http://example.com/ [options]

Options:
  --version        Show version number                                 [boolean]
  --min            Minimum viewport width                         [default: 320]
  --max            Maximum viewport width                        [default: 1280]
  --by             Increment viewport by                           [default: 80]
  --dpr            List of Device Pixel Ratios       [string] [default: "1,2,3"]
  --minimagewidth  Ignore images smaller than image width           [default: 5]
  --csv            Output CSV                         [boolean] [default: false]
  --help           Show help                                           [boolean]
```

### Debug Output

```sh
DEBUG=ImagingHeap* imagingheap https://filamentgroup.com/
```

## Sample output

```sh
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

## Related Projects

* Hugely inspired by the [NCC Image Checker Chrome Extension](https://github.com/nccgroup/image-checker) (which is a great visual tool). The main difference here is that imaging-heap will collate data across viewport sizes and device pixel ratios.
* [RespImageLint](https://ausi.github.io/respimagelint/) a Linter Bookmarklet for Responsive Images

## Important Links

* _A big big thank you_ for pre-release feedback from noted responsive images expert [Eric Portis](https://ericportis.com/) ([@eeeps](https://github.com/eeeps/)).
* Idea originally documented at [@zachleat/idea-book/3](https://github.com/zachleat/idea-book/issues/3)
* _“There’s beauty in the breakdown of bitmap image data.”_—[@jefflembeck](https://github.com/jefflembeck)
* [Responsive Images Community Group](https://responsiveimages.org/)
