Bible
=====
NPM application for reading Holy Bible verses

## Installation

```sh
$ npm install bible -g
```

## How to use

```sh
$ bible --help
usage: bible [options]

Read the Holy Bible using a NPM application.

options:
  --v, --version          print the version
  --lang, --language      set the Bible language
  --ref, --reference      the verse references that you want to read
  --help                  print this output

Documentation can be found at https://github.com/BibleJS/BibleApp
```

## Example

```sh
$ bible --lang EN --ref "Psalm 1"
You are reading Psalm 1
----------------
Psalms 1:1 | How blessed is the one who does not follow the advice of the wicked, or stand in the pathway with sinners, or sit in the assembly of scoffers!
Psalms 1:2 | Instead he finds pleasure in obeying the Lord’s commands; he meditates on his commands day and night.
Psalms 1:3 | He is like a tree planted by flowing streams; it yields its fruit at the proper time, and its leaves never fall off. He succeeds in everything he attempts.
Psalms 1:4 | Not so with the wicked! Instead they are like wind-driven chaff.
Psalms 1:5 | For this reason the wicked cannot withstand judgment, nor can sinners join the assembly of the godly.
Psalms 1:6 | Certainly the Lord guards the way of the godly, but the way of the wicked ends in destruction.
----------------
```

## Changelog

### `v0.1.1`
 - Added `--onlyVerses` option.
 - Upgrade to `bible.js@0.1.5`

### `v0.1.0`
 - First stable release
 - Upgrade to `bible.js@0.1.4`

## License
See LICENSE file.
