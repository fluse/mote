#mote

Stop writing redudant css and don't reinvent the wheel each time. With mote, you write css in a simple and fast 3-char-code syntax. 
Today the website had to look like this and tomorrow like that. And if we try to use the old code, there is not a lot that we can use again without investing some time.

mote says: `stop writting css, set classes as usually.`

Everyone is welcomed to make this project rocket safer.

##Benefits

- sass based preprocessor
- easy customizable with settings and hooks
- small *.css filesize
- auto generate webfont
- responsive grid
- optional components like: tooltip, button, pagination, taglist and many more
- only one file for each page
- no css differences between test variations
- easy old code remove

## Documentations

* [Get Started](#getstarted)
* [Usage](#usage)
* [Component](#components)
* [Development](#development)

## Get Started

### Installation

#### 1. Clone mote:

```sh
$ git clone https://github.com/fluse/mote-css
```

#### 2. Install environment:

##### Switch directory

```sh
$ cd mote-css/
```

```sh
$ sh install.sh
```

##### Select OS

```sh
$ which os? (linux/mac)
```

#### 3. Export

##### Sturcture

```sh
$ node tasks
```

select first entry "First Install"

* docroot
 * mote
 * css
  * themes
   * {theme}
   * {theme}
  * concats
  * dist
   * {theme}
    * mote.css
    * mote.min.css

##### Theme

##### Create Theme

```sh
$ node tasks
```

select first entry "Theme -> Create"

### Include css

To use mote in your website, simply drop the stylesheet into your document's `<head>`.

```html
<head>
    <link rel="stylesheet" href="css/dist/{theme}/mote.min.css">
</head>
```

## Usage Documentation
* [Globals](#globals)
* [Grid](#grid)
* [Spacings](#naming-conventions)
* [Font-Size](#sizes)
* [NO JS Support](#nojs)
* [Components](#anatomy-of-rulesets)
 * [Button](#anatomy-of-rulesets)
 * [Stars](#anatomy-of-rulesets)
 * [Pagination](#anatomy-of-rulesets)
 * [Tags](#anatomy-of-rulesets)
 * [Tooltips](#tooltips)

### Usage

write css fast with 3-char-code syntax

| classname | description |
|----------|-------------|
| grd | grid |
| mgn | margin |
| pdg | padding |
| psn | position |
| bxs | box-shadow |
| brs | border style |
| clr | color |
| csr | cursor |
| flt | floating |
| txt | text-decoration |
| bgc | backround-color |
| bgt | background transparency |
| csr | cursor |
| ani | animation |
| txt | text |
| fsi | font-size |
| fsc | font-scale |
| dsp | display |
| flw | overflow |
| wdt | width in % |
| wds | width in px |
| hgt | height in px |
| lnh | line-height rem |
| zdx | z-index |

#### Markup Examples

```html
<div class="frm mgn-top-5 bgc-gry grd-each-4 cnr">
  <div class="pdg-10 pdg-no-top">1</div>
  <div class="fsi-20 txt-nln">2</div>
  <div>3</div>
  <div>4</div>
</div>
```

```html
<div class="frm grd-each-each fsi-30 mgn-top-10 bgc-red cnr zdx-1">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

#### Algorithms

| name | description |
|----------|-------------|
| -each | each element on first level |
| -scd | each element on second level |
| -owl | each element on first level without first element |


##### Each

```css
.each > * {
    attr: prop;
}
```

```html
<div class="mgn-25-each">
  <div>yes</div>
  <div>yes</div>
  <div>yes</div>
  <div>yes</div>
</div>
```

##### Second Level

select all elements in second depth width `-scd`

```css
.scd * > * {
    attr: prop;
}
```

```html
<div class="mgn-25-scd">

    <div>
        no
        <span>yes</span>
    </div>

    <div>
        no
        <span>yes</span>
    </div>

    <div>
        no
        <span>yes</span>
    </div>

    <div>
        no
        <span>yes</span>
    </div>

</div>
```

##### First Level without First-Child

with `-owl` you can select all child's from first level excluded first element

```css
.class * + * {
    attr: prop;
}
```

```html
<div class="mgn-25-owl">

  <div>no</div>

  <div>yes</div>

  <div>yes</div>

  <div>yes</div>

</div>
```

### Globals

#### Hide elements

```css
[hidden] {
  display: none;
}
```

```html
<span hidden>Where i'm</span>
```

#### Disable elements

*label disable* if input is disabled 

```css
input:disabled ~ label {
    opacity: 0.5;
}
```

*require symbole* after label

```css
label.req:after {
    content: " *";
    color: #c73434;
}
```

**markup example**

```html
<label class="req">You need to fill me. hihi!</label>
```

#### Cut text

trimmed to long text

```css
.cut {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    max-width: 100%;
    -moz-binding: url("/ellipsis.xml#ellipsis");
}
```

**markup example**

```html
<div class="cut">
    i'am cutted, but iam so lovely long
</div>
```

`i'am cutted...`

#### Filter

add blur or grayscale filter

**markup examples**

```html
<div class="filter-grayscale">
    i'am gray scaled
</div>
```

```html
<div class="filter-blur">
    i'am blurred
</div>
```

*****

### Grid

generate a responsive grid with an configurable count of columns

**markup example**

```html
<div class="frm grd-each-4">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
```

`grd-1`  `grd-2`  `grd-3` ...  `grd-12`

*****

### Spacings

set padding and / or margin as spacings between elements:

`mgn = margin`
`pdg = padding`

you can add the position of padding

`mgn-[direction]-[number]-[algorithm]`

#### Position

`mgn-top = top`
`mgn-rgt = right`
`mgn-btm = bottom`
`mgn-lft = left`
`mgn-vrt = vertical`
`mgn-hzn = horizontal`

#### Number

`mgn-5 = 0.5rem = 5px`
`mgn-10 = 1rem = 10px`
`mgn-15 = 1.5rem = 15px`

#### Algorithm

`mgn-top = top`

**class example**

`mgn-top-5-each`

*****

### Font-size

set the font-size with fsi-[size] like:

```html
<h3 class="fsi-18">I'am 1.8rem big</h3>
<p class="fsi-13">let me tell you some funny things</p>
```

you can set your needed sizes to following variable into `/themes/default/settings.scss`

```json
"font-size-list": "1 2 3 4 5 6 7 8 9 10 12 15 17 20 25 30 35 40 45"
```

all sizes will generated in rem, with px fallback

*****

### Border styles

brs = border-style

`brs-[type]-[position]-[size]`

#### Type

    -sld = solid
    -dtd = dotted

#### Position

    -top = top
    -btm = bottom
    -lft = left
    -rgt = right

#### Size

    s, m, l, xl

#### Markup

```html
<div class="brs-sld-top-s">
    <p>text</p>
</div>
```

### Border color

brc = border-color

    -grn = green
    -drk = dark
    - usw. usw. usw.

you can define all colors inside `themes/{theme}/colors.json`

#### Markup

```html
<div class="brs-sld-top-m brc-grn">
    <p>text</p>
</div>
```

*****

### Positions

use predefined element positions

psn = position

#### Behaviours

    -fxd = fixed
    -rel = relative
    -abs = absolute
    -stc = static

#### Inner Positions

    -cnr-top = inner top center
    -cnr-btm = inner bottom center
    -top     = top: 0;
    -top-rgt = top: 0; right: 0;
    -top-lft = top: 0; left: 0;
    -rgt     = right: 0;
    -btm     = bottom: 0;
    -btm-rgt = bottom: 0; right: 0;
    -btm-lft = bottom: 0; left: 0;
    -lft     = left: 0;

#### Outer Positions

out = outer positions

    -out-cnr-top = outer top center
    -out-cnr-btm = outer bottom center
    -out-top = bottom: 100%;
    -out-rgt = left: 100%;
    -out-btm = top: 100%;
    -out-lft = right: 100%;

#### Markup

```html
<div class="psr">
    <span class="psn-out-cnr-top-abs">I'm top outside related to my parent. Thats fun!</span>
    <span class="psn-out-cnr-btm-abs">I'm bottom outside related to my parent. Wohoo!</span>
</div>
```

### No JS Support

wrap your markup betwen this noscript tag to set different behaviors and styles, if javascript is deactivated

```html
<head>
  <link rel="stylesheet" href="mote.css">
</head>
<body>
    <noscript><div class="nojs"></noscript>
    
    <!-- your markup -->
    
    <noscript></div></noscript>
</body>
```

declaire your different css behaviors inside nojs.scss

```sh
$ vim sass/src/base/nojs.scss
```

```css
.nojs div {
    /* example*/
}
```

### Fonts from Google

load a font from google with with your config

```json
"font-google-list": {
    "Roboto": "100 300 400",
    "Fontname": "fontWeight1 fontWeight2"
}
```


## Components Documentation

* [Button](#button)
* [Stars](#stars)
* [Pagination](#pagination)
* [Tags](#tags)
* [Tooltips](#tooltips)
* [Toggels](#toggles)

### Button

#### Form Button

```html
<button class="btn">
    <span class="bgc-grn">
        <strong>send</strong>
        <i>c</i>
    </span>
</button>
```

#### Link Button

```html
<a href="#" class="btn">
    <span class="bgc-grn">
        <strong>send</strong>
        <i>c</i>
    </span>
</a>
```

*****

### Stars

set the number of active stars with following additioning:

```smarty
{include file="component/stars.tpl count=5 half=true}
```

set the position of the half star
 
**full: 5 of 5**

```html
<span class="sts-5"><i></i></span>
```
**half: 4,5 of 5**

```html
<span class="sts-4 sts-haf"><i></i></span>
```

**blank: 0 of 5**

```html
<span class="sts-0"><i></i></span>
```

*****

### Pagination

```smarty
{include file="component/pagination.tpl from=1 to=4 active=2 prefixUrl="/results/" suffixUrl=".php" css="cnr"}
```

```html
<ul class="pagination cnr">

    <li class="edg-prev">
        <a href="/results/1.php">prev
    </li>

    <li>
        <a href="/results/1.php">1
    </li>

    <li class="active">
        <a href="/results/2.php">2
    </li>

    <li>
        <a href="/results/3.php">3
    </li>

    <li>
        <a href="/results/4.php">4
    </li>

    <li class="edg-next">
        <a href="/results/3.php">next
    </li>
</ul>
```

*****

### Tags

```smarty
{include file="component/tag.tpl list="{array}" css="txt-rgt"}
```

```html
<ul class="tag-list brs-t-1-each bgc-wht-each pdg-5 brc-gry-each brs-sld-t-1 brc-wht rnd-each brc-gry-drk-each">
    <li>tagname <i class="glyph-xxxs bgc-grn-txc rnd">v</i></li>
    <li>tagname <i class="glyph-xxxs bgc-grn-txc rnd">v</i></li>
</ul>
```

*****

### Pure css tooltips

```smarty
{include file="component/tip.tpl position="top" content="hello world" translation="hover me" css="txt-rgt"}
```

```html
<span class="element-with-text tip-rgt" data-tip="hello world!">
    hover me
</span>
```

#### position options

- top
- rgt
- btm
- lft

*****

### Pure css toggels

```smarty
{include file="components/toggle.tpl" id="toggle" name="toggle" translation="click_me" css="wdt-20"}
```

```html
<div class="toggle">
    <input type="checkbox" id="toggle" name="toggle />
    <label for="toggle">Click me</label>
</div>
```

*****

## Development Documentation

* [Create Theme](#theme)
* [Concat Files](#concat)
* [Compile](#compile)
* [Iconfont](#iconfont)
* [Clean](#Clean)

### Create Theme

setup your theme

```sh
$ grunt theme -name=name
```

this duplicate all default settings from default theme into given theme name folder

```sh
$ sass/themes/flat/**/*.scss
```

### Concat Files

create a new listOfFiles.scss or /folder/listOfFiles.scss into:

```sh
/sass/concats/$ touch {folder}/{file}.scss
```

import all needed files from following folders:

-base
-ui
-components
-vendor

```html
@import "%path%/src/ui/font";
```

path tag will be replaced with relative sass path

`%path%` to `../../` or deeper (relative to concat depth

### Compile Workflow

#### All themes

```sh
$ grunt compile
```

all existing theme will be merged with each concat files relative to folders depth

#### Specific theme

```sh
$ grunt compile -theme={name}
```

### Font generation

```sh
$ grunt font -name={name}
```

will generate an font with all icons from:

```sh
$ deliver/font/{name}/*.svg
```

*example*

* add.svg
* remove.svg
* check.svg
* magnify.svg

you can use all icons like:

```html
<i class="icn-add"></i>
<i class="icn-remove"></i>
<i class="icn-check"></i>
<i class="icn-magnify"></i>
```

### Clean all Folder

```sh
$ grunt clean
```

```sh
$ grunt clean -folder
```

## Browser Support

- Chrome 18+
- Firefox 3+
- Safari 5+
- IE 8 partial / 9+

## License

MIT © [mote](https://bitbucket.org/fluse/mote)
