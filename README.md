# Panda Docs

What's black and white and read all over?

![Panda reading a newspaper](http://www.galaxyclock.com/panda_reading.jpg)

This is a documentation build system that takes Markdown files as sources, and produces HTML files. It runs on [Node.js](http://nodejs.org/), and uses [Jade](http://jade-lang.com/) as its templating engine.

A lot of the concepts are based on [maximebf's "beautiful-docs"](https://github.com/maximebf/beautiful-docs), but there are so many differences--the most notable being that this is in Javascript, not Coffeescript--that I decided to turn it into a complete fork.


## Features

 - Markdown syntax, the [NAMP](https://github.com/gjtorikian/namp) module. NAMP supports:
 	* [The standard Gruber syntax](http://daringfireball.net/projects/markdown/)
	* [The GitHub Flavored Markdown syntax](http://github.github.com/github-flavored-markdown/) (including language-specific codeblock fences)
	* [The PHP Markdown Extra syntax](http://michelf.com/projects/php-markdown/extra/)
	* [Maruku meta-data support](http://maruku.rubyforge.org/maruku.html#meta)
	* Support for [content references (conrefs) in Markdown](https://github.com/gjtorikian/markdown_conrefs)
	* _Inline_ metadata support (something Maruku does not do)
	* Strikethroughs
	* Conversion of `Note: `, `Tip: `, and `Warning: ` blocks into [Twitter Bootstrap alert blocks](http://twitter.github.com/bootstrap/components.html#alerts)
	* Build-time highlighting of `<pre>` code blocks
	For more information, check out the NAMP documentation.
 - Pass in individual files or entire directories
 - Embeddable metadata
 - Easy template customization (via Jade)

## Installation

Make sure you have a recent build of Node.js (this was tested on v0.6.0). Install it using npm:

    npm install panda-docs -g

Want to try a demonstration? Then clone this repository, and run

	node bin/panda-docs src/manifest.json 

That'll turn this README into a better looking HTML file in the _/out_ directory.

## Usage

    panda-docs </path/to/manifest.json> _[options]_ 

The _manifest.json_ file is mandatory, and all other options are optional. The default output directory here is _./out_.

If you'd like to use `panda-docs` in a script, you can! Simply define one like this:

```javascript
var panda = require("panda-docs");

panda.make(["./src/manifest.json", "-t", "Panda (from command line)"], function(err) {
    if (err) console.error(err);
});
```

You can find out more information on options you can use below:

### Manifest Files

A manifest file is a mandatory JSON file that indicates where your source files reside, as well as specifing customization options for your documentation pages.
 
A manifest file can have the properties listed below. All the properties are optional, with the exception of `files`.

 - `files`: An array defining the path to your files
 - `resources`: An array of directories to also copy into the _/out_ directory. This is usually used for accompanying or inline images.
 - `extension`: The extension of your Markdown files. Some people use `.md`, others `.markdown`, and still others `.text`. This is optional, and defaults to `.md`.
 - `home`: The file to display as the manual homepage (this won't show up in the TOC)
 - `category`: Category of the manual (used on the homepage) (defaults to nothing)
 - `css`: An absolute URL to a CSS stylesheet that will be included in every page
 - `codeHighlightTheme`: The name of [the highlightjs theme to use](http://softwaremaniacs.org/soft/highlight/en/) for code highlighting (defaults to 'github')
 - `embedly`: Activate embedly by passing in your API key. Links to embedly must be placed alone in a paragraph.
 - `github`: The `username/repo` on GitHub that's used to link through with the "Fork me on Github" banner. If this is omitted, then there's no banner.]

As noted above, files can either be absolute URIs, or relative to the manifest file. For example: 

    {
        "files": ["README.md", "../../someFile.md"]
    }


### Options

There are a number of arguments you can pass to Panda that affect the entire build. They are:

 - `-h, --help`: Display the help information
 - `-o`, `--output`: Resulting file(s) location [out]
 - `--outputAssets`: Resulting file(s) location for assets [out/assets]
 - `-t, --title`: Title of the documentation [Panda: Default Title Here]
 - `--template`: The location of your Jade templates [_./templates/default/layout.jade_]. Though the path is optional, you must have a valid Jade template _somewhere_.
 - `--assets`: The location of your assets (CSS, Javascript) [_./templates/default/assets_].
 - `--noheader`: Hides the header
 - `--notoc`: Does not compute the table of content in each document
 - `--baseurl` : Base URL of all links

## Jade templates

You have to specify at least one Jade file as a template for your pages. Within your Jade template, you have access to the following variables:

* `content` is the transformed HTML content of your Markdown file. Unless `notoc` option is used, an anchor tag is automatically injected inside each header tag to be used with the generated table of content. It could be used also to bookmark a specific section of a document
* `metadata` is an object containing your document-based metadata values
* `toc` is an object containing your document table of content. If `notoc` option is used, the toc is not generated, and this variable will be `false`
* `manifest` is an object containing the Manifest.json properties
* `options` is an object containing your passed in properties
* `fileName` is the name of the resulting file (without the extension)
* `title` is the title of the documentation
* `whoAmI` is the full path name of the source file
* `markdown` is a function you can use to make a call out to the Markdown processor. For example, you can use it like this in your template:  

```	
p	
    != markdown("This is _going_ to be represented as `Markdown`").html
```
Don't forget that Namp returns an object, so you'll need to add that `.html` at the end.
