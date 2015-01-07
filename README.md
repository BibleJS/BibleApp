Bible
=====
Bible.JS CLI client. Read the Holy Bible via the command line.

## Installation

```sh
$ npm install -g bible
```

## How to use

```sh
$ ./bible.js --help
bible --help
usage: bible [options] [reference1, reference2, ...]

CLI client for bible.js NPM module. Read the Holy Bible via command line

options:
  --v, --version          print the version
  --lang, --language      set the Bible language
  --onlyVerses            prevent showing additional outpt
  --s, --search           get the verses that match to the string or
                          regular expression provided
  --rc, --resultColor     set the result color when searching something
  --help                  print this output

references:
 - References separated by spaces (see example):

example:
   bible --lang en 'John 1:1-10' 'Genesis 2:3-7'
   bible --lang ro --search 'Meroza'
   bible --lang ro --search '/Meroza/gi'

When the module is initialized, the packages listed in configuration file,
are downloaded and used (~/.bible directory).  The configuration is stored
in a JSON file, in the home directory: ~/.bible-config.json

If this doesn't exist, it's created at the first `bible` call.

You can create custom packages, including them there (in  the `versions`
field). The additional configuration fields are listed below:

 - `language`: a string representing the default language (if this is set,
               `--lang`  is not needed anymore unless you want to override
               the language value)

 - `resultColor`: a string  representing  the  default  result color  when
                  searching    something   (if  this  is  set,  `--rc`  or
                  `--resultColor`  options are not needed anymore unless
                  you want to override the `resultColor` value)

 - `searchLimit`: an integer representing max number of verses that will be
                  output when searching something


Documentation can be found at https://github.com/BibleJS/BibleApp
```

## First run
Like documented above, on the first run the application will sync the submodules
creating the configuration file (`~/.bible-config.json`) and downloading the
submodules in the `~/.bible` directory.

```sh
$ bible 'Genesis 1:1'
warn  [...] No configuration file was found. Initing the configuration file.
warn  [...] The configuration file created successfully at the following location: /home/ionicabizau/.bible-config.json
info  [...] ~/.bible directory was not found. Downloading packages. This may take a while.
...
```

The default configuration file is:

```json
{
    "versions": {
        "en": {
            "source": "https://github.com/BibleJS/bible-english",
            "version": "master",
            "language": "en"
        },
        "ro": {
            "source": "https://github.com/BibleJS/bible-romanian",
            "version": "master",
            "language": "ro"
        }
    },
    "resultColor": "255, 0, 0",
    "searchLimit": 10,
    "language": "en"
}
```

If the system language is Romanian, then the `language` field will be `ro`.

## Examples

```js
# Provide the reference and the language
$ bible --lang en '2 Peter 3:9-18'
Reference: 2 Peter 3:9-18
┌────────────┬────────────────────────────────────────────────────────────────────────────────┐
│ 2 Peter 3:9│The Lord is not slow concerning his promise, as some regard slowness, but is    │
│            │being patient toward you, because he does not wish for any to perish but for all│
│            │to come to repentance.                                                          │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:10│But the day of the Lord will come like a thief; when it comes, the heavens will │
│            │disappear with a horrific noise, and the celestial bodies will melt away in a   │
│            │blaze, and the earth and every deed done on it will be laid bare.               │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:11│Since all these things are to melt away in this manner, what sort of people must│
│            │we be, conducting our lives in holiness and godliness,                          │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:12│while waiting for and hastening the coming of the day of God? Because of this   │
│            │day, the heavens will be burned up and dissolve, and the celestial bodies will  │
│            │melt away in a blaze!                                                           │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:13│But, according to his promise, we are waiting for new heavens and a new earth,  │
│            │in which righteousness truly resides.                                           │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:14│Therefore, dear friends, since you are waiting for these things, strive to be   │
│            │found at peace, without spot or blemish, when you come into his presence.       │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:15│And regard the patience of our Lord as salvation, just as also our dear brother │
│            │Paul wrote to you, according to the wisdom given to him,                        │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:16│speaking of these things in all his letters. Some things in these letters are   │
│            │hard to understand, things the ignorant and unstable twist to their own         │
│            │destruction, as they also do to the rest of the scriptures.                     │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:17│Therefore, dear friends, since you have been forewarned, be on your guard that  │
│            │you do not get led astray by the error of these unprincipled men and fall from  │
│            │your firm grasp on the truth.                                                   │
├────────────┼────────────────────────────────────────────────────────────────────────────────┤
│2 Peter 3:18│But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him │
│            │be the honor both now and on that eternal day.                                  │
└────────────┴────────────────────────────────────────────────────────────────────────────────┘

# One verse
$ bible --lang en 'Genesis 1:24'
Reference: Genesis 1:24
┌────────────┬──────────────────────────────────────────────────────────────────────────────┐
│Genesis 1:24│God said, “Let the land produce living creatures according to their kinds:    │
│            │cattle, creeping things, and wild animals, each according to its kind.” It was│
│            │so.                                                                           │
└────────────┴──────────────────────────────────────────────────────────────────────────────┘

# Without table
$ bible --lang en 'Genesis 1:24' --onlyVerses
God said, “Let the land produce living creatures according to their kinds: cattle, creeping things,
and wild animals, each according to its kind.” It was so.

# Use together with `cowsay`
$ cowsay `bible --lang en 'Genesis 1:24' --onlyVerses`
 ________________________________________
/ God said, “Let the land produce living \
| creatures according to their kinds:    |
| cattle, creeping things, and wild      |
| animals, each according to its kind.”  |
\ It was so.                             /
 ----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

# Or convert it to speech
$ say `bible --lang en 'Genesis 1:24' --onlyVerses`

# Search (currently supported only in the Romanian submodule)
$ bible --search '/meroza/i'
Results for search: /meroza/i
┌───────────────┬───────────────────────────────────────────────────────────────────────────────┐
│Judecători 5:23│Blestemaţi pe Meroza, a zis Îngerul Domnului, blestemaţi,                      │
│               │blestemaţi pe locuitorii lui; căci n-au venit în ajutorul Domnului, în ajutorul│
│               │Domnului, printre oamenii viteji.                                              │
└───────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

## Changelog
### `v1.0.0`
 - Changed the CLI options.
 - Upgraded to bible.js@2.0.0
 - Allow BibleJS submodules.
 - Improved output.

### `v0.1.3`
 - Added search feature upgrading the `bible.js` module to `v0.1.6`. It supports only Romanian language.
 - Set the default searched result color using `--rc` or `--resultColor`
 - Added `couleurs` as dependency

### `v0.1.2`
 - Upgrade to `bible.js@0.1.6`

### `v0.1.1`
 - Added `--onlyVerses` option.
 - Upgrade to `bible.js@0.1.5`

### `v0.1.0`
 - First stable release
 - Upgrade to `bible.js@0.1.4`

## License
See LICENSE file.
