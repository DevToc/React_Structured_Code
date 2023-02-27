# html-to-image
[html-to-image - Github](https://github.com/bubkoo/html-to-image)

Customized html-to-image is used for the following two reasons.

1. Font embedding issue
It has a CORS error related to webFontLoader when creating.
However, we don't need to use the text for calculating color contrast score.
For that reason, it removes the unused font embedding code.


2. CRA5.0 + html-to-image source map issue
